import { useState, useEffect, useRef, use } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import useEmblaCarousel from 'embla-carousel-react';
// Componentes e Ícones
import Search from '../../../components/Search.jsx';
import { hoje } from '../models/formModel.js';
import { Shifts } from '../components/dadosFake.js';
import {
    Loader2, Plus, Trash2, Clock, UserPlus, X, FileText,
    Info, CheckCircle2, Send, Calendar, ArrowRight, Check, Hash, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function FormView({
    forms,
    currentForm,
    currentFormIndex,
    setCurrentFormIndex,
    maquinas,
    opcoesFuncionarios,
    departamentos,
    plantas,
    motivosMacro,
    motivoTexto,
    setMotivoTexto,
    tiposSolicitacao,
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
    vinculoTexto,
    setVinculoTexto,
    vinculoJust,
    setVinculoJust,
    adicionarFuncionario,
    removerFuncionario,
    adicionarForm,
    removerForm,
    handleSubmit,
    carregarDepartamentos,
}) {
    // --- ESTADOS E CONSTANTES ---
    const MAX_CHARS = 200;
    const [departamentoInput, setDepartamentoInput] = useState(currentForm.departamento || "");
    const [limiteHora, setLimiteHora] = useState(null);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [justificativa, setJustificativa] = useState('');
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', dragFree: true });


    useEffect(() => {
        if (emblaApi && currentForm.justificativas.length > 1) {
            emblaApi.scrollTo(currentForm.justificativas.length - 2);
        }
    }, [currentForm.justificativas.length, emblaApi]);


    const prevJustificativasLength = useRef(currentForm.justificativas.length);

    useEffect(() => {
        const cresceu = currentForm.justificativas.length > prevJustificativasLength.current;
        if (emblaApi && cresceu) {
            emblaApi.scrollTo(currentForm.justificativas.length - 1);
        }
        prevJustificativasLength.current = currentForm.justificativas.length;
    }, [currentForm.justificativas.length, emblaApi]);


    useEffect(() => {
        setDepartamentoInput(currentForm.departamento || "");
    }, [currentFormIndex, currentForm.departamento]);

    const handleTurnoChange = (shift) => {
        updateCurrentForm({
            turno: shift.name,
            idTurno: shift.id
        });
    };

    const handlePlantaChange = (planta) => {
        updateCurrentForm({
            planta: planta.name,
            idPlanta: planta.id
        });
        carregarDepartamentos(planta.name);
        updateCurrentForm('departamento', '');
        setFuncionarioTexto('');
        setFuncionarioSelecionado(null);
        setDepartamentoInput(null);
    };

    const handleTipoChange = (type) => {
        updateCurrentForm({
            tipo: type.tipo_solicitacao,
            idTipo: type.id
        });
        setLimiteHora(type.limite);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setMostrarConfirmacao(true);
    };

    const handleJustificativa = () => {
        if (!maquinaSelecionada || !justificativa.trim()) return;

        const novaJustificativa = {
            id: currentForm.justificativas.length + 1,
            maquina: maquinaSelecionada,
            justificativa: justificativa,
            funcionarios: []
        };

        updateCurrentForm('justificativas', [...currentForm.justificativas, novaJustificativa]);

        setJustificativa('');
        setMaquinaTexto('');
        setMaquinaSelecionada(null);
    };

    const removerJustificativa = (id) => {
        updateCurrentForm('justificativas', currentForm.justificativas.filter(j => j.id !== id));
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
        const maiorQueLimite = totalMin > (limiteHora * 60);

        if (maiorQueLimite) {
            return (
                <p className="mt-2 text-[11px] text-red-600 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Info size={12} /> Duração máxima permitida é de {limiteHora} horas.
                </p>
            );
        }

        return (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
                <Clock size={12} />
                <span className="font-semibold">
                    Duração: {h}h{m > 0 ? ` ${m}min` : ''}
                </span>
            </div>
        );
    }

    const horasDeDiferenca = currentForm.inicio && currentForm.fim
        ? dayjs(currentForm.fim).diff(dayjs(currentForm.inicio), 'hour', true)
        : 0;

    const primeiroCardPreenchido = currentForm.motivoMacro && currentForm.departamento && currentForm.justificativas.length > 0 && currentForm.planta;
    const liberarTerceiroCard = currentForm.inicio && currentForm.fim && currentForm.turno && primeiroCardPreenchido && horasDeDiferenca > 0 && horasDeDiferenca <= limiteHora && currentForm.justificativas.length > 0;
    const funcionariosAdicionados = currentForm.justificativas.every(justificativa => justificativa.funcionarios.length > 0);
    const listaComFuncionarios = currentForm.justificativas.find(justificativa => justificativa.funcionarios.length > 0);
    const tudoPreenchido = currentForm.justificativas.length > 0 && liberarTerceiroCard && funcionariosAdicionados;

    const formSemFuncionarios = (f) => f.justificativas.every(j => j.funcionarios.length === 0);

    return (
        <main className="h-full overflow-auto relative flex flex-col gap-2 items-center animate-fade-in">

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

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 w-full max-w-7xl h-max items-center justify-center md:gap-y-2 md:p-6 lg:p-2 xl:p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 w-[100%] gap-4 lg:p-2">

                    {/* --- CARD 1: DETALHES E LOCAL --- */}
                    <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-200 transition-all flex flex-col">
                        <div className="bg-slate-50 px-6 py-4 border-b rounded-t-2xl border-slate-200 flex items-center justify-between relative gap-2 text-slate-700 font-semibold">
                            <div className='flex items-center gap-1'>
                                <FileText size={18} className={`${primeiroCardPreenchido ? 'text-green-500' : 'text-blue-600'}`} />
                                <h2>Detalhes</h2>
                            </div>

                            {primeiroCardPreenchido && <CheckCircle2 size={20} className="text-green-500 absolute right-5 animate-fade-in" />}
                        </div>

                        <div className="flex flex-col w-full p-4 flex-1 gap-2">
                            {/* Planta */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Planta</label>
                                <nav className="w-full grid grid-cols-3 gap-2">
                                    {plantas.map((planta) => {
                                        const isSelected = currentForm.planta === planta.name;
                                        return (
                                            <button
                                                key={planta.id}
                                                type="button"
                                                onClick={() => handlePlantaChange(planta)}
                                                disabled={!funcionariosAdicionados || currentForm.departamento}
                                                className={`flex cursor-pointer justify-between gap-2 p-3 rounded-xl border-2 ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700 disabled:bg-amber-50 disabled:text-amber-600 disabled:border-amber-200' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                                                    } disabled:cursor-not-allowed transition-all`}
                                            >
                                                <span className="font-bold text-xs">{planta.name}</span>
                                                {isSelected ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                                            </button>
                                        );
                                    })}
                                    <button type="button" className="flex cursor-not-allowed justify-between gap-2 p-3 rounded-xl border-2 border-slate-50 opacity-40 bg-slate-50 text-slate-500">
                                        <span className="font-bold text-xs">MMB</span>
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                                    </button>
                                </nav>
                            </div>

                            {/* Motivo Macro */}
                            <div className="flex flex-col w-full gap-2">
                                <label className="text-sm font-semibold text-slate-700">Motivo Macro</label>
                                <Search
                                    value={motivoTexto}
                                    opcoes={motivosMacro}
                                    onChange={setMotivoTexto}
                                    onSelect={(item) => {
                                        setMotivoTexto(item?.name ?? '');
                                        updateCurrentForm({ motivoMacro: item?.name ?? '', motivoMacroId: item?.id ?? '' });
                                    }}
                                    placeholder="Selecione o motivo"
                                />
                            </div>

                            {/* Departamento */}
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold text-slate-700">Departamento</label>
                                <Search
                                    value={departamentoInput}
                                    opcoes={departamentos}
                                    onChange={setDepartamentoInput}
                                    onSelect={(item) => {
                                        const nome = item?.name ?? '';
                                        const idDept = item?.id ?? 0;
                                        setDepartamentoInput(nome);
                                        updateCurrentForm({ departamento: nome, idDepartamento: idDept });
                                    }}
                                    disabled={!funcionariosAdicionados || !currentForm.planta || listaComFuncionarios}
                                    placeholder="Selecione o setor"
                                />
                            </div>

                            {/* Justificativa */}
                            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">

                                {/* Local ou Máquina */}
                                <div className="flex flex-col gap-2">
                                    <Search
                                        value={maquinaTexto}
                                        opcoes={maquinas.filter(m =>
                                            !currentForm.justificativas.some(j =>
                                                j.maquina.id === m.id
                                            )
                                        )}
                                        onChange={setMaquinaTexto}
                                        disabled={!currentForm.departamento}
                                        onSelect={(m) => { setMaquinaTexto(m?.name ?? ''); setMaquinaSelecionada(m); }}
                                        placeholder="Selecionar Máquina"
                                    />
                                </div>

                                {/* Justificativa */}
                                <div className={`flex flex-col gap-2 rounded-xl border p-3 transition-all ${maquinaSelecionada ? 'border-blue-200 bg-white shadow-sm' : 'border-slate-200 bg-slate-100/60 opacity-25'}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className={maquinaSelecionada ? 'text-blue-500' : 'text-slate-400'} />
                                            <label className={`text-sm font-semibold ${maquinaSelecionada ? 'text-slate-700' : 'text-slate-400'}`}>
                                                Justificativa
                                            </label>
                                        </div>
                                        <span className={`text-[10px] font-mono ${justificativa.length >= MAX_CHARS ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                            {justificativa.length}/{MAX_CHARS}
                                        </span>
                                    </div>

                                    <textarea
                                        maxLength={MAX_CHARS}
                                        className={`w-full min-h-[70px] rounded-xl border-slate-200 bg-slate-50 border p-3.5 text-slate-800 outline-none focus:ring-2
                focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm
                ${maquinaSelecionada ? '' : 'opacity-60 cursor-not-allowed'}
            `}
                                        placeholder={maquinaSelecionada ? 'Explique o motivo detalhadamente...' : 'Selecione uma máquina primeiro'}
                                        disabled={!maquinaSelecionada}
                                        value={justificativa}
                                        onChange={(e) => setJustificativa(e.target.value)}
                                    />

                                    <button
                                        type="button"
                                        disabled={!maquinaSelecionada || !justificativa.trim()}
                                        onClick={handleJustificativa}
                                        className="self-end flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold
                hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        <Plus size={14} /> Adicionar
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {currentForm.justificativas.length > 0 && (
                                    <div className="relative flex flex-col gap-1">
                                        <div className="overflow-hidden" ref={emblaRef}>
                                            <div className="flex gap-2">
                                                {currentForm.justificativas.map((item, index) => (
                                                    <article
                                                        key={item.id || index}
                                                        className="group flex items-center justify-between gap-3 bg-white border border-slate-200 p-3 rounded-xl
                                                             hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 transition-all shrink-0 basis-[10%] sm:basis-[90%]"
                                                    >
                                                        <div className="flex flex-col gap-0.5 overflow-hidden">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-blue-600 w-40 truncate bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider border border-blue-100">
                                                                    {item.maquina?.name?.split('_')[0] || 'MÁQUINA'}
                                                                </span>
                                                                <span className={`text-[9px] font-medium ${item.funcionarios?.length ? 'text-slate-400' : 'text-red-300'}`}>
                                                                    • {item.funcionarios?.length || 0} colaborador(es)
                                                                </span>
                                                            </div>
                                                            <p className="text-[9px] text-slate-600 font-medium leading-relaxed line-clamp-2 italic">
                                                                "{item.justificativa}"
                                                            </p>
                                                        </div>

                                                        <button
                                                            onClick={() => removerJustificativa(item.id)}
                                                            className="shrink-0 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Remover máquina"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </article>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Setas de navegação */}
                                        {currentForm.justificativas.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => emblaApi?.scrollPrev()}
                                                    className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-md hover:bg-slate-50"
                                                >
                                                    <ChevronLeft size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => emblaApi?.scrollNext()}
                                                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-md hover:bg-slate-50"
                                                >
                                                    <ChevronRight size={14} />
                                                </button>
                                            </>
                                        )}
                                        <span className="bg-slate-100 font-semibold self-center text-slate-700 text-[8px] px-[5px] py-[1px] rounded-full border border-slate-200">
                                            {currentForm.justificativas.length}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- CARD 2: PLANEJAMENTO (HORÁRIOS) --- */}
                    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all ${primeiroCardPreenchido ? '' : 'opacity-40 bg-slate-50'}`}>
                        <div className="bg-slate-50 px-6 py-4 relative border-b border-slate-200 flex items-center gap-2 text-slate-700 font-semibold">
                            <Clock size={18} className={`${liberarTerceiroCard ? "text-green-600" : primeiroCardPreenchido ? "text-blue-400" : "text-slate-400"}`} />
                            <h2 className={!primeiroCardPreenchido ? "text-slate-400" : ""}>Planejamento</h2>
                            {liberarTerceiroCard && <CheckCircle2 size={20} className="text-green-500 absolute right-5 animate-fade-in" />}
                        </div>

                        <div className={`p-4 space-y-6 flex flex-col flex-1 ${!primeiroCardPreenchido ? 'pointer-events-none select-none' : ''}`}>
                            {/* Turno */}
                            <div className="space-y-3">
                                <label className={`text-sm font-semibold ${primeiroCardPreenchido ? 'text-slate-700' : 'text-slate-400'}`}>Turno da HE</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                    {Shifts.map((shift) => {
                                        const isSelected = currentForm.turno === shift.name;
                                        return (
                                            <button
                                                key={shift.id}
                                                type="button"
                                                disabled={!primeiroCardPreenchido}
                                                onClick={() => handleTurnoChange(shift)}
                                                className={`flex cursor-pointer items-center justify-between p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                                                    } ${!primeiroCardPreenchido ? 'opacity-50' : ''}`}
                                            >
                                                <span className="font-bold text-xs">{shift.name}</span>
                                                {isSelected ? <CheckCircle2 size={16} className="text-blue-600" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tipo Solicitação */}
                            <div className='flex flex-col'>
                                <label className={`text-sm font-semibold ${primeiroCardPreenchido ? 'text-slate-700' : 'text-slate-400'}`}>Tipo de Solicitação</label>
                                <div className='grid grid-cols-2 gap-3'>
                                    {tiposSolicitacao.map((type) => {
                                        const selected = currentForm.tipo === type.tipo_solicitacao;
                                        return (
                                            <button
                                                key={type.id}
                                                onClick={() => handleTipoChange(type)}
                                                type="button"
                                                className={`flex cursor-pointer justify-between gap-2 p-3 rounded-xl border-2 ${selected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'} transition-all`}
                                            >
                                                <span className="font-bold text-xs">{type.tipo_solicitacao}</span>
                                                {selected ? <CheckCircle2 className='w-4 h-4 text-blue-600' /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Período (Datas) */}
                            <div className={` flex flex-col w-full`}>
                                <label className={`text-xs font-bold uppercase ${primeiroCardPreenchido ? 'text-slate-500' : 'text-slate-400'} mb-2 block`}>Período da HE</label>
                                <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-2 w-full justify-self-center">

                                    {/* Início */}
                                    <div className={`relative w-full rounded-lg border transition-all min-w-[150px] 
                                        ${currentForm.inicio ? 'border-blue-200 bg-white shadow-sm' : !currentForm.tipo ? 'border-slate-100 bg-slate-100 cursor-not-allowed' : 'border-slate-200 bg-white'} 
                                        ${!primeiroCardPreenchido ? 'opacity-60' : 'hover:border-blue-300'}`}
                                    >
                                        <div className="flex w-full items-center gap-2 px-2.5 py-1.5">
                                            <div className={`hidden md:flex shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${currentForm.inicio ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <Calendar size={12} />
                                            </div>
                                            <div className="flex-1 px-2 py-1">
                                                <span className="block text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1"> <Calendar className={`md:hidden ${currentForm.inicio ? 'text-blue-400' : 'text-gray-400'}`} size={10} />Início </span>
                                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                                                    <DateTimePicker
                                                        value={currentForm.inicio ? dayjs(currentForm.inicio) : null}
                                                        onChange={(value) => {
                                                            updateCurrentForm('inicio', value ? value.format('YYYY-MM-DDTHH:mm') : '');
                                                            updateCurrentForm('fim', '');
                                                        }}
                                                        minDate={dayjs()}
                                                        disabled={!primeiroCardPreenchido || !currentForm.tipo}
                                                        format="DD/MM/YYYY HH:mm"
                                                        slotProps={{
                                                            textField: {
                                                                variant: 'standard',
                                                                fullWidth: true,
                                                                InputProps: { disableUnderline: true },
                                                                sx: {
                                                                    width: '100%',
                                                                    '& .MuiInputBase-root': { width: '100%' },
                                                                    '& .MuiInputBase-input': {
                                                                        width: '100%',
                                                                        padding: 0,
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 500,
                                                                        color: '#1e293b'
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`border-l-0 h-3 mx-5 ${currentForm.inicio ? 'border-blue-500 border-l-4 animate-cascata-profile' : 'border-gray-400'}`}></div>

                                    {/* Fim */}
                                    <div className={`relative rounded-lg border transition-all min-w-[150px] ${!currentForm.inicio ? 'border-slate-100 bg-slate-100 cursor-not-allowed' : currentForm.fim ? 'border-blue-200 bg-white shadow-sm' : 'border-slate-200 bg-white'}`}>
                                        <div className="flex w-full items-center gap-2 px-2.5 py-1.5">
                                            <div className={`hidden md:flex shrink-0 w-6 h-6 rounded-md items-center justify-center ${currentForm.fim ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <Calendar size={12} />
                                            </div>
                                            <div className="flex-1 px-2 py-1">
                                                <span className="block text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1"> <Calendar className={`md:hidden ${currentForm.fim ? 'text-blue-400' : 'text-gray-400'}`} size={10} />Fim </span>
                                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                                                    <DateTimePicker
                                                        value={currentForm.fim ? dayjs(currentForm.fim) : null}
                                                        onChange={(value) => updateCurrentForm('fim', value ? value.format('YYYY-MM-DDTHH:mm') : '')}
                                                        minDate={currentForm.inicio ? dayjs(currentForm.inicio) : dayjs()}
                                                        maxDate={currentForm.inicio ? dayjs(currentForm.inicio).add(10, 'hour') : undefined}
                                                        disabled={!primeiroCardPreenchido || !currentForm.inicio || !currentForm.tipo}
                                                        format="DD/MM/YYYY HH:mm"
                                                        slotProps={{
                                                            textField: {
                                                                variant: 'standard',
                                                                fullWidth: true,
                                                                InputProps: { disableUnderline: true },
                                                                sx: {
                                                                    width: '100%',
                                                                    '& .MuiInputBase-root': { width: '100%' },
                                                                    '& .MuiInputBase-input': {
                                                                        width: '100%',
                                                                        padding: 0,
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 500,
                                                                        color: '#1e293b'
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {currentForm.inicio && currentForm.fim && checkDateOrder(currentForm.inicio, currentForm.fim)}
                                {!currentForm.tipo && primeiroCardPreenchido && (
                                    <div className="flex items-center gap-1.5 mt-2 animate-fade-in bg-amber-50 p-1 rounded-lg text-amber-600">
                                        <Info width={14} />
                                        <p className="text-[9px]">Selecione o tipo para habilitar o período.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- CARD 3: EQUIPE (PESSOAS) --- */}
                    <div className={`bg-white rounded-2xl border-slate-200 shadow-sm border transition-all flex flex-col lg:col-span-1 overflow-hidden ${liberarTerceiroCard ? '' : ' opacity-40 bg-slate-50'}`}>
                        <div className="bg-slate-50 px-6 py-4 relative border-b border-slate-200 flex items-center gap-2 text-slate-700 font-semibold">
                            <UserPlus size={18} className={tudoPreenchido ? "text-green-600" : liberarTerceiroCard ? "text-blue-600" : "text-slate-400"} />
                            <h2 className={!liberarTerceiroCard ? "text-slate-400" : ""}>Pessoas</h2>
                            {tudoPreenchido && <CheckCircle2 size={20} className="text-green-500 absolute right-5 animate-fade-in" />}
                        </div>

                        <div className={`p-4 space-y-4 flex-1 ${!liberarTerceiroCard ? 'pointer-events-none select-none' : ''}`}>
                            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 space-y-4">
                                <div className="space-y-3">
                                    <Search
                                        filterLocal={false}
                                        value={funcionarioTexto}
                                        opcoes={opcoesFuncionarios.filter(f =>
                                            !currentForm.justificativas.some(j =>
                                                j.funcionarios.some(ff => ff.id === f.id)
                                            )
                                        )}
                                        onChange={setFuncionarioTexto}
                                        onSelect={(f) => { setFuncionarioTexto(f?.name ?? ''); setFuncionarioSelecionado(f); }}
                                        placeholder="Buscar Funcionário..."
                                        disabled={!liberarTerceiroCard}
                                    />


                                    <Search
                                        value={vinculoTexto}
                                        opcoes={currentForm.justificativas.map((justificativa) => ({
                                            idJustificativa: justificativa.id,
                                            ...justificativa.maquina
                                        }))}
                                        onChange={setVinculoTexto}
                                        onSelect={(v) => { setVinculoTexto(v?.name ?? ''); setVinculoJust(v); }}
                                        placeholder="Vincular Justificativas..."
                                        disabled={!liberarTerceiroCard}
                                    />

                                </div>
                                <button
                                    type="button"
                                    disabled={!funcionarioSelecionado || !vinculoJust || !liberarTerceiroCard}
                                    onClick={() => adicionarFuncionario(vinculoJust)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm py-1 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md shadow-blue-100"
                                >
                                    <Plus size={15} /> Adicionar na Lista
                                </button>
                            </div>

                            {/* Lista de Funcionários */}
                            <div className="bg-slate-50 p-1 rounded-2xl h-[65%] overflow-y-auto pr-1 custom-scrollbar">
                                {listaComFuncionarios ? (
                                    currentForm.justificativas.map((justificativa) =>
                                        justificativa.funcionarios.map((funcionario) => (
                                            <div key={`${justificativa.id}-${funcionario.id}`} className="group relative bg-white border border-slate-200 p-2.5 rounded-xl flex flex-col shadow-sm mb-2">
                                                <span className="text-slate-700 font-bold text-xs pr-6 truncate">
                                                    {funcionario.name}
                                                </span>

                                                <span className="text-blue-500 text-[10px] font-bold uppercase">
                                                    {justificativa.maquina?.name}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => removerFuncionario(funcionario.id)}
                                                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs italic">
                                        {!liberarTerceiroCard ? "Complete os detalhes e horários primeiro." : "Nenhum funcionário adicionado."}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER: AÇÕES E STATUS --- */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <button
                        type="button"
                        onClick={adicionarForm}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all text-sm"
                    >
                        <Plus size={18} /> Nova Solicitação
                    </button>

                    {/* Stepper de Progresso */}
                    <div className="flex items-center group select-none">
                        {[primeiroCardPreenchido, liberarTerceiroCard, tudoPreenchido].map((step, i) => (
                            <div key={i} className="flex items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 shadow-sm ${step ? 'bg-green-500 border-green-500 text-white' : (i === 0 || (i === 1 && primeiroCardPreenchido) || (i === 2 && liberarTerceiroCard) ? 'bg-blue-600 border-blue-600 text-white animate-pulse' : 'bg-white border-slate-200 text-slate-300')
                                    }`}>
                                    {step ? <Check size={20} strokeWidth={3} /> : <span className="font-bold">{i + 1}</span>}
                                </div>
                                {i < 2 && <div className={`w-8 md:w-12 h-1.5 transition-all duration-500 ${step ? 'bg-green-500' : 'bg-slate-200'}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Botão Enviar */}
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        {forms.length > 1 && <p className='text-gray-400 font-semibold'>({forms.length})</p>}
                        <nav className="flex flex-col items-center">
                            <button
                                type="submit"
                                disabled={loading || !tudoPreenchido || forms.some(formSemFuncionarios)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl disabled:bg-gray-300 flex items-center gap-3"
                            >
                                {loading ? <Loader2 className='animate-spin' /> : <><Send size={18} /><span>Enviar {forms.length > 1 ? 'Solicitações' : 'Solicitação'}</span></>}
                            </button>
                            {(loading || !tudoPreenchido || forms.some(formSemFuncionarios)) && (
                                <p className="text-[10px] text-red-600 mt-1">Preencha todos os campos das solicitações.</p>
                            )}
                        </nav>
                    </div>
                </div>

                {/* --- MODAL DE CONFIRMAÇÃO --- */}
                {mostrarConfirmacao && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Send size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">Confirmar envio</h2>
                                        <p className="text-xs text-slate-500">Revise as informações antes de continuar.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <p className="text-sm text-slate-600">
                                        Você está prestes a enviar <span className="font-bold text-slate-800">{forms.length} {forms.length === 1 ? 'solicitação' : 'solicitações'}</span>.
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">Deseja realmente continuar?</p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end p-4 bg-slate-50 border-t border-slate-200">
                                <button type="button" onClick={() => setMostrarConfirmacao(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-100">
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={(event) => { setMostrarConfirmacao(false); handleSubmit(event); }}
                                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <Check size={16} /> Confirmar envio
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </main>
    );
}