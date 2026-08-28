import api from '../../services/api.js';


async function dadosResponsavel() {
    const { data } = await api.get('/auth/me');
    const id = data.id;
    const nome = data.nome;
    const sobrenome = data.sobrenome;
    const email = data.email;

    return { id, nome, sobrenome, email }
}

function transformarHoras(milissegundos) {
    const segundos = Math.floor((milissegundos / 1000) % 60);
    const minutos = Math.floor((milissegundos / (1000 * 60)) % 60);
    const horas = Math.floor(milissegundos / (1000 * 60 * 60));

    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

export async function generatePDFController(dados) {
    const listaTempo = [];
    let quantidadePessoas = 0;
    let tempoGeralMili = 0;

    dados.forEach((solicitacao) => {
        const tempoSolicitacao =
            new Date(solicitacao.fim).getTime() -
            new Date(solicitacao.inicio).getTime();

        let totalFuncionariosNaSolicitacao = 0;

        solicitacao.justificativas.forEach((just) => {
            if (just.funcionarios && Array.isArray(just.funcionarios)) {
                totalFuncionariosNaSolicitacao += just.funcionarios.length;

                just.funcionarios.forEach((funcionario) => {
                    listaTempo.push({
                        centroCusto: funcionario.codigoCentroCusto,
                        tempo: tempoSolicitacao
                    });
                });
            }
        });

        const tempoTotalSolicitacaoMili = tempoSolicitacao * totalFuncionariosNaSolicitacao;
        solicitacao.totalHoras = transformarHoras(tempoTotalSolicitacaoMili);

        quantidadePessoas += totalFuncionariosNaSolicitacao;
        tempoGeralMili += tempoTotalSolicitacaoMili;
    });

    // Agrupamento por Centro de Custo
    const entradasCC = Object.entries(
        listaTempo.reduce((acc, item) => {
            acc[item.centroCusto] = (acc[item.centroCusto] || 0) + item.tempo;
            return acc;
        }, {})
    );

    // 2. Usamos Promise.all com map ASYNC
    const tempoPorCC = await Promise.all(
        entradasCC.map(async ([centroCusto, tempo]) => {
            try {
                const { data } = await api.get(`/query/nomeCC`, {
                    params: { codCC: centroCusto }
                });

                return {
                    centroCusto,
                    nomeCC: data,
                    tempo: transformarHoras(tempo)
                };
            } catch (error) {
                console.error("Erro na busca do CC:", error);
                return {
                    centroCusto,
                    nomeCC: "C.C. não encontrado",
                    tempo: transformarHoras(tempo)
                };
            }
        })
    );

    let { id, nome, sobrenome, email } = await dadosResponsavel();

    return {
        idResp: id,
        data: new Date(),
        nomeResp: nome,
        sobrenomeResp: sobrenome,
        emailResp: email,
        totalPessoas: quantidadePessoas,
        horasTotais: transformarHoras(tempoGeralMili),
        porCentroCusto: tempoPorCC, // Agora este array conterá os dados da API
        solicitacoes: dados
    };
}