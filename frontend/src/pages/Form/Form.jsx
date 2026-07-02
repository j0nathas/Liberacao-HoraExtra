import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { pdf } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import DocumentPDF from "../../PDF/DocumentPDF.jsx";
import Search from '../../components/Search.jsx'
import HomeIcon from '../../../img/home.svg?react'
import FormIcon from '../../../img/form.svg?react'
import ClearIcon from '../../../img/clear.svg?react'
import TrashIcon from '../../../img/trash.svg?react'
import { MotivoMacro, Departamentos, Shifts, funcionarios, maquinas } from './components/dadosFake.js'


/* onst blob = await pdf(<MeuDocumento dados={dados} />).toBlob();

const reader = new FileReader();

reader.readAsDataURL(blob);

reader.onloadend = () => {
    const base64 = reader.result;
    console.log(base64);
}; */

const hoje = new Date().toISOString().split('T')[0] + 'T00:00';

function novoForm(id) {
    return {
        id,
        motivoMacro: '',
        motivoDetalhado: '',
        departamento: '',
        inicio: '',
        fim: '',
        turno: '',
        funcionarios: []
    };
}

export default function Form() {
    const [forms, setForms] = useState([novoForm(1)]);
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const [nextId, setNextId] = useState(2);
    const [funcionarioParaAdicionar, setFuncionarioParaAdicionar] = useState(null);
    const [searchKey, setSearchKey] = useState(0);
    const currentForm = forms[currentFormIndex];

    const departamentoId = Departamentos.find((d) => d.name === currentForm.departamento)?.id;

    const opcoesMaquinas = departamentoId ? maquinas.filter((m) => m.idCusto === departamentoId) : [];


    function updateCurrentForm(field, value) {
        setForms((prev) =>
            prev.map((form, idx) =>
                idx === currentFormIndex ? { ...form, [field]: value } : form
            )
        );
    }

    function adicionarFuncionario() {
        if (!funcionarioParaAdicionar) return;

        const funcionarioExiste = funcionarios.some(
            (f) =>
                f.id === funcionarioParaAdicionar.id &&
                f.name === funcionarioParaAdicionar.name
        );

        if (!funcionarioExiste) {
            toast.error("Funcionário não encontrado!");
            setFuncionarioParaAdicionar(null);
            setSearchKey((prev) => prev + 1);
            return;
        }

        if (currentForm.funcionarios.some((f) => f.id === funcionarioParaAdicionar.id)) {
            toast.error("Funcionário já adicionado!");
        } else {
            updateCurrentForm('funcionarios', [...currentForm.funcionarios, funcionarioParaAdicionar]);
        }

        setFuncionarioParaAdicionar(null);
        setSearchKey((prev) => prev + 1);
    }

    function scrollPage(value) {
        window.scrollTo({
            top: value,
            behavior: "smooth",
        });
    }

    function verificarCamposPreenchidos() {
        const formularioInvalido = forms.some((f) =>
            f.motivoMacro === '' ||
            f.motivoDetalhado === '' ||
            f.departamento === '' ||
            f.inicio === '' ||
            f.fim === '' ||
            f.turno === '' ||
            f.funcionarios.length === 0
        );

        if (formularioInvalido) {
            return { valid: false, toast: "Preencha todos os campos do formulário!" };
        }

        return { valid: true, toast: null };
    }

    function removerFuncionario(id) {
        updateCurrentForm('funcionarios', currentForm.funcionarios.filter((f) => f.id !== id));
    }

    function adicionarForm() {
        const { valid, toast: formToast } = verificarCamposPreenchidos();
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

    function handleSubmit(e) {
        e.preventDefault();

        const { valid, toast: formToast } = verificarCamposPreenchidos();

        if (!valid) {
            toast.error(formToast);
            return;
        }

        console.log(forms);
        toast.success("Solicitações enviadas!");
    }

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <main className="w-full flex items-center flex-col bg-[#ffffff] h-screen">
                <div className='self-end flex flex-col w-full items-center text-blue-300 font-semibold justify-start p-2 gap-5'>
                    <FormIcon width={40} height={40} />
                    <p className="flex w-[80%] self-center justify-center font-semibold text-gray-400 border-gray-300 pb-2 border-b-2 rounded">Formulário - Solicitação HE</p>
                </div>

                {forms.length > 1 && (
                    <div className="grid grid-cols-[80%_20%] gap-2 w-[80%] self-center my-4">
                        <nav className="w-full flex flex-col gap-2 max-h-50 overflow-auto border-2 border-dotted rounded-xl p-3 border-blue-200">
                            {forms.map((f, idx) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setCurrentFormIndex(idx)}
                                    className={`flex gap-2 py-1 px-3 rounded-full text-sm font-semibold transition ${idx === currentFormIndex
                                        ? 'bg-blue-300 text-white'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                >
                                    <p className={`font-bold border-r-2 pr-2 
                                    ${idx === currentFormIndex
                                            ? 'border-blue-400 text-white-400'
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                    >{idx + 1}</p>
                                    <p>{f.motivoMacro}</p>
                                </button>
                            ))}
                        </nav>

                        <nav className="bg-blue-100 rounded-2xl p-2 flex justify-center items-start gap-2">
                            {forms.length > 1 && (
                                <TrashIcon
                                    width={40} height={40}
                                    onClick={() => removerForm(currentFormIndex)}
                                    className="bg-red-500 text-red-200 font-semibold py-2 px-2 rounded-xl hover:bg-red-600 active:bg-red-700 transition"
                                />
                            )}
                        </nav>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full items-center self-center rounded-3xl px-8 py-2 pb-6 gap-5"
                >
                    <div className="flex flex-col w-full relative">
                        <label className='text-gray-400 text-sm font-semibold'>Motivo Macro</label>
                        <Search
                            key={`motivo-macro-${currentForm.id}`}
                            opcoes={MotivoMacro}
                            value={currentForm.motivoMacro}
                            onSelect={(item) => updateCurrentForm('motivoMacro', item.name)}
                        />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label className='text-gray-400 text-sm font-semibold'>Motivo Detalhado</label>
                        <textarea
                            className="min-h-45 w-full rounded-xl bg-gray-100 py-2 px-4 text-start text-gray-800 outline-none focus:ring-2 focus:ring-gray-100 resize-none placeholder:text-gray-400"
                            placeholder="Descreva o motivo da solicitação"
                            name="motivoDetalhado"
                            value={currentForm.motivoDetalhado}
                            onChange={(e) => updateCurrentForm('motivoDetalhado', e.target.value)}
                        />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label className='text-gray-400 text-sm font-semibold'>Departamento</label>
                        <Search
                            key={`departamento-${currentForm.id}`}
                            value={currentForm.departamento}
                            opcoes={Departamentos}
                            onSelect={(item) => updateCurrentForm('departamento', item.name)}
                        />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label className='text-gray-400 text-sm font-semibold'>Início</label>
                        <input
                            type='datetime-local'
                            min={hoje}
                            value={currentForm.inicio}
                            onChange={(e) => updateCurrentForm('inicio', e.target.value)}
                            className="bg-gray-100 text-gray-500 font-semibold py-3 px-10 rounded-xl focus:ring-2 focus:ring-gray-100 outline-0"
                        />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label className='text-gray-400 text-sm font-semibold'>Fim</label>
                        <input
                            type='datetime-local'
                            min={hoje}
                            value={currentForm.fim}
                            onChange={(e) => updateCurrentForm('fim', e.target.value)}
                            className="bg-gray-100 text-gray-500 font-semibold py-3 px-10 rounded-xl focus:ring-2 focus:ring-gray-100 outline-0"
                        />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label className='text-gray-400 text-sm font-semibold'>Turno</label>
                        <Search
                            key={`turno-${currentForm.id}`}
                            value={currentForm.turno}
                            opcoes={Shifts}
                            onSelect={(item) => updateCurrentForm('turno', item.name)}
                        />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label className='text-gray-400 text-sm font-semibold'>Adicione as pessoas da hora extra:</label>
                        <div className="flex flex-row gap-2 w-full">
                            <div className="flex flex-col gap-2">
                                <Search
                                    opcoes={funcionarios.filter((f) => !currentForm.funcionarios.some((ff) => ff.id === f.id))}
                                    onSelect={setFuncionarioParaAdicionar}
                                    key={searchKey}
                                    placeholder={"Insira o RE ou nome"}
                                />
                                {funcionarioParaAdicionar && (
                                    <Search
                                        opcoes={opcoesMaquinas}
                                        placeholder="Selecione a máquina"
                                    />
                                )}
                            </div>

                            <button
                                type={"button"}
                                className={"bg-blue-300 text-white rounded-xl px-4 py-2 font-bold flex items-center justify-center hover:bg-blue-400 active:bg-blue-500 transition cursor-pointer"}
                                disabled={funcionarioParaAdicionar ? false : true}
                                onClick={() => adicionarFuncionario()}
                            >+</button>
                        </div>
                    </div>

                    <ul className="flex flex-col w-full gap-2 border-2 border-blue-300 border-dotted rounded-xl p-2 max-h-60 overflow-y-auto">
                        {currentForm.funcionarios.length > 0 ? (
                            currentForm.funcionarios.map((funcionario) => (
                                <li key={funcionario.id} className="bg-blue-100 text-blue-400 font-semibold py-3 px-4 rounded-xl flex justify-between items-center animate-fade-in">
                                    {funcionario.name}
                                    <button
                                        type="button"
                                        onClick={() => { removerFuncionario(funcionario.id); }}
                                        className="text-blue-800 hover:text-red-500 active:text-red-700"
                                    >
                                        <ClearIcon width={18} height={18} />
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="text-blue-200">Nenhum funcionário adicionado.</li>
                        )}
                    </ul>

                    <div className="">

                    </div>

                    <div className="grid grid-cols-2 flex-row w-full relative gap-3">
                        <nav
                            className="w-full flex justify-center align-center text-blue-300 font-semibold py-3 px-1 rounded-xl transition border-2 border-dotted border-blue-300 text-[0.9rem] cursor-pointer"
                            onClick={() => { adicionarForm() }}
                        >
                            <p className="self-center"> + Nova solicitação</p>
                        </nav>
                        <button
                            type="submit"
                            className="bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-400 active:bg-blue-500 transition"
                        >
                            Enviar Solicitações
                        </button>
                    </div>

                </form>
            </main>
            {/* <PDFViewer width="100%" height="800">
                <DocumentPDF formularios={forms} />
            </PDFViewer> */}
        </>
    )
}