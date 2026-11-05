
import crypto from "node:crypto";
import readline from "node:readline";

// Configuração
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";
const SALT_LENGTH = 16;

// Gera hash da senha
async function hashSenha(senha, saltHex = null) {

    const salt = saltHex
        ? Buffer.from(saltHex, "hex")
        : crypto.randomBytes(SALT_LENGTH);

    const hash = crypto.pbkdf2Sync(
        senha,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        DIGEST
    );

    return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

// Confere se a senha corresponde ao hash armazenado
async function conferirSenha(senha, guardado) {

    const [saltHex, hashOriginal] = guardado.split(":");

    const hashCalculado = await hashSenha(senha, saltHex);

    const hashNovo = hashCalculado.split(":")[1];

    const bufferOriginal = Buffer.from(hashOriginal, "hex");
    const bufferNovo = Buffer.from(hashNovo, "hex");

    if (bufferOriginal.length !== bufferNovo.length) {
        return false;
    }

    return crypto.timingSafeEqual(bufferOriginal, bufferNovo);
}

// Interface de terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Digite a senha que deseja criptografar: ", async (senha) => {

    const resultado = await hashSenha(senha);

    console.log("\n==================================");
    console.log("HASH GERADO:");
    console.log(resultado);
    console.log("==================================");

    rl.question("\nDeseja testar a senha? (s/n): ", async (resposta) => {

        if (resposta.toLowerCase() === "s") {

            rl.question("Digite a senha para conferir: ", async (senhaTeste) => {

                const valido = await conferirSenha(senhaTeste, resultado);

                console.log(
                    valido
                        ? "\nSenha válida!"
                        : "\nSenha inválida!"
                );

                rl.close();
            });

        } else {
            rl.close();
        }
    });
});
