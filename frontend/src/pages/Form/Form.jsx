import { useEffect, useRef, useState } from "react";
import Search from '../../components/Search.jsx'
import HomeIcon from '../../../img/home.svg?react'
import FormIcon from '../../../img/form.svg?react'
import ClearIcon from '../../../img/clear.svg?react'

const MotivoMacro = [
    { id: 1, name: 'Absenteísmo' },
    { id: 2, name: 'Adequação NR-12' },
    { id: 3, name: 'Encher Kamban' },
    { id: 4, name: 'Falta de componente - Comprado' },
    { id: 5, name: 'Falta de componente - Fabricado' },
    { id: 6, name: 'Falta de Embalagem' },
    { id: 7, name: 'Falta de Energia' },
    { id: 8, name: 'Falta de Mão de Obra' },
    { id: 9, name: 'Ineficiência' },
    { id: 10, name: 'Inventário' },
    { id: 11, name: 'Manutenção' },
    { id: 12, name: 'Outros' },
    { id: 13, name: 'Quebra de Máquinas' },
    { id: 14, name: 'Quebra de Moldes' },
    { id: 15, name: 'Reprograma de Cliente' },
    { id: 16, name: 'Reprova de Qualidade' },
    { id: 17, name: 'Retrabalho' },
    { id: 18, name: 'Suporte a Linhas/Injeção' },
    { id: 19, name: 'Try-out - Injetoras' },
    { id: 20, name: 'Organização/Limpeza' }
]

const Departamentos = [
    { id: 1, name: 'INDUSTRIAL' },
    { id: 2, name: 'INJECAO DE PLASTICOS' },
    { id: 3, name: 'INJECAO SMALL' },
    { id: 4, name: 'METALIZACAO' },
    { id: 5, name: 'MONTAGEM LANTERNAS' },
    { id: 6, name: 'MONTAGEM SMALL GM/VW' },
    { id: 7, name: 'MONTAGENS' },
    { id: 8, name: 'PRODUÇÃO' },
    { id: 9, name: 'TAMPOGRAFIA' }
]

const Shifts = [
    { id: 1, name: '1º Turno' },
    { id: 2, name: '2º Turno' },
    { id: 3, name: '3º Turno' },
    { id: 4, name: 'ADM' }
]

const funcionarios = [
    { id: 1835, name: 'Jonathas Oliveira' },
    { id: 1510, name: 'Leandro Almeida' },
    { id: 1132, name: 'Fabricio Fonseca' },
    { id: 4, name: 'Ana Santos' },
    { id: 5, name: 'Pedro Lima' },
    { id: 6, name: 'Fernanda Costa' },
    { id: 7, name: 'Lucas Almeida' },
    { id: 8, name: 'Juliana Rocha' },
    { id: 9, name: 'Rafael Martins' },
    { id: 10, name: 'Camila Ferreira' }
]

const hoje = new Date().toISOString().split('T')[0] + 'T00:00';

export default function Form() {
    const [funcionariosSelecionados, setFuncionariosSelecionados] = useState([]);
    const [funcionarioParaAdicionar, setFuncionarioParaAdicionar] = useState(null);
    const [searchKey, setSearchKey] = useState(0);

    function adicionarFuncionario() {
        if (!funcionarioParaAdicionar) return;

        setFuncionariosSelecionados((prev) =>
            prev.some((f) => f.id === funcionarioParaAdicionar.id)
                ? prev
                : [...prev, funcionarioParaAdicionar]
        );

        setFuncionarioParaAdicionar(null);
        setSearchKey((prev) => prev + 1);
    }

    function removerFuncionario(id) {
        setFuncionariosSelecionados((prev) =>
            prev.filter((f) => f.id !== id)
        );
    }

    return (
        <>
            <main className="w-full flex items-center flex-col bg-[#ffffff] h-screen">
                <div className='self-end flex flex-col w-full items-center text-blue-200 font-semibold justify-start p-2 gap-5'>
                    <FormIcon width={40} height={40} />
                    <p className="flex w-[80%] self-center justify-center font-semibold text-blue-300 border-blue-200 pb-2 border-b-2 rounded">Formulário - Solicitação HE</p>
                </div>
                <form
                    className="flex flex-col w-full items-center self-center rounded-3xl p-8 gap-5"
                >
                    <div className="flex flex-col w-full relative">
                        <label htmlFor="" className='text-blue-400 text-sm font-semibold'>Motivo Macro</label>
                        <Search opcoes={MotivoMacro} />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label htmlFor="" className='text-blue-400 text-sm font-semibold'>Motivo Detalhado</label>
                        <textarea
                            className="min-h-45 w-full rounded-xl bg-[#f2f8ff] py-2 px-4 text-start text-gray-800 outline-none focus:ring-2 focus:ring-gray-100 resize-none placeholder:text-[#d6e4ff]"
                            placeholder="Descreva o motivo da solicitação"
                            name="responsavel"
                        />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label htmlFor="" className='text-blue-400 text-sm font-semibold'>Departamento</label>
                        <Search opcoes={Departamentos} />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label htmlFor="" className='text-blue-400 text-sm font-semibold'>Início</label>
                        <input type='datetime-local' min={hoje} className="bg-blue-50 text-gray-800 py-3 px-10 rounded-xl focus:ring-2 focus:ring-gray-100 outline-0" />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label htmlFor="" className='text-blue-400 text-sm font-semibold'>Fim</label>
                        <input type='datetime-local' min={hoje} className="bg-blue-50 text-gray-800 py-3 px-10 rounded-xl focus:ring-2 focus:ring-gray-100 outline-0" />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label htmlFor="" className='text-blue-400 text-sm font-semibold'>Turno</label>
                        <Search opcoes={Shifts} />
                    </div>

                    <div className="relative flex w-full flex-col">
                        <label htmlFor="" className='text-blue-400 text-sm font-semibold'>Adicione as pessoas da hora extra:</label>
                        <div className="flex flex-row gap-2 w-full">
                            <Search opcoes={funcionarios} onSelect={setFuncionarioParaAdicionar} key={searchKey} />
                            <nav
                                className="bg-blue-300 text-white rounded-xl px-4 py-2 font-bold flex items-center justify-center hover:bg-blue-400 active:bg-blue-500 transition cursor-pointer"
                                onClick={() => adicionarFuncionario()}
                            >+</nav>
                        </div>
                    </div>

                    <ul className="flex flex-col w-full gap-2 border-2 border-blue-300 border-dotted rounded-xl p-2 max-h-60 overflow-y-auto">
                        {funcionariosSelecionados.length > 0 ? (
                            funcionariosSelecionados.map((funcionario) => (
                                <li key={funcionario.id} className="bg-blue-100 text-blue-400 font-semibold py-3 px-4 rounded-xl flex justify-between items-center">
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
                            <li className="text-gray-500">Nenhum funcionário selecionado.</li>
                        )}
                    </ul>
                </form>
            </main >
        </>
    )
}