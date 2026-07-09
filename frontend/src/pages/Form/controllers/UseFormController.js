import { useEffect, useState, useCallback } from "react";
import toast from 'react-hot-toast';
import api from '../../../services/api.js';
import { Navigate, useNavigate } from 'react-router-dom'
import { novoForm, validarFormularios } from '../models/formModel.js';
import { generatePDFController } from '../../../PDF/controller/generatePDFController.js'

export function useFormController() {

    const navigate = useNavigate();

    //////////////////////////////// GESTÃO DOS FORMULÁRIOS ////////////////////////////////
    const [forms, setForms] = useState([novoForm(1)]);
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const [nextId, setNextId] = useState(2);
    const currentForm = forms[currentFormIndex];

    const updateCurrentForm = useCallback((field, value) => {
        setForms((prev) =>
            prev.map((form, idx) =>
                idx === currentFormIndex ? { ...form, [field]: value } : form
            )
        );
    }, [currentFormIndex]);

    function adicionarForm() {
        const { valid, toast: formToast } = validarFormularios(forms);
        if (!valid) return toast.error(formToast);

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

    /////////////////////////////////////////////////////////////////////


    ///////////////////////// FUNCIONÁRIOS //////////////////////////////

    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
    const [funcionarioTexto, setFuncionarioTexto] = useState('');
    const [opcoesFuncionarios, setOpcoesFuncionarios] = useState([]);
    const [loadingFunc, setLoadingFunc] = useState(false);

    useEffect(() => {
        const buscarFuncionarios = async () => {
            if (funcionarioTexto.length < 2) {
                setOpcoesFuncionarios([]);
                return;
            }
            setLoadingFunc(true);
            try {
                const { data } = await api.get(`/query/funcionarios`, { params: { pesquisa: funcionarioTexto } });
                setOpcoesFuncionarios(data);
            } catch (error) { console.error(error); }
            finally { setLoadingFunc(false); }
        };
        const timeoutId = setTimeout(buscarFuncionarios, 300);
        return () => clearTimeout(timeoutId);
    }, [funcionarioTexto]);

    //////////////////////////////////////////////////////////////////////


    ////////////////////// GESTÃO DE DEPARTAMENTOS //////////////////////
    const [listaDepartamentos, setListaDepartamentos] = useState([]);
    useEffect(() => {
        async function carregar() {
            try {
                const { data } = await api.get("/query/departamentos");
                setListaDepartamentos(data.map((name, index) => ({ id: index, name })));
            } catch (err) { console.error(err); }
        }
        carregar();
    }, []);

    ////////////////////////////////////////////////////////////////////



    ////////////////////// GESTÃO DE MÁQUINAS //////////////////////////

    const [listaMaquinas, setListaMaquinas] = useState([]);
    const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
    const [maquinaTexto, setMaquinaTexto] = useState('');

    useEffect(() => {
        setMaquinaTexto('');
        setMaquinaSelecionada(null);

        if (!currentForm.departamento) {
            setListaMaquinas([]);
            return;
        }

        async function carregarMaquinas() {
            try {
                const { data } = await api.get(`/query/maquinasPorDepartamento`, {
                    params: { selecao: currentForm.departamento }
                });
                setListaMaquinas(data.map((item, index) => ({ id: index, name: item })));
            } catch (err) { console.error(err); }
        }
        carregarMaquinas();
    }, [currentForm.departamento]);

    //////////////////////////////////////////////////////////////////


    ////////////////////// MOTIVOS MACRO ////////////////////////////

    const [motivosMacro, setMotivosMacro] = useState([]);
    const [motivoTexto, setMotivoTexto] = useState('');

    useEffect(() => {
        async function carregar() {
            try {
                const { data } = await api.get("/query/motivosMacro");
                setMotivosMacro(data.map(item => ({ id: item.id, name: item.descricao })));
            } catch (err) { console.error(err); }
        }
        carregar();
    }, []);

    //////////////////////////////////////////////////////////////


    ////////////////// SINCRONIZAÇÃO DE ABAS ////////////////////


    function scrollPage(value) {
        window.scrollTo({
            top: value,
            behavior: "smooth",
        });
    }


    useEffect(() => {
        setMotivoTexto(currentForm.motivoMacro || '');
        setMaquinaTexto('');
        setMaquinaSelecionada(null);
        setFuncionarioTexto('');
        setFuncionarioSelecionado(null);
    }, [currentFormIndex]);

    function adicionarFuncionario() {
        if (!funcionarioSelecionado || !maquinaSelecionada) return;

        updateCurrentForm('funcionarios', [
            ...currentForm.funcionarios,
            { ...funcionarioSelecionado, maquina: maquinaSelecionada },
        ]);

        setFuncionarioSelecionado(null);
        setFuncionarioTexto('');
    }

    return {
        forms,
        currentForm,
        currentFormIndex,
        departamentos: listaDepartamentos,
        maquinas: listaMaquinas,
        motivosMacro,
        opcoesFuncionarios,
        loading: loadingFunc,
        funcionarioTexto,
        maquinaTexto,
        motivoTexto,
        funcionarioSelecionado,
        maquinaSelecionada,
        setFuncionarioTexto,
        setMaquinaTexto,
        setMotivoTexto,
        setFuncionarioSelecionado,
        setMaquinaSelecionada,
        setCurrentFormIndex,
        updateCurrentForm,
        adicionarFuncionario,
        removerFuncionario: (id) => updateCurrentForm('funcionarios', currentForm.funcionarios.filter(f => f.id !== id)),
        adicionarForm,
        removerForm,
        handleSubmit: (e) => {
            e.preventDefault();
            const { valid, toast: msg } = validarFormularios(forms);
            if (!valid) return toast.error(msg);
            const dadosConsolidados = generatePDFController(forms);
            toast.success("PDF Criado com Sucesso!");
            navigate('/document', { state: { forms: dadosConsolidados } });

            toast.success("Formulário enviado!");
        }
    };
}