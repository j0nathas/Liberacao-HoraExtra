// views/FormView.jsx
// Camada de View: recebe tudo via props do controller e apenas renderiza.
// Não guarda estado próprio nem faz chamadas de API.

import Search from '../../../components/Search.jsx';
import FormIcon from '../../../../img/form.svg?react';
import ClearIcon from '../../../../img/clear.svg?react';
import TrashIcon from '../../../../img/trash.svg?react';
import { hoje } from '../models/formModel.js';
import { Shifts } from '../components/dadosFake.js';

export default function FormView({
    forms,
    currentForm,
    currentFormIndex,
    setCurrentFormIndex,
    maquinas,
    opcoesFuncionarios,
    departamentos,
    motivosMacro,
    motivoTexto,
    setMotivoTexto,
    loading,
    funcionarioSelecionado,
    maquinaSelecionada,
    funcionarioTexto,
    maquinaTexto,
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
}) {
    return (
        <main className="self-center w-full flex items-center flex-col bg-[#ffffff] h-max lg:w-[95%] xl:w-[80%]">
            <div className='self-end flex flex-col w-full items-center text-blue-300 font-semibold justify-start p-2 gap-5'>
                <FormIcon width={40} height={40} />
                <p className="flex w-[80%] self-center justify-center font-semibold text-gray-400 border-gray-300 pb-2 border-b-2 rounded">Formulário - Solicitação HE</p>
            </div>

            {forms.length > 1 && (
                <div className="flex gap-2 w-[75%] self-center my-4">
                    <nav className="w-full flex flex-col gap-2 max-h-50 overflow-auto border-2 border-dotted rounded-xl p-3 border-blue-200 md:grid md:grid-cols-2">
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

                    <nav className="bg-white rounded-2xl flex justify-center items-center">
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
                        value={motivoTexto}
                        opcoes={motivosMacro}
                        onChange={setMotivoTexto}
                        onSelect={(item) => {
                            setMotivoTexto(item?.name ?? '');
                            updateCurrentForm('motivoMacro', item?.name ?? '');
                        }}
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

                <aside className="w-full flex flex-col gap-2 lg:grid lg:grid-cols-2 ">
                    <div className="relative flex w-full flex-col gap-2 md:grid md:grid-cols-2">
                        <div className="flex flex-col">
                            <label className='text-gray-400 text-sm font-semibold'>Departamento</label>
                            <Search
                                value={currentForm.departamento}
                                opcoes={departamentos}
                                onChange={(texto) => updateCurrentForm('departamento', texto)}
                                onSelect={(item) => updateCurrentForm('departamento', item?.name ?? '')}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className='text-gray-400 text-sm font-semibold'>Turno</label>
                            <Search
                                value={currentForm.turno}
                                opcoes={Shifts}
                                onChange={(texto) => updateCurrentForm('turno', texto)}
                                onSelect={(item) => updateCurrentForm('turno', item?.name ?? '')}
                            />
                        </div>
                    </div>

                    <div className="relative flex w-full flex-col gap-2 md:grid md:grid-cols-2">
                        <section className="flex flex-col">
                            <label className='text-gray-400 text-sm font-semibold'>Início</label>
                            <input
                                type='datetime-local'
                                min={hoje}
                                value={currentForm.inicio}
                                onChange={(e) => updateCurrentForm('inicio', e.target.value)}
                                className="bg-gray-100 text-gray-500 w-full font-semibold py-3 px-10 rounded-xl focus:ring-2 focus:ring-gray-100 outline-0"
                            />
                        </section>

                        <section className="flex flex-col">
                            <label className='text-gray-400 text-sm font-semibold'>Fim</label>
                            <input
                                type='datetime-local'
                                min={hoje}
                                value={currentForm.fim}
                                onChange={(e) => updateCurrentForm('fim', e.target.value)}
                                className="bg-gray-100 text-gray-500 w-full font-semibold py-3 px-10 rounded-xl focus:ring-2 focus:ring-gray-100 outline-0"
                            />
                        </section>
                    </div>
                </aside>

                <div className="relative flex w-full flex-col">
                    <label className='text-gray-400 text-sm font-semibold'>Adicione as pessoas da hora extra:</label>
                    <div className="flex flex-row gap-2 w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <Search
                                filterLocal={false}
                                value={funcionarioTexto}
                                opcoes={opcoesFuncionarios.filter(
                                    (f) => !currentForm.funcionarios.some((ff) => ff.id === f.id)
                                )}
                                onChange={setFuncionarioTexto}
                                onSelect={(funcionario) => {
                                    setFuncionarioTexto(funcionario?.name ?? '');
                                    setFuncionarioSelecionado(funcionario);
                                }}
                                placeholder={loading ? "Buscando..." : "Insira o RE ou nome"}
                            />
                            <Search
                                value={maquinaTexto}
                                opcoes={maquinas}
                                onChange={setMaquinaTexto}
                                disabled={!currentForm.departamento}
                                onSelect={(item) => {
                                    setMaquinaTexto(item?.name ?? '');
                                    setMaquinaSelecionada(item?.name ?? null);
                                }}
                                placeholder={currentForm.departamento ? "Selecione a máquina" : "Selecione um departamento primeiro"}
                            />
                        </div>

                        <button
                            type="button"
                            disabled={!funcionarioSelecionado || !maquinaSelecionada}
                            className={`rounded-xl px-4 w-16 font-bold transition ${!funcionarioSelecionado || !maquinaSelecionada
                                ? 'bg-gray-100 text-gray-300'
                                : 'bg-blue-400 text-blue-100 hover:bg-blue-500'
                                }`}
                            onClick={adicionarFuncionario}
                        >+</button>
                    </div>
                </div>

                <ul className="flex flex-col w-full gap-2 border-2 border-blue-300 border-dotted rounded-xl p-2 max-h-60 overflow-y-auto md:grid md:grid-cols-3">
                    {currentForm.funcionarios.length > 0 ? (
                        currentForm.funcionarios.map((funcionario) => (
                            <li key={funcionario.id} className="bg-blue-100 text-blue-400 font-semibold py-3 px-4 rounded-xl flex flex-col justify-between items-center animate-fade-in relative">
                                <label htmlFor="" className="text-ellipsis whitespace-nowrap">{funcionario.name}</label>
                                <label htmlFor="" className="text-[0.6rem] text-blue-300">{funcionario.maquina}</label>
                                <button
                                    type="button"
                                    onClick={() => { removerFuncionario(funcionario.id); }}
                                    className="absolute right-1 translate-y-[-50%] text-blue-400 hover:text-red-500 active:text-red-700"
                                >
                                    <ClearIcon width={18} height={18} />
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="text-blue-200">Nenhum funcionário adicionado.</li>
                    )}
                </ul>

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
    );
}