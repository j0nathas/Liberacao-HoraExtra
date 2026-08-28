import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

// ============================================================
// PALETA DE CORES
// ============================================================
const PALETA = [
    { accent: "#1E40AF", bg: "#F8FAFC", badgeBg: "#E0F2FE", badgeText: "#0369A1" },
    { accent: "#0F766E", bg: "#F0FDFA", badgeBg: "#CCFBF1", badgeText: "#115E59" },
    { accent: "#6D28D9", bg: "#F5F3FF", badgeBg: "#EDE9FE", badgeText: "#5B21B6" },
    { accent: "#C2410C", bg: "#FFF7ED", badgeBg: "#FFEDD5", badgeText: "#9A3412" },
];

const empresas = [
    { nome: 'INSTITUTO TECNICO EDUCACIONAL MIRIAN MENCHINI', formatado: 'ITEMM' },
    { nome: 'Temporário', formatado: 'ITEMM' },
    { nome: 'EXPERT CONSULTORIA E TERCEIRIZAÇÃO LTDA', formatado: 'EXPERT' },
    { nome: 'MAGNA DO BRASIL PROD E SERV AUT LTDA', formatado: 'MAGNA' },
    { nome: 'OLSA BRASIL INDUSTRIA E COMERCIO LTDA', formatado: 'OLSA' },
    { nome: 'MAGNA DO BRASIL PROD E SERV AUTOMOTIVOS LTDA', formatado: 'MAGNA' },
    { nome: 'CLT', formatado: 'CLT' },
    { nome: 'BETEL TEMPORARIOS E TERCEIRIZADOS EIRELI', formatado: 'BETEL' }
];

// ============================================================
// ESTILOS
// ============================================================
const styles = StyleSheet.create({
    page: {
        paddingTop: 80,
        paddingBottom: 60,
        paddingHorizontal: 40,
        backgroundColor: "#FFFFFF",
        fontSize: 9,
        fontFamily: "Helvetica",
        color: "#334155",
    },
    header: {
        position: "absolute",
        top: 30,
        left: 40,
        right: 40,
        borderBottom: "1.5 solid #CBD5E1",
        paddingBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    title: { color: "#0F172A", fontSize: 16, fontWeight: "bold" },
    subtitle: { color: "#64748B", fontSize: 9, marginTop: 2 },
    headerMeta: { fontSize: 8, color: "#94A3B8", textAlign: "right" },

    card: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#F8FAFC",
        border: "1 solid #E2E8F0",
        borderRadius: 6,
    },
    sectionTitle: {
        color: "#1E293B",
        fontSize: 10,
        fontWeight: "bold",
        paddingBottom: 2,
        marginBottom: 8,
        textTransform: "uppercase",
        borderBottom: "1 solid #c1d6f7"
    },

    kpiRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
    kpiBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: "#F1F5F9",
        borderRadius: 6,
        borderLeft: "3 solid #3B82F6",
    },
    kpiLabel: { fontSize: 7, color: "#64748B", fontWeight: "bold" },
    kpiValue: { fontSize: 16, color: "#0F172A", fontWeight: "bold" },

    // Tabelas
    table: { marginTop: 4, border: "1 solid #E2E8F0", borderRadius: 4, overflow: "hidden" },
    tableHeader: { flexDirection: "row", backgroundColor: "#F1F5F9", padding: 5 },
    tableRow: { flexDirection: "row", padding: 5, borderBottom: "1 solid #F1F5F9", alignItems: "center" },
    tableRowAlternate: { flexDirection: "row", padding: 5, backgroundColor: "#F8FAFC", borderBottom: "1 solid #F1F5F9", alignItems: "center" },
    tableHeaderText: { fontSize: 7, color: "#475569", fontWeight: "bold", textTransform: "uppercase" },

    // Colunas Centro de Custo
    colCCode: { width: "15%" },
    colCCName: { width: "65%" },
    colCCTime: { width: "20%", textAlign: "right" },

    // Colunas Funcionários
    colRE: { width: "10%" },
    colNome: { width: "35%" },
    colFuncCC: { width: "10%", textAlign: "center" },
    colEmpresa: { width: "20%" },
    colCargo: { width: "25%" },

    // Máquina e Justificativa
    machineHeader: {
        backgroundColor: "#E2E8F0",
        padding: 4,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 2
    },
    machineName: { fontSize: 8, fontWeight: "bold", color: "#1E293B" },
    justificativaBox: {
        padding: 6,
        backgroundColor: "#FFFFFF",
        borderLeft: "2 solid #94A3B8",
        marginVertical: 4,
    },
    justificativaLabel: { fontSize: 6, color: "#64748B", textTransform: "uppercase", marginBottom: 2 },
    justificativaText: { fontSize: 8, italic: true, color: "#475569" },

    solicitacaoWrapper: { marginBottom: 20 },
    solicitacaoBody: { padding: 10, borderRadius: 6, border: "1 solid #E2E8F0", borderLeftWidth: 3 },

    badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 10 },

    footer: { position: "absolute", bottom: 25, left: 40, right: 40, textAlign: "center", color: "#94A3B8", fontSize: 7, borderTop: "1 solid #E2E8F0", paddingTop: 8 },
    pageNumber: { position: "absolute", bottom: 25, right: 40, fontSize: 7, color: "#94A3B8" },
});

// ============================================================
// FORMATADORES
// ============================================================
const formatDateTime = (str) => {
    if (!str) return "—";
    const [date, time] = str.split("T");
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y} ${time || ""}`;
};

const formatDuracao = (hhmmss) => {
    if (!hhmmss) return "0h";
    const [h, m] = hhmmss.split(":").map(Number);
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

// ============================================================
// COMPONENTES
// ============================================================
function ResumoConsolidado({ dados }) {
    return (
        <View wrap={false}>
            <View style={styles.kpiRow}>
                <View style={styles.kpiBox}>
                    <Text style={styles.kpiLabel}>Total Pessoas</Text>
                    <Text style={styles.kpiValue}>{dados.totalPessoas}</Text>
                </View>
                <View style={[styles.kpiBox, { borderLeftColor: "#10B981" }]}>
                    <Text style={styles.kpiLabel}>Carga Horária Total</Text>
                    <Text style={styles.kpiValue}>{formatDuracao(dados.horasTotais)}</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Distribuição por Centro de Custo</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.colCCode]}>Código</Text>
                        <Text style={[styles.tableHeaderText, styles.colCCName]}>Nome do Centro de Custo</Text>
                        <Text style={[styles.tableHeaderText, styles.colCCTime]}>Tempo</Text>
                    </View>
                    {dados.porCentroCusto?.map((cc, i) => (
                        <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
                            <Text style={[{ fontSize: 8, fontWeight: 'bold' }, styles.colCCode]}>{cc.centroCusto}</Text>
                            <Text style={[{ fontSize: 8 }, styles.colCCName]}>{cc.nomeCC}</Text>
                            <Text style={[{ fontSize: 8, textAlign: 'right' }, styles.colCCTime]}>{formatDuracao(cc.tempo)}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

function SolicitacaoBloco({ solicitacao, index }) {
    const cor = PALETA[index % PALETA.length];

    return (
        <View style={styles.solicitacaoWrapper} wrap={false}>
            {/* Header da Solicitação */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <View style={{ backgroundColor: cor.accent, padding: 4, borderRadius: 3, marginRight: 8 }}>
                    <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 7, color: '#64748B' }}>SOLICITAÇÃO #{solicitacao.id} • {solicitacao.tipo}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0F172A' }}>{solicitacao.motivoMacro}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: cor.badgeBg }]}>
                    <Text style={{ color: cor.badgeText, fontSize: 9, fontWeight: 'bold' }}>{formatDuracao(solicitacao.totalHoras)}</Text>
                </View>
            </View>

            <View style={[styles.solicitacaoBody, { backgroundColor: cor.bg, borderLeftColor: cor.accent }]}>
                {/* Meta Dados */}
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={{ flex: 1 }}><Text style={styles.justificativaLabel}>Planta</Text><Text style={{ fontSize: 9, fontWeight: 'bold' }}>{solicitacao.planta}</Text></View>
                    <View style={{ flex: 1 }}><Text style={styles.justificativaLabel}>Departamento</Text><Text style={{ fontSize: 9, fontWeight: 'bold' }}>{solicitacao.departamento}</Text></View>
                    <View style={{ flex: 1 }}><Text style={styles.justificativaLabel}>Período</Text><Text style={{ fontSize: 8 }}>{formatDateTime(solicitacao.inicio)} - {formatDateTime(solicitacao.fim)}</Text></View>
                </View>

                {/* Justificativas por Máquina */}
                {solicitacao.justificativas?.map((just, jIdx) => (
                    <View key={jIdx} style={{ marginTop: 8 }}>
                        <View style={styles.machineHeader}>
                            <Text style={styles.machineName}>MÁQUINA: {just.maquina.name} ({just.maquina.id})</Text>
                        </View>

                        <View style={styles.justificativaBox}>
                            <Text style={styles.justificativaLabel}>Justificativa:</Text>
                            <Text style={styles.justificativaText}>{just.justificativa || "Não informada."}</Text>
                        </View>

                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderText, styles.colRE]}>RE</Text>
                                <Text style={[styles.tableHeaderText, styles.colNome]}>Funcionário</Text>
                                <Text style={[styles.tableHeaderText, styles.colFuncCC]}>CC</Text>
                                <Text style={[styles.tableHeaderText, styles.colEmpresa]}>Empresa</Text>
                                <Text style={[styles.tableHeaderText, styles.colCargo]}>Cargo</Text>
                            </View>
                            {just.funcionarios?.map((f, fIdx) => (
                                <View key={fIdx} style={fIdx % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
                                    <Text style={[styles.colRE, { fontSize: 8 }]}>{f.re}</Text>
                                    <Text style={[styles.colNome, { fontSize: 8, fontWeight: 'bold' }]}>{f.name}</Text>
                                    <Text style={[styles.colFuncCC, { fontSize: 8 }]}>{f.codigoCentroCusto}</Text>
                                    <Text style={[styles.colEmpresa, { fontSize: 7 }]}>
                                        {empresas.find(e => e.nome === f.empresa)?.formatado || f.empresa}
                                    </Text>
                                    <Text style={[styles.colCargo, { fontSize: 7 }]}>{f.cargo}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

export default function DocumentPDF({ dadosConsolidados }) {
    if (!dadosConsolidados) return null;
    const geradoEm = new Date().toLocaleString("pt-BR");

    return (
        <Document title={`Relatório HE - ${dadosConsolidados.nomeResp}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header} fixed>
                    <View>
                        <Text style={styles.title}>Solicitações de Hora Extra</Text>
                        <Text style={styles.subtitle}>Relatório Técnico Consolidado</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.headerMeta}>Emissão: {geradoEm}</Text>
                        <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#475569' }}>
                            Resp: {dadosConsolidados.nomeResp} {dadosConsolidados.sobrenomeResp}
                        </Text>
                    </View>
                </View>

                <ResumoConsolidado dados={dadosConsolidados} />

                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
                    Detalhamento por Posto de Trabalho ({dadosConsolidados.solicitacoes?.length})
                </Text>

                {dadosConsolidados.solicitacoes?.map((sol, i) => (
                    <SolicitacaoBloco key={i} solicitacao={sol} index={i} />
                ))}

                <Text style={styles.footer} fixed>
                    Documento de uso restrito - Magna do Brasil
                </Text>
                <Text style={styles.pageNumber} fixed
                    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                />
            </Page>
        </Document>
    );
}