export function getISOWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));

    const firstThursday = new Date(d.getFullYear(), 0, 4);
    firstThursday.setDate(
        firstThursday.getDate() +
        3 -
        ((firstThursday.getDay() + 6) % 7)
    );

    return (
        1 +
        Math.round((d - firstThursday) / (7 * 24 * 60 * 60 * 1000))
    );
}

export function formatDate(dateString) {
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');

    return `${day}/${month}/${year}`;
}

export function totalHours(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInSeconds = (end - start) / 1000;
    return (diffInSeconds / 3600).toFixed(0);
}

export function totalAccHours(startDate, endDate, qntdeFuncionarios) {
    const result = totalHours(startDate, endDate);
    return result * qntdeFuncionarios;
}

export function adaptarSolicitacoesParaForms(solicitacoes = []) {
    return solicitacoes.map((s, index) => ({
        id: index + 1,
        planta: s.planta,
        tipo: s.tipoSolicitacao,
        tipoSolicitacao: s.tipoSolicitacao,
        motivoMacro: s.motivoMacro,
        motivoMacroId: s.motivoMacroId,
        departamento: s.departamento,
        inicio: s.inicio?.slice(0, 16),
        fim: s.fim?.slice(0, 16),
        turno: s.turno,
        justificativas: (s.justificativas || []).map((j) => ({
            id: j.id,
            justificativa: j.justificativa,
            maquina: typeof j.maquina === 'string'
                ? { id: j.maquina, name: j.maquina }
                : j.maquina,
            funcionarios: (j.funcionarios || []).map((f) => ({
                re: f.RE,
                name: f.nome,
                codigoCentroCusto: f.codigoCentroCusto,
                empresa: f.empresa,
                cargo: f.cargo
            })),
        })),
    }));
}