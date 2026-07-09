function transformarHoras(milissegundos) {
    const segundos = Math.floor((milissegundos / 1000) % 60);
    const minutos = Math.floor((milissegundos / (1000 * 60)) % 60);
    const horas = Math.floor(milissegundos / (1000 * 60 * 60));

    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

export function generatePDFController(dados) {
    const listaTempo = [];
    let quantidadePessoas = 0;
    let tempoGeralMili = 0;

    dados.forEach((solicitacao) => {
        const tempo =
            new Date(solicitacao.fim).getTime() -
            new Date(solicitacao.inicio).getTime();

        const tempoTotal = tempo * solicitacao.funcionarios.length;

        solicitacao.totalHoras = transformarHoras(tempoTotal);

        quantidadePessoas += solicitacao.funcionarios.length;

        const temposFuncionarios = solicitacao.funcionarios.map((funcionario) => ({
            centroCusto: funcionario.codigoCentroCusto,
            tempo
        }));

        listaTempo.push(temposFuncionarios);

        tempoGeralMili += tempoTotal;
    });

    const listaTempoPlana = listaTempo.flat();

    const tempoPorCC = Object.entries(
        listaTempoPlana.reduce((acc, item) => {
            acc[item.centroCusto] =
                (acc[item.centroCusto] || 0) + item.tempo;

            return acc;
        }, {})
    ).map(([centroCusto, tempo]) => ({
        centroCusto,
        tempo: transformarHoras(tempo)
    }));

    return {
        totalPessoas: quantidadePessoas,
        horasTotais: transformarHoras(tempoGeralMili),
        porCentroCusto: tempoPorCC,
        solicitacoes: dados
    };
}