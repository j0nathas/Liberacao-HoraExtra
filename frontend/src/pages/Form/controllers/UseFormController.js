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
                const { data } = await api.get(`/query/funcionarios`, { params: { pesquisa: funcionarioTexto, planta: currentForm.planta } });
                setOpcoesFuncionarios(data);
            } catch (error) { console.error(error); }
            finally { setLoadingFunc(false); }
        };
        const timeoutId = setTimeout(buscarFuncionarios, 300);
        return () => clearTimeout(timeoutId);
    }, [funcionarioTexto, currentForm.planta]);

    //////////////////////////////////////////////////////////////////////


    ////////////////////// GESTÃO DE DEPARTAMENTOS //////////////////////
    const [listaDepartamentos, setListaDepartamentos] = useState([]);

    async function carregarDepartamentos(plantaSelecionada) {
        try {
            const { data } = await api.get("/query/departamentos", { params: { planta: plantaSelecionada } });
            setListaDepartamentos(data.map((dado) => ({ id: dado.id, name: dado.departamento })));
        } catch (err) { console.error(err); }
    }

    ////////////////////////////////////////////////////////////////////



    ////////////////////// GESTÃO DE MÁQUINAS //////////////////////////

    const [listaMaquinas, setListaMaquinas] = useState([]);
    const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
    const [maquinaTexto, setMaquinaTexto] = useState('');

    useEffect(() => {
        setMaquinaTexto('');
        setMaquinaSelecionada(null);

        if (!currentForm.departamento || !currentForm.planta) {
            setListaMaquinas([]);
            return;
        }

        async function carregarMaquinas() {
            try {
                const { data } = await api.get(`/query/maquinasPorDepartamento`, {
                    params: { selecao: currentForm.departamento, planta: currentForm.planta }
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
    }, [currentForm.departamento, currentForm.planta]);

    //////////////////////////////////////////////////////////////////

    //////////////////////// PLANTAS ////////////////////////////

    const [plantas, setPlantas] = useState([]);

    useEffect(() => {
        async function carregarPlantas() {
            try {
                const { data } = await api.get("/query/plantas");
                setPlantas(data.map(item => ({ id: item.id, name: item.sigla })));
            } catch (err) { console.error(err); }
        }
        carregarPlantas();
    }, []);


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

    //////////////////////TIPOS DE SOLICITACAO//////////////////

    const [tiposSolicitacao, setTiposSolicitacao] = useState([]);

    useEffect(() => {
        async function carregar() {
            try {
                const { data } = await api.get("/query/tipoSolicitacoes");
                setTiposSolicitacao(data);
            } catch (err) { console.error(err); }
        }
        carregar();
    }, []);

    //////////////////////////////////////////////////////////////

    ////////////////////ENVIAR FORMS E CRIAR O DOC///////////////

    async function EnviarCriarDoc(forms) {
        const { valid, toast: msg } = validarFormularios(forms);
        if (!valid) return toast.error(msg);

        const dadosConsolidados = await generatePDFController(forms);

        console.log(forms);
        console.log(dadosConsolidados);


        const pdfBase64 = await gerarPDFBase64(dadosConsolidados);

        const solicitacoesParaEnvio = dadosConsolidados.solicitacoes.map(solicitacao => ({
            id_motivo_macro: solicitacao.motivoMacroId,
            id_tipo: solicitacao.idTipo,
            id_departamento: solicitacao.idDepartamento,
            id_turno: solicitacao.idTurno,
            inicio: solicitacao.inicio,
            fim: solicitacao.fim,
            id_planta: solicitacao.idPlanta,
            justificativas: solicitacao.justificativas.map(just => ({
                id_maquina: just.maquina.id,
                justificativa: just.justificativa,
                funcionarios: just.funcionarios.map(funcionario => ({
                    id_funcionario: funcionario.id
                }))
            })),

        }));

        const formBody = {
            data: dadosConsolidados.data,
            base64: pdfBase64,
            id_user: dadosConsolidados.idResp,
            solicitacoes: solicitacoesParaEnvio
        };


        await api.post("/solicitacoes/enviar", formBody);


        toast.success("PDF Criado com Sucesso!");
        navigate('/document', { state: { forms: dadosConsolidados } });

        toast.success("Formulário enviado!");
    }


    ////////////////// SINCRONIZAÇÃO DE ABAS ////////////////////

    const [loading, setLoading] = useState(false);


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

    const [vinculoTexto, setVinculoTexto] = useState();
    const [vinculoJust, setVinculoJust] = useState();

    function adicionarFuncionario(vinculo) {
        if (!funcionarioSelecionado || !vinculo) return;

        const jaAdicionado = currentForm.justificativas.some(j =>
            j.id === vinculo.idJustificativa &&
            j.funcionarios.some(f => f.id === funcionarioSelecionado.id)
        );
        if (jaAdicionado) return;

        const novasJustificativas = currentForm.justificativas.map(justificativa =>
            justificativa.id === vinculo.idJustificativa
                ? { ...justificativa, funcionarios: [...justificativa.funcionarios, funcionarioSelecionado] }
                : justificativa
        );

        updateCurrentForm('justificativas', novasJustificativas);

        setFuncionarioTexto('');
        setFuncionarioSelecionado(null);
        setVinculoTexto('');
        setVinculoJust(null);
    }

    return {
        forms,
        currentForm,
        currentFormIndex,
        departamentos: listaDepartamentos,
        maquinas: listaMaquinas,
        plantas,
        motivosMacro,
        tiposSolicitacao,
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
        vinculoTexto,
        setVinculoTexto,
        vinculoJust,
        setVinculoJust,
        adicionarFuncionario,
        removerFuncionario: (id) => updateCurrentForm('funcionarios', currentForm.funcionarios.filter(f => f.id !== id)),
        adicionarForm,
        removerForm,
        loading,
        handleSubmit: async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                await EnviarCriarDoc(forms);
            } catch (err) {
                console.log(err);
            }

            finally {
                setLoading(false);
            }


        },
        carregarDepartamentos,
    };
}