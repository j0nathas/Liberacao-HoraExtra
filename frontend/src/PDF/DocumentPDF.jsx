import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

// ============================================================
// PALETA DE CORES — Sofisticada e de Alta Legibilidade
// ============================================================
const PALETA = [
    { accent: "#1E40AF", bg: "#F8FAFC", badgeBg: "#E0F2FE", badgeText: "#0369A1" }, // Azul Real
    { accent: "#0F766E", bg: "#F0FDFA", badgeBg: "#CCFBF1", badgeText: "#115E59" }, // Esmeralda / Teal
    { accent: "#6D28D9", bg: "#F5F3FF", badgeBg: "#EDE9FE", badgeText: "#5B21B6" }, // Roxo Índigo
    { accent: "#C2410C", bg: "#FFF7ED", badgeBg: "#FFEDD5", badgeText: "#9A3412" }, // Âmbar Escuro
];

//============================================================
// MAP EMPRESAS 
//============================================================
const empresas = [{
    nome: 'INSTITUTO TECNICO EDUCACIONAL MIRIAN MENCHINI',
    formatado: 'ITEMM'
},
{
    nome: 'Temporário',
    formatado: 'ITEMM'
},
{
    nome: 'EXPERT CONSULTORIA E TERCEIRIZAÇÃO LTDA',
    formatado: 'EXPERT'
},
{
    nome: 'MAGNA DO BRASIL PROD E SERV AUT LTDA',
    formatado: 'MAGNA'
},
{
    nome: 'OLSA BRASIL INDUSTRIA E COMERCIO LTDA',
    formatado: 'OLSA'
},
{
    nome: 'MAGNA DO BRASIL PROD E SERV AUTOMOTIVOS LTDA',
    formatado: 'MAGNA'
},
{
    nome: 'CLT',
    formatado: 'CLT'
},
{
    nome: 'BETEL TEMPORARIOS E TERCEIRIZADOS EIRELI',
    formatado: 'BETEL'
}


]



// ============================================================
// ESTILOS (Design System Otimizado para Impressão/PDF)
// ============================================================
const styles = StyleSheet.create({
    page: {
        paddingTop: 80,      // Espaço reservado para o Header Fixo
        paddingBottom: 60,   // Espaço reservado para o Footer Fixo
        paddingHorizontal: 40,
        backgroundColor: "#FFFFFF",
        fontSize: 9,
        fontFamily: "Helvetica",
        color: "#334155",
    },

    // ---------- Header Fixo ----------
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
    title: {
        color: "#0F172A",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    subtitle: {
        color: "#64748B",
        fontSize: 9,
        marginTop: 2,
    },
    headerMeta: {
        fontSize: 8,
        color: "#94A3B8",
        textAlign: "right",
    },

    // ---------- Cards e Blocos ----------
    card: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#F8FAFC",
        border: "1 solid #E2E8F0",
        borderRadius: 6,
    },
    sectionTitle: {
        color: "#1E293B",
        fontSize: 11,
        fontWeight: "bold",
        paddingBottom: 2,
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        borderBottom: "1 solid #c1d6f7"
    },

    // ---------- Responsável ----------

    respRow: {
        flexDirection: "column",
        alignItems: 'flex-end',
        gap: 2,
        marginBottom: 5
    },

    respBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'start',
        gap: 2,
    },
    respLabel: {
        fontSize: 6,
        color: "#94A3B8",
    },
    respValue: {
        fontSize: 6,
        color: "#94A3B8",
    },

    // ---------- KPIs Métrica ----------
    kpiRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    kpiBox: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: "#F1F5F9",
        borderRadius: 6,
        borderLeft: "3 solid #3B82F6",
    },
    kpiLabel: {
        fontSize: 8,
        color: "#64748B",
        textTransform: "uppercase",
        marginBottom: 2,
        fontWeight: "bold",
    },
    kpiValue: {
        fontSize: 18,
        color: "#0F172A",
        fontWeight: "bold",
    },

    // ---------- Estrutura de Tabelas ----------
    table: {
        marginTop: 6,
        border: "1 solid #E2E8F0",
        borderRadius: 4,
        overflow: "hidden",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderBottom: "1 solid #E2E8F0",
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderBottom: "1 solid #F1F5F9",
        alignItems: "center",
    },
    tableRowAlternate: {
        flexDirection: "row",
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: "#F8FAFC",
        borderBottom: "1 solid #F1F5F9",
        alignItems: "center",
    },
    tableHeaderText: {
        fontSize: 7.5,
        color: "#475569",
        fontWeight: "bold",
        textTransform: "uppercase",
    },

    // Colunas Alinhadas (Resumos)
    colCentro: { width: "70%" },
    colTempo: { width: "30%", textAlign: "right", color: "#002a85" },

    // Colunas Alinhadas (Funcionários)
    colID: { width: "6%", textAlign: "left" },
    colNome: { width: "32%" },
    colCC: { width: "6%", textAlign: "center" },
    colEmpresa: { width: "23%", textAlign: "center" },
    colCargo: { width: "13%" },
    colMaquina: { width: "20%", textAlign: "right" },

    // ---------- Grids de Informação ----------
    row: {
        flexDirection: "row",
        marginBottom: 8,
        gap: 10,
    },
    column: {
        flexDirection: "column",
        flex: 1,
    },
    label: {
        color: "#64748B",
        fontSize: 7.5,
        textTransform: "uppercase",
        marginBottom: 2,
    },
    value: {
        color: "#0F172A",
        fontSize: 9,
        fontWeight: "bold",
    },
    valueRegular: {
        color: "#334155",
        fontSize: 8.5,
    },

    badge: {
        alignSelf: "center",
        fontSize: 8,
        fontWeight: "bold",
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
    },

    // ---------- Caixas de Texto Corrido ----------
    descriptionBox: {
        backgroundColor: "#FFFFFF",
        padding: 8,
        borderRadius: 4,
        border: "1 solid #E2E8F0",
        borderLeft: "3 solid #94A3B8",
        marginVertical: 8,
    },
    descriptionText: {
        fontSize: 8.5,
        lineHeight: 1.3,
        color: "#475569",
    },

    // ---------- Invólucro de Solicitação Dinâmica ----------
    solicitacaoWrapper: {
        marginBottom: 20,
    },
    solicitacaoHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    solicitacaoIndexBadge: {
        width: 20,
        height: 20,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    solicitacaoIndexText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    solicitacaoHeaderTextGroup: {
        flexDirection: "column",
        flex: 1,
    },
    solicitacaoLabel: {
        fontSize: 7.5,
        color: "#64748B",
        textTransform: "uppercase",
    },
    solicitacaoTitulo: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#0F172A",
    },
    solicitacaoBody: {
        padding: 12,
        borderRadius: 6,
        border: "1 solid #E2E8F0",
        borderLeftWidth: 3,
    },

    // ---------- Rodapé Fixo ----------
    footer: {
        position: "absolute",
        bottom: 25,
        left: 40,
        right: 40,
        textAlign: "center",
        color: "#94A3B8",
        fontSize: 7.5,
        borderTop: "1 solid #E2E8F0",
        paddingTop: 8,
    },
    pageNumber: {
        position: "absolute",
        bottom: 25,
        right: 40,
        fontSize: 7.5,
        color: "#94A3B8",
    },
    emptyState: {
        fontSize: 8.5,
        color: "#94A3B8",
        padding: 8,
        textAlign: "center",
    },
});

// ============================================================
// FORMATADORES
// ============================================================
const formatDateTime = (str) => {
    if (!str) return "—";
    const [date, time] = str.split("T");
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y} ${time ? `às ${time}` : ""}`;
};

const formatDuracao = (hhmmss) => {
    if (!hhmmss) return "0h";
    const [h, m] = hhmmss.split(":").map(Number);
    if (h === 0 && m === 0) return "0h";
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

const geradoEm = new Date().toLocaleDateString("pt-BR");

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================
function ResumoConsolidado({ dados }) {
    const { totalPessoas, horasTotais, porCentroCusto = [] } = dados;

    return (
        <View wrap={false}>

            <View style={styles.kpiRow}>
                <View style={styles.kpiBox}>
                    <Text style={styles.kpiLabel}>Total de Pessoas</Text>
                    <Text style={styles.kpiValue}>{totalPessoas}</Text>
                </View>
                <View style={[styles.kpiBox, { borderLeftColor: "#10B981" }]}>
                    <Text style={styles.kpiLabel}>Horas Totais</Text>
                    <Text style={styles.kpiValue}>{formatDuracao(horasTotais)}</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Horas por Centro de Custo</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.colCentro]}>Centro de Custo</Text>
                        <Text style={[styles.tableHeaderText, styles.colTempo]}>Tempo Alocado</Text>
                    </View>
                    {porCentroCusto.length === 0 ? (
                        <Text style={styles.emptyState}>Nenhum centro de custo informado.</Text>
                    ) : (
                        porCentroCusto.map((cc, i) => (
                            <View
                                key={cc.centroCusto}
                                style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate} c
                            >
                                <Text style={[styles.valueRegular, styles.colCentro]}>{cc.centroCusto}</Text>
                                <Text style={[styles.value, styles.colTempo]}>
                                    {formatDuracao(cc.tempo)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>
            </View>
        </View>
    );
}

function SolicitacaoBloco({ solicitacao, index }) {
    const cor = PALETA[index % PALETA.length];
    const {
        id,
        motivoMacro,
        motivoDetalhado,
        departamento,
        inicio,
        fim,
        turno,
        funcionarios = [],
        totalHoras,
    } = solicitacao;

    return (
        // O wrap={false} aqui garante que o bloco inteiro mude de página junto se não couber por inteiro
        <View style={styles.solicitacaoWrapper} wrap={false}>
            <View style={styles.solicitacaoHeaderRow}>
                <View style={[styles.solicitacaoIndexBadge, { backgroundColor: cor.accent }]}>
                    <Text style={styles.solicitacaoIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.solicitacaoHeaderTextGroup}>
                    <Text style={styles.solicitacaoLabel}>ID #{id}</Text>
                    <Text style={styles.solicitacaoTitulo}>{motivoMacro}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: cor.badgeBg }]}>
                    <Text style={{ color: cor.badgeText, fontSize: 8, fontWeight: "bold" }}>
                        {formatDuracao(totalHoras)}
                    </Text>
                </View>
            </View>

            <View style={[styles.solicitacaoBody, { backgroundColor: cor.bg, borderLeftColor: cor.accent }]}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Departamento</Text>
                        <Text style={styles.value}>{departamento}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Turno</Text>
                        <Text style={styles.value}>{turno}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Início</Text>
                        <Text style={styles.valueRegular}>{formatDateTime(inicio)}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Término</Text>
                        <Text style={styles.valueRegular}>{formatDateTime(fim)}</Text>
                    </View>
                </View>

                {motivoDetalhado && (
                    <View style={styles.descriptionBox}>
                        <Text style={styles.descriptionText}>{motivoDetalhado}</Text>
                    </View>
                )}

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.colID]}>RE</Text>
                        <Text style={[styles.tableHeaderText, styles.colNome]}>Nome Completo</Text>
                        <Text style={[styles.tableHeaderText, styles.colCC]}>CC</Text>
                        <Text style={[styles.tableHeaderText, styles.colEmpresa]}>Empresa</Text>
                        <Text style={[styles.tableHeaderText, styles.colCargo]}>Cargo</Text>
                        <Text style={[styles.tableHeaderText, styles.colMaquina]}>Posto/Máq.</Text>
                    </View>

                    {funcionarios.length === 0 ? (
                        <Text style={styles.emptyState}>Nenhum funcionário alocado.</Text>
                    ) : (
                        funcionarios.map((func, i) => (
                            <View
                                key={func.id || i}
                                style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}
                            >
                                <Text style={[styles.valueRegular, styles.colID]}>{func.re || "—"}</Text>
                                <Text style={[styles.value, styles.colNome]}>{func.name}</Text>
                                <Text style={[styles.valueRegular, styles.colCC]}>{func.codigoCentroCusto || "—"}</Text>
                                <Text style={[styles.valueRegular, styles.colEmpresa]}>{(() => {
                                    if (!func.empresa) return "—";

                                    const empresaEncontrada = empresas.find(
                                        (obj) => obj.nome.trim().toUpperCase() === func.empresa.trim().toUpperCase()
                                    );

                                    return empresaEncontrada ? empresaEncontrada.formatado : func.empresa;
                                })()}</Text>
                                <Text style={[styles.valueRegular, styles.colCargo]}>{func.cargo || "—"}</Text>
                                <Text style={[styles.valueRegular, styles.colMaquina]}>{func.maquina || "—"}</Text>
                            </View>
                        ))
                    )}
                </View>
            </View>
        </View>
    );
}

// ============================================================
// COMPONENTE PRINCIPAL EXPORTADO
// ============================================================
export default function DocumentPDF({ dadosConsolidados }) {

    if (!dadosConsolidados) return null;

    const { nomeResp, sobrenomeResp, emailResp, solicitacoes = [] } = dadosConsolidados;

    return (
        <Document title="Solicitação de Horas Extras">
            <Page size="A4" style={styles.page}>

                {/* CABEÇALHO — Fixo no topo absoluto de cada página */}
                <View style={styles.header} fixed>
                    <View>
                        <Text style={styles.title}>Solicitações de Hora Extra</Text>
                        <Text style={styles.subtitle}>Relatório Consolidado de Produção</Text>
                    </View>

                    <View>
                        <View style={styles.respRow}>

                            <Text style={styles.headerMeta}>Emitido em: {geradoEm}</Text>

                            <View style={styles.respBox}>
                                <Text style={styles.respLabel}>Responsável:</Text>
                                <Text style={styles.respValue}>{nomeResp} {sobrenomeResp}</Text>
                            </View>

                            <View style={styles.respBox}>
                                <Text style={styles.respLabel}>E-mail:</Text>
                                <Text style={styles.respValue}>{emailResp}</Text>
                            </View>

                        </View>
                    </View>
                </View>

                {/* Bloco de Resumo Inicial */}
                <ResumoConsolidado dados={dadosConsolidados} />

                {/* Separador de Seção */}
                <Text style={[styles.sectionTitle, { marginTop: 8, marginBottom: 12 }]}>
                    Solicitações Individuais ({solicitacoes.length})
                </Text>

                {/* Listagem de Blocos Dinâmicos */}
                {solicitacoes.length === 0 ? (
                    <Text style={styles.emptyState}>Nenhuma solicitação registrada.</Text>
                ) : (
                    solicitacoes.map((solicitacao, index) => (
                        <SolicitacaoBloco
                            key={solicitacao.id || index}
                            solicitacao={solicitacao}
                            index={index}
                        />
                    ))
                )}

                {/* RODAPÉ — Fixo na base absoluta de todas as páginas */}
                <Text style={styles.footer} fixed>
                    Este documento é para uso interno e contém informações sensíveis corporativas.
                </Text>
                <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                    fixed
                />
            </Page>
        </Document>
    );
}