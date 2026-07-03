import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font
} from "@react-pdf/renderer";

// Estilização aprimorada
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: "#FFFFFF",
        fontSize: 10,
        fontFamily: "Helvetica",
        color: "#334155",
    },

    // Header Profissional
    header: {
        borderBottom: "2 solid #2D7FF9",
        paddingBottom: 10,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTextGroup: {
        flexDirection: "column",
    },
    title: {
        color: "#1E40AF",
        fontSize: 20,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    subtitle: {
        color: "#64748B",
        fontSize: 9,
        marginTop: 2,
    },

    // Cards / Seções
    card: {
        marginBottom: 20,
        padding: 12,
        border: "1 solid #E2E8F0",
        borderRadius: 4,
    },
    sectionTitle: {
        color: "#1E40AF",
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 10,
        textTransform: "uppercase",
        borderBottom: "1 solid #E2E8F0",
        paddingBottom: 4,
    },

    // Grid de informações
    row: {
        flexDirection: "row",
        marginBottom: 10,
    },
    column: {
        flexDirection: "column",
        flex: 1,
    },
    label: {
        color: "#64748B",
        fontSize: 8,
        textTransform: "uppercase",
        marginBottom: 2,
    },
    value: {
        color: "#0F172A",
        fontSize: 10,
        fontWeight: "bold",
    },

    // Descrição detalhada
    descriptionBox: {
        backgroundColor: "#F8FAFC",
        padding: 8,
        borderRadius: 4,
        borderLeft: "3 solid #CBD5E1",
    },
    descriptionText: {
        fontSize: 9,
        lineHeight: 1.4,
        color: "#334155",
        fontStyle: "italic",
    },

    // Tabela de Funcionários
    table: {
        marginTop: 5,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        padding: 6,
        borderBottom: "1 solid #CBD5E1",
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        padding: 6,
        borderBottom: "1 solid #F1F5F9",
    },
    tableRowAlternate: {
        flexDirection: "row",
        padding: 6,
        backgroundColor: "#FBFCFD",
        borderBottom: "1 solid #F1F5F9",
    },

    // Colunas da Tabela
    colID: { width: "15%" },
    colNome: { width: "55%" },
    colMaquina: { width: "30%" },

    tableHeaderText: {
        fontSize: 8,
        color: "#475569",
        fontWeight: "bold",
        textTransform: "uppercase",
    },

    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        color: "#94A3B8",
        fontSize: 8,
        borderTop: "1 solid #E2E8F0",
        paddingTop: 10,
    },
    pageNumber: {
        position: "absolute",
        bottom: 30,
        right: 40,
        fontSize: 8,
        color: "#94A3B8",
    }
});

// Helper para formatar data ISO (simples)
const formatDateTime = (str) => {
    if (!str) return "";
    const [date, time] = str.split("T");
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y} às ${time}`;
};

export default function DocumentPDF() {
    // Seus dados...
    const formularios = [
        {
            "id": 1,
            "motivoMacro": "Absenteísmo",
            "motivoDetalhado": "Devido ao jogo do Brasil na segunda-feira, será necessário a efetuação de hora extra para acompanhar a demanda solicitada pela Stellantis do nosso produto Lanterna Fixa 2810 Lado Esquerdo e Lado Direito.",
            "departamento": "MONTAGEM LANTERNAS",
            "inicio": "2026-07-04T06:00",
            "fim": "2026-07-04T14:30",
            "turno": "1º Turno",
            "funcionarios": [
                { "id": 1835, "name": "Jonathas Oliveira", "maquina": "Linha 01" },
                { "id": 1510, "name": "Leandro Almeida", "maquina": "Linha 01" },
                { "id": 4, "name": "Ana Santos", "maquina": "Linha 01" },
                { "id": 1132, "name": "Fabricio Fonseca", "maquina": "Linha 01" },
                { "id": 7, "name": "Lucas Almeida", "maquina": "Linha 01" },
            ]
        },
        {
            "id": 1,
            "motivoMacro": "Absenteísmo",
            "motivoDetalhado": "Devido ao jogo do Brasil na segunda-feira, será necessário a efetuação de hora extra para acompanhar a demanda solicitada pela Stellantis do nosso produto Lanterna Fixa 2810 Lado Esquerdo e Lado Direito.",
            "departamento": "MONTAGEM LANTERNAS",
            "inicio": "2026-07-04T06:00",
            "fim": "2026-07-04T14:30",
            "turno": "1º Turno",
            "funcionarios": [
                { "id": 1835, "name": "Jonathas Oliveira", "maquina": "Linha 01" },
                { "id": 1510, "name": "Leandro Almeida", "maquina": "Linha 01" },
                { "id": 4, "name": "Ana Santos", "maquina": "Linha 01" },
                { "id": 1132, "name": "Fabricio Fonseca", "maquina": "Linha 01" },
                { "id": 7, "name": "Lucas Almeida", "maquina": "Linha 01" },
            ]
        },

    ];

    return (
        <Document title="Solicitação de Horas Extras">
            {formularios.map((formulario, index) => (
                <Page key={index} size="A4" style={styles.page}>

                    {/* CABEÇALHO */}
                    <View style={styles.header}>
                        <View style={styles.headerTextGroup}>
                            <Text style={styles.title}>Solicitação de HE</Text>
                            <Text style={styles.subtitle}>Relatório Gerencial de Produção</Text>
                        </View>
                        <Text style={{ fontSize: 9, color: "#64748B" }}>
                            ID: #{formulario.id} | Gerado em: {new Date().toLocaleDateString('pt-BR')}
                        </Text>
                    </View>

                    {/* INFOS GERAIS */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Informações Operacionais</Text>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>Departamento</Text>
                                <Text style={styles.value}>{formulario.departamento}</Text>
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Motivo Macro</Text>
                                <Text style={styles.value}>{formulario.motivoMacro}</Text>
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Turno</Text>
                                <Text style={styles.value}>{formulario.turno}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>Início Previsto</Text>
                                <Text style={styles.value}>{formatDateTime(formulario.inicio)}</Text>
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Término Previsto</Text>
                                <Text style={styles.value}>{formatDateTime(formulario.fim)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* MOTIVO DETALHADO */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Justificativa Detalhada</Text>
                        <View style={styles.descriptionBox}>
                            <Text style={styles.descriptionText}>
                                {formulario.motivoDetalhado}
                            </Text>
                        </View>
                    </View>

                    {/* TABELA DE FUNCIONÁRIOS */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Equipe Alocada ({formulario.funcionarios.length})</Text>

                        <View style={styles.table}>
                            {/* Header da Tabela */}
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderText, styles.colID]}>RE / ID</Text>
                                <Text style={[styles.tableHeaderText, styles.colNome]}>Nome Completo</Text>
                                <Text style={[styles.tableHeaderText, styles.colMaquina]}>Posto/Máquina</Text>
                            </View>

                            {/* Linhas da Tabela */}
                            {formulario.funcionarios.map((func, i) => (
                                <View
                                    key={func.id}
                                    style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}
                                >
                                    <Text style={[styles.value, styles.colID]}>{func.id}</Text>
                                    <Text style={[styles.value, styles.colNome]}>{func.name}</Text>
                                    <Text style={[styles.value, styles.colMaquina]}>{func.maquina}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* RODAPÉ */}
                    <Text style={styles.footer}>
                        Este documento é para uso interno e contém informações sensíveis.
                    </Text>

                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                        fixed
                    />
                </Page>
            ))}
        </Document>
    );
}