import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: "#F5F8FC",
        fontSize: 10,
        fontFamily: "Helvetica",
    },

    header: {
        backgroundColor: "#2D7FF9",
        padding: 15,
        borderRadius: 6,
        marginBottom: 20,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },

    subtitle: {
        color: "#DCEBFF",
        textAlign: "center",
        marginTop: 3,
        fontSize: 10,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 6,
        padding: 15,
        marginBottom: 15,
        border: "1 solid #DCE8F5",
    },

    sectionTitle: {
        color: "#2D7FF9",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
    },

    row: {
        flexDirection: "row",
        marginBottom: 8,
    },

    column: {
        flex: 1,
    },

    label: {
        color: "#7B8794",
        fontSize: 9,
        marginBottom: 2,
    },

    value: {
        color: "#1F2937",
        fontSize: 11,
    },

    description: {
        marginTop: 5,
        padding: 10,
        backgroundColor: "#F7FAFE",
        borderRadius: 4,
        lineHeight: 1.5,
    },

    employee: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderBottom: "1 solid #E7EDF5",
    },

    footer: {
        marginTop: 20,
        textAlign: "center",
        color: "#94A3B8",
        fontSize: 9,
    },
});

export default function DocumentPDF({ formularios }) {
    return (
        <Document>
            {formularios.map((formulario) => (
                <Page key={formulario.id} size="A4" style={styles.page}>

                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Solicitação de Hora Extra
                        </Text>

                        <Text style={styles.subtitle}>
                            Documento de Solicitação
                        </Text>
                    </View>

                    <View style={styles.card}>

                        <Text style={styles.sectionTitle}>
                            Informações Gerais
                        </Text>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>
                                    Motivo Macro
                                </Text>

                                <Text style={styles.value}>
                                    {formulario.motivoMacro}
                                </Text>
                            </View>

                            <View style={styles.column}>
                                <Text style={styles.label}>
                                    Departamento
                                </Text>

                                <Text style={styles.value}>
                                    {formulario.departamento}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>
                                    Início
                                </Text>

                                <Text style={styles.value}>
                                    {formulario.inicio}
                                </Text>
                            </View>

                            <View style={styles.column}>
                                <Text style={styles.label}>
                                    Fim
                                </Text>

                                <Text style={styles.value}>
                                    {formulario.fim}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>
                                    Turno
                                </Text>

                                <Text style={styles.value}>
                                    {formulario.turno}
                                </Text>
                            </View>
                        </View>

                    </View>

                    <View style={styles.card}>

                        <Text style={styles.sectionTitle}>
                            Motivo Detalhado
                        </Text>

                        <Text style={styles.description}>
                            {formulario.motivoDetalhado}
                        </Text>

                    </View>

                    <View style={styles.card}>

                        <Text style={styles.sectionTitle}>
                            Funcionários
                        </Text>

                        {formulario.funcionarios.map((funcionario) => (
                            <View key={funcionario.id} style={styles.employee}>
                                <Text>{funcionario.name}</Text>
                            </View>
                        ))}

                    </View>

                    <Text style={styles.footer}>
                        Documento gerado automaticamente pelo sistema
                    </Text>

                </Page>
            ))}
        </Document>
    );
}