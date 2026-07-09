import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import api from '../../../services/api.js';
import { Departamentos, maquinas } from '../components/dadosFake.js';
import { novoForm, validarFormularios } from '../models/formModel.js';

export function useFormController() {

    //////////////////////////////// GESTÃO DOS FORMULÁRIOS ////////////////////////////////
    const [forms, setForms] = useState([novoForm(1)]);
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const [nextId, setNextId] = useState(2);
    const currentForm = forms[currentFormIndex];

    function updateCurrentForm(field, value) {
        setForms((prev) =>
            prev.map((form, idx) =>
                idx === currentFormIndex ? { ...form, [field]: value } : form
            )
        );
    }

    function adicionarForm() {
        const { valid, toast: formToast } = validarFormularios(forms);
        if (!valid) {
            toast.error(formToast);
            return;
        }

        setForms((prev) => [...prev, novoForm(nextId)]);
        setNextId((prev) => prev + 1);
        setCurrentFormIndex(forms.length);
        scrollPage(0);
        toast.success("Nova solicitação adicionada!");
    }

    function removerForm(index) {
        if (forms.length === 1) return;
        setForms((prev) => prev.filter((_, i) => i !== index));
        setCurrentFormIndex((prev) => Math.max(0, prev === index ? prev - 1 : prev > index ? prev - 1 : prev));
    }
    ////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////// GESTÃO DE FUNCIONÁRIOS ////////////////////////////////
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
    const [funcionarioTexto, setFuncionarioTexto] = useState('');
    const [opcoesFuncionarios, setOpcoesFuncionarios] = useState([]);
    const [loading, setLoading] = useState(false);

    // Resetar busca de funcionário ao trocar de formulário
    useEffect(() => {
        setFuncionarioSelecionado(null);
        setFuncionarioTexto('');
    }, [currentFormIndex]);

    // Busca de funcionários via API (Debounce)
    useEffect(() => {
        const buscarFuncionarios = async () => {
            if (funcionarioTexto.length < 2) {
                setOpcoesFuncionarios([]);
                return;
            }

            setLoading(true);
            try {
                const response = await api.get(`/query/funcionarios?pesquisa=${funcionarioTexto}`);
                const dados = response.data;

                const formatados = dados.map(f => ({
                    ...f,
                    name: f.nome
                }));

                setOpcoesFuncionarios(formatados);
            } catch (error) {
                console.error("Erro ao buscar funcionários", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(buscarFuncionarios, 300);
        return () => clearTimeout(timeoutId);
    }, [funcionarioTexto]);

    function adicionarFuncionario() {
        if (!funcionarioSelecionado || !maquinaSelecionada) return;

        if (currentForm.funcionarios.some((f) => f.id === funcionarioSelecionado.id)) {
            toast.error("Funcionário já adicionado!");
        } else {
            updateCurrentForm('funcionarios', [
                ...currentForm.funcionarios,
                { ...funcionarioSelecionado, maquina: maquinaSelecionada },
            ]);

            setFuncionarioSelecionado(null);
            setFuncionarioTexto('');
            setOpcoesFuncionarios([]);
        }
    }

    function removerFuncionario(id) {
        updateCurrentForm('funcionarios', currentForm.funcionarios.filter((f) => f.id !== id));
    }
    ////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////// GESTÃO DE MÁQUINAS ////////////////////////////////////
    const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
    const [maquinaTexto, setMaquinaTexto] = useState('');

    const departamentoId = Departamentos.find((d) => d.name === currentForm.departamento)?.id;
    const opcoesMaquinas = departamentoId ? maquinas.filter((m) => m.idCusto === departamentoId) : [];

    // Limpar máquina se o departamento mudar
    useEffect(() => {
        setMaquinaSelecionada(null);
        setMaquinaTexto('');
    }, [currentForm.departamento]);
    ////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////// MOTIVOS MACRO ////////////////////////////////////////
    const [motivosMacro, setMotivosMacro] = useState([]);

    useEffect(() => {
        async function carregarMotivos() {
            try {
                const { data } = await api.get("/query/motivosMacro");
                setMotivosMacro(
                    data.map(item => ({
                        id: item.id,
                        name: item.descricao
                    }))
                );
            } catch (err) {
                console.error(err);
            }
        }

        carregarMotivos();
    }, []);
    ////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////// ENVIO E AUXILIARES ///////////////////////////////////
    function scrollPage(value) {
        window.scrollTo({
            top: value,
            behavior: "smooth",
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        const { valid, toast: formToast } = validarFormularios(forms);

        if (!valid) {
            toast.error(formToast);
            return;
        }

        console.log(forms);
        toast.success("Solicitações enviadas!");
    }
    ////////////////////////////////////////////////////////////////////////////////////////

    return {
        forms,
        currentForm,
        currentFormIndex,
        opcoesMaquinas,
        opcoesFuncionarios,
        motivosMacro,
        loading,
        funcionarioSelecionado,
        maquinaSelecionada,
        funcionarioTexto,
        maquinaTexto,

        setCurrentFormIndex,
        setFuncionarioTexto,
        setMaquinaTexto,
        setFuncionarioSelecionado,
        setMaquinaSelecionada,

        updateCurrentForm,
        adicionarFuncionario,
        removerFuncionario,
        adicionarForm,
        removerForm,
        handleSubmit,
    };
}