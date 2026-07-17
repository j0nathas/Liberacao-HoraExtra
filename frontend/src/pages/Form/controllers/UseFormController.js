import { useEffect, useState, useCallback } from "react";
import toast from 'react-hot-toast';
import api from '../../../services/api.js';
import { Navigate, useNavigate } from 'react-router-dom'
import { novoForm, validarFormularios } from '../models/formModel.js';
import { generatePDFController } from '../../../PDF/controller/generatePDFController.js'
import { gerarPDFBase64 } from '../../../PDF/controller/base64Controller.js'

export function useFormController() {

    const navigate = useNavigate();

    //////////////////////////////// GESTÃO DOS FORMULÁRIOS ////////////////////////////////
    const [forms, setForms] = useState([novoForm(1)]);
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const [nextId, setNextId] = useState(2);
    const currentForm = forms[currentFormIndex];

    const updateCurrentForm = useCallback((updates, value) => {
        setForms((prev) =>
            prev.map((form, idx) => {
                if (idx !== currentFormIndex) return form;

                if (typeof updates === 'string') {
                    return { ...form, [updates]: value };
                }
                return { ...form, ...updates };
            })
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
                setListaMaquinas(
                    data.map((item) => ({
                        id: item.codMaquina,
                        name: item.maquina
                    }))
                );
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
            {
                ...funcionarioSelecionado,
                maquina: {
                    id: maquinaSelecionada.id,
                    nome: maquinaSelecionada.name
                }
            },
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
        handleSubmit: async (e) => {
            e.preventDefault();
            const { valid, toast: msg } = validarFormularios(forms);
            if (!valid) return toast.error(msg);
            const dadosConsolidados = await generatePDFController(forms);
            const pdfBase64 = await gerarPDFBase64(dadosConsolidados);
            try {

                await Promise.all(
                    dadosConsolidados.solicitacoes.map((solicitacao) => {
                        const formBody = {
                            data: dadosConsolidados.data,
                            id_user: dadosConsolidados.idResp,
                            id_motivo_macro: solicitacao.motivoMacroId,
                            motivo_detalhado: solicitacao.motivoDetalhado,
                            departamento: solicitacao.departamento,
                            turno: solicitacao.turno,
                            inicio: new Date(solicitacao.inicio),
                            fim: new Date(solicitacao.fim),
                            funcionarios: solicitacao.funcionarios.map((funcionario) => ({
                                id_funcionario: funcionario.id,
                                id_maquina: funcionario.maquina.id
                            }))
                        };

                        return api.post('/solicitacoes/enviar', formBody);
                    })
                );

                const formBody = {
                    data: dadosConsolidados.data,
                    id_user: dadosConsolidados.idResp,
                    id_motivo_macro: dadosConsolidados.motivoMacroId,
                    motivo_detalhado: dadosConsolidados
                }

                /*
                  const body = {
                      base64: pdfBase64,
                      areas: [...new Set(
                          dadosConsolidados.solicitacoes.map(
                              (solicitacao) => solicitacao.departamento
                          )
                      )] 
                      nomeResp: dadosConsolidados.nomeResp,
                      sobrenomeResp: dadosConsolidados.sobrenomeResp,
                      emailResp: dadosConsolidados.emailResp
                  };
  
                  console.log(pdfBase64)
                  const response = await api.post('/post/criarDoc', body) */
                toast.success("PDF Criado com Sucesso!");
                navigate('/document', { state: { forms: dadosConsolidados } });

                toast.success("Formulário enviado!");
            } catch (err) {
                console.log(err);
            }


        }
    };
}