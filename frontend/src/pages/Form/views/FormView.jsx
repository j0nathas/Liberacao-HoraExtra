import { useState, useEffect } from 'react';
import Search from '../../../components/Search.jsx';
import { hoje } from '../models/formModel.js';
import { Shifts, Plantas } from '../components/dadosFake.js';
import {
    Loader2,
    Plus,
    Trash2,
    Clock,
    UserPlus,
    X,
    FileText,
    Info,
    CheckCircle2,
    Send,
    Calendar,
    ArrowRight,
    Check
} from 'lucide-react';

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
    carregarDepartamentos,
}) {
    const MAX_CHARS = 500;

    const [departamentoInput, setDepartamentoInput] = useState(currentForm.departamento || "");

    useEffect(() => {
        setDepartamentoInput(currentForm.departamento || "");
    }, [currentFormIndex, currentForm.departamento]);

    const handleTurnoChange = (turnoName) => {
        updateCurrentForm('turno', turnoName);
    };

    const handlePlantaChange = (plantaName) => {
        updateCurrentForm('planta', plantaName);
        carregarDepartamentos(plantaName);
        updateCurrentForm('departamento', '');
        setFuncionarioTexto('');
        setFuncionarioSelecionado(null);
        setDepartamentoInput(null);
    };

    function checkDateOrder(inicio, fim) {
        const ms = new Date(fim) - new Date(inicio);
        if (ms <= 0) {
            return (
                <p className="mt-2 text-[11px] text-red-600 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Info size={12} /> O fim deve ser depois do início.
                </p>
            );
        }
        const totalMin = Math.round(ms / 60000);
        const h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        return (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
                <Clock size={12} />
                <span className="font-semibold">
                    Duração: {h}h{m > 0 ? ` ${m}min` : ''}
                </span>
            </div>
        );
    }

    const primeiroCardPreenchido = currentForm.motivoMacro && currentForm.departamento && currentForm.motivoDetalhado && currentForm.planta;
    const liberarTerceiroCard = currentForm.inicio && currentForm.fim && currentForm.turno && primeiroCardPreenchido;
    const tudoPreenchido = currentForm.funcionarios.length > 0 && liberarTerceiroCard;

    return (
        <main className="h-full overflow-auto flex flex-col gap-2 items-center">
            {forms.length > 1 && (
                <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3 overflow-x-auto no-scrollbar">
                        {forms.map((f, idx) => (
                            <div key={f.id} className="flex items-center group">
                                <button
                                    type="button"
                                    onClick={() => setCurrentFormIndex(idx)}
                                    className={`flex w-full items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${idx === currentFormIndex
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className={idx === currentFormIndex ? 'text-white' : 'text-slate-400'}>{idx + 1}.</span>
                                    {f.motivoMacro || 'Nova Solicitação'}
                                </button>
                                {idx === currentFormIndex && (
                                    <button
                                        type="button"
                                        onClick={() => removerForm(idx)}
                                        className="ml-1 p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </header>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 w-full max-w-7xl h-full items-center justify-center">

                <div className="grid grid-cols-1 lg:grid-cols-3 w-[100%] gap-4">
                    {/* Card 1: Motivos e Local */}
                    <div className={`bg-white w-full rounded-2xl shadow-sm border border-gray-200 transition-all flex flex-col`}>
                        <div className={`bg-slate-50 px-6 py-4 border-b rounded-t-2xl border-slate-200 flex items-center relative gap-2 text-slate-700 font-semibold`}>
                            <FileText size={18} className={`${primeiroCardPreenchido ? 'text-green-500' : 'text-blue-600'}`} />
                            <h2>Detalhes</h2>
                            {primeiroCardPreenchido && (
                                <CheckCircle2 size={20} className="text-green-500 absolute right-5 animate-fade-in" />
                            )}
                        </div>
                        <div className="flex flex-col w-full p-6 flex-1 gap-2">

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Planta</label>
                                <nav className="w-full grid grid-cols-2 gap-2 w-full">
                                    {Plantas.map((planta) => {
                                        const isSelected = currentForm.planta === planta.name;
                                        return (
                                            <button
                                                key={planta.id}
                                                type="button"
                                                onClick={() => handlePlantaChange(planta.name)}
                                                disabled={currentForm.funcionarios.length > 0}
                                                className={`flex cursor-pointer justify-between gap-2 p-3 rounded-xl border-2 ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                                                    } disabled:bg-amber-50 disabled:text-amber-600 disabled:border-amber-200 disabled:cursor-not-allowed transition-all`}
                                            >
                                                <span className="font-bold text-xs">{planta.name}</span>
                                                {isSelected ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>


                            <div className="flex flex-col w-full gap-2">
                                <label className="text-sm font-semibold text-slate-700">Motivo Macro</label>
                                <Search
                                    value={motivoTexto}
                                    opcoes={motivosMacro}
                                    onChange={setMotivoTexto}
                                    onSelect={(item) => {
                                        setMotivoTexto(item?.name ?? '');
                                        updateCurrentForm({
                                            motivoMacro: item?.name ?? '',
                                            motivoMacroId: item?.id ?? ''
                                        });
                                    }}
                                    placeholder="Selecione o motivo"
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold text-slate-700">Departamento</label>
                                <Search
                                    value={departamentoInput}
                                    opcoes={departamentos}
                                    onChange={setDepartamentoInput}
                                    onSelect={(item) => {
                                        const nome = item?.name ?? '';
                                        setDepartamentoInput(nome);
                                        updateCurrentForm('departamento', nome);
                                    }}
                                    disabled={currentForm.funcionarios.length > 0 || !currentForm.planta}
                                    placeholder="Selecione o setor"
                                />
                                {currentForm.funcionarios.length > 0 && (
                                    <div className="flex items-center gap-1.5 mt-2 animate-fade-in bg-amber-50 p-2 rounded-lg text-amber-600">
                                        <Info size={14} className="" />
                                        <p className="text-[10px]">
                                            Não é possível trocar o departamento enquanto houver funcionários adicionados.
                                        </p>
                                    </div>
                                )}
                                {!currentForm.planta && (
                                    <div className="flex items-center gap-1.5 mt-2 animate-fade-in bg-amber-50 p-2 rounded-lg text-amber-600">
                                        <Info size={14} className="" />
                                        <p className="text-[10px]">
                                            Selecione a planta antes de escolher o departamento.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className=" pt-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-sm font-semibold text-slate-700">Justificativa</label>
                                    <span className={`text-[10px] font-mono ${currentForm.motivoDetalhado.length >= MAX_CHARS ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                        {currentForm.motivoDetalhado.length}/{MAX_CHARS}
                                    </span>
                                </div>
                                <textarea
                                    maxLength={MAX_CHARS}
                                    className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm"
                                    placeholder="Explique o motivo detalhadamente..."
                                    value={currentForm.motivoDetalhado}
                                    onChange={(e) => updateCurrentForm('motivoDetalhado', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Horários */}
                    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all
                            ${primeiroCardPreenchido
                            ? ''
                            : 'opacity-40 bg-slate-50'
                        }`}>

                        <div className="bg-slate-50 px-6 py-4 relative border-b border-slate-200 flex items-center gap-2 text-slate-700 font-semibold">
                            <Clock size={18} className={`${liberarTerceiroCard ? "text-green-600" : primeiroCardPreenchido ? "text-blue-400" : "text-slate-400"}`} />
                            <h2 className={!primeiroCardPreenchido ? "text-slate-400" : ""}>Planejamento</h2>
                            {liberarTerceiroCard && (
                                <CheckCircle2 size={20} className="text-green-500 absolute right-5 animate-fade-in" />
                            )}
                        </div>

                        <div className={`p-6 space-y-6 flex flex-col flex-1 ${!primeiroCardPreenchido ? 'pointer-events-none select-none' : ''}`}>

                            <div className="space-y-3">
                                <label className={`text-sm font-semibold ${primeiroCardPreenchido ? 'text-slate-700' : 'text-slate-400'}`}>
                                    Turno da HE
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2">
                                    {Shifts.map((shift) => {
                                        const isSelected = currentForm.turno === shift.name;
                                        return (
                                            <button
                                                key={shift.id}
                                                type="button"
                                                disabled={!primeiroCardPreenchido}
                                                onClick={() => handleTurnoChange(shift.name)}
                                                className={`flex cursor-pointer items-center justify-between p-3 rounded-xl border-2 transition-all ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                                                    } ${!primeiroCardPreenchido ? 'opacity-50' : ''}`}
                                            >
                                                <span className="font-bold text-xs">{shift.name}</span>
                                                {isSelected ? <CheckCircle2 size={16} className="text-blue-600" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className={`text-xs font-bold uppercase ${primeiroCardPreenchido ? 'text-slate-500' : 'text-slate-400'} mb-2 block`}>
                                    Período da HE
                                </label>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 ">

                                    <div className={`relative rounded-lg border transition-all
                                            ${currentForm.inicio ? 'border-blue-200 bg-white' : 'border-slate-200 bg-white'}
                                        `}>
                                        <div className="flex items-center gap-3 px-3 py-2.5">
                                            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                                                    ${currentForm.inicio ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}
                                                `}>
                                                <Calendar size={15} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                    Início
                                                </span>
                                                <input
                                                    type="datetime-local"
                                                    min={hoje}
                                                    disabled={!primeiroCardPreenchido}
                                                    value={currentForm.inicio}
                                                    onChange={(e) => updateCurrentForm('inicio', e.target.value)}
                                                    className="w-full bg-transparent text-slate-800 text-sm font-medium outline-none disabled:cursor-not-allowed p-0 border-0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pl-4">
                                        <div className="w-px h-3 bg-slate-300 ml-3.5" />
                                    </div>

                                    <div className={`relative rounded-lg border transition-all
                                            ${currentForm.fim ? 'border-blue-200 bg-white' : 'border-slate-200 bg-white'}
                                        `}>
                                        <div className="flex items-center gap-3 px-3 py-2.5">
                                            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                                                    ${currentForm.fim ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}
                                                `}>
                                                <Calendar size={15} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                    Fim
                                                </span>
                                                <input
                                                    type="datetime-local"
                                                    min={hoje}
                                                    disabled={!primeiroCardPreenchido}
                                                    value={currentForm.fim}
                                                    onChange={(e) => updateCurrentForm('fim', e.target.value)}
                                                    className="w-full bg-transparent text-slate-800 text-sm font-medium outline-none disabled:cursor-not-allowed p-0 border-0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {currentForm.inicio && currentForm.fim && (
                                    checkDateOrder(currentForm.inicio, currentForm.fim)
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Card 3: Equipe */}
                    <div className={`bg-white rounded-2xl border-slate-200 shadow-sm border transition-all flex flex-col lg:col-span-1 overflow-hidden 
                            ${liberarTerceiroCard
                            ? ''
                            : ' opacity-40 bg-slate-50'}`}>

                        <div className="bg-slate-50 px-6 py-4 relative border-b border-slate-200 flex items-center gap-2 text-slate-700 font-semibold">
                            <UserPlus size={18} className={currentForm.funcionarios.length > 0 ? "text-green-600" : liberarTerceiroCard ? "text-blue-600" : "text-slate-400"} />
                            <h2 className={!liberarTerceiroCard ? "text-slate-400" : ""}>Pessoas</h2>
                            {currentForm.funcionarios.length > 0 && (
                                <CheckCircle2 size={20} className="text-green-500 absolute right-5 animate-fade-in" />
                            )}
                        </div>

                        <div className={`p-6 space-y-4 flex-1 ${!liberarTerceiroCard ? 'pointer-events-none select-none' : ''}`}>

                            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 space-y-4">
                                <div className="space-y-3">
                                    <Search
                                        filterLocal={false}
                                        value={funcionarioTexto}
                                        opcoes={opcoesFuncionarios.filter(
                                            (f) => !currentForm.funcionarios.some((ff) => ff.id === f.id)
                                        )}
                                        onChange={setFuncionarioTexto}
                                        onSelect={(f) => {
                                            setFuncionarioTexto(f?.name ?? '');
                                            setFuncionarioSelecionado(f);
                                        }}
                                        placeholder="Buscar Funcionário..."
                                        disabled={!liberarTerceiroCard}
                                    />
                                    <Search
                                        value={maquinaTexto}
                                        opcoes={maquinas}
                                        onChange={setMaquinaTexto}
                                        disabled={!currentForm.departamento || !liberarTerceiroCard}
                                        onSelect={(m) => {
                                            setMaquinaTexto(m?.name ?? '');
                                            setMaquinaSelecionada(m);
                                        }}
                                        placeholder="Selecionar Máquina"
                                    />
                                </div>

                                <button
                                    type="button"
                                    disabled={!funcionarioSelecionado || !maquinaSelecionada || !liberarTerceiroCard}
                                    onClick={adicionarFuncionario}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm py-1 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md shadow-blue-100"
                                >
                                    <Plus size={15} /> Adicionar na Lista
                                </button>
                            </div>

                            <div className=" bg-slate-50 p-1 rounded-2xl h-[200px] [&::-webkit-scrollbar-button]:hidden overflow-y-auto pr-1 custom-scrollbar">
                                {currentForm.funcionarios.length > 0 ? (
                                    currentForm.funcionarios.map((funcionario) => (
                                        <div key={funcionario.id} className="group relative bg-white border border-slate-200 p-2.5 rounded-xl flex flex-col shadow-sm">
                                            <span className="text-slate-700 font-bold text-xs pr-6 truncate">{funcionario.name}</span>
                                            <span className="text-blue-500 text-[10px] font-bold uppercase tracking-wider">{funcionario.maquina.nome}</span>
                                            <button
                                                type="button"
                                                onClick={() => removerFuncionario(funcionario.id)}
                                                className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs italic">
                                        {!liberarTerceiroCard
                                            ? "Complete os detalhes e horários primeiro."
                                            : "Nenhum funcionário adicionado."}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

                        <button
                            type="button"
                            onClick={adicionarForm}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all text-sm"
                        >
                            <Plus size={18} />
                            Nova Solicitação
                        </button>
                    </div>

                    <div className="flex items-center gap-0 group select-none">
                        {/* Passo 1: Detalhes */}
                        <div className="flex items-center">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 shadow-sm
            ${primeiroCardPreenchido
                                    ? 'bg-green-500 border-green-500 text-white shadow-green-100'
                                    : 'bg-blue-600 border-blue-600 text-white animate-pulse'}`}
                            >
                                {primeiroCardPreenchido ? <Check size={20} strokeWidth={3} /> : <span className="font-bold">1</span>}
                            </div>
                            <div className={`w-8 md:w-12 h-1.5 transition-all duration-500
            ${primeiroCardPreenchido ? 'bg-green-500' : 'bg-slate-200'}`}
                            />
                        </div>

                        {/* Passo 2: Planejamento */}
                        <div className="flex items-center">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 shadow-sm
            ${liberarTerceiroCard
                                    ? 'bg-green-500 border-green-500 text-white shadow-green-100'
                                    : primeiroCardPreenchido
                                        ? 'bg-blue-400 border-blue-400 text-white animate-pulse'
                                        : 'bg-white border-slate-200 text-slate-300'}`}
                            >
                                {liberarTerceiroCard ? <Check size={20} strokeWidth={3} /> : <span className="font-bold">2</span>}
                            </div>
                            <div className={`w-8 md:w-12 h-1.5 transition-all duration-500
            ${liberarTerceiroCard ? 'bg-green-500' : 'bg-slate-200'}`}
                            />
                        </div>

                        {/* Passo 3: Equipe */}
                        <div className="flex items-center">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 shadow-sm
            ${tudoPreenchido
                                    ? 'bg-green-500 border-green-500 text-white shadow-green-100'
                                    : liberarTerceiroCard
                                        ? 'bg-blue-400 border-blue-400 text-white animate-pulse'
                                        : 'bg-white border-slate-200 text-slate-300'}`}
                            >
                                {tudoPreenchido ? <Check size={20} strokeWidth={3} /> : <span className="font-bold">3</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center justify-center">
                        {forms.length > 1 && (
                            <p className='text-gray-400 font-semibold'>({forms.length})</p>
                        )}
                        <nav className="flex flex-col items-center">
                            <button
                                type="submit"
                                disabled={loading || forms.some(f => f.funcionarios.length === 0)}
                                className="w-full md:w-auto max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-blue-100 flex justify-center items-center gap-3 
                                disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {loading ? <Loader2 className='animate-spin' /> : (
                                    <>

                                        <Send size={18} />
                                        <span>Enviar {forms.length > 1 ? 'Solicitações' : 'Solicitação'}</span>
                                    </>
                                )}
                            </button>
                            {loading || forms.some(f => f.funcionarios.length === 0) && (
                                <p className="text-[10px] text-red-600 flex items-center gap-1">
                                    Preencha todos os campos das solicitações.
                                </p>
                            )}
                        </nav>

                    </div>

                </div>
            </form>
        </main>
    );
}