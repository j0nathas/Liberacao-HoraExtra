import { useState, useEffect, useRef, useMemo } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import useEmblaCarousel from 'embla-carousel-react';
import Search from '../../../components/Search.jsx';
import { Shifts } from '../components/dadosFake.js';
import {
    Loader2, Plus, Trash2, Clock, UserPlus, X, FileText,
    Info, CheckCircle2, Send, Calendar, Check, ChevronLeft, ChevronRight,
    History, AlertTriangle, Copy
} from 'lucide-react';
import CopyInfo from '../components/copyInfo.jsx';

const OPCAO_SELECIONADA = 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300';
const OPCAO_IDLE = 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500';
const BOLINHA = 'w-4 h-4 rounded-full border-2 border-slate-200 dark:border-gray-500';

function useIsDark() {
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

    useEffect(() => {
        const el = document.documentElement;
        const observer = new MutationObserver(() => setIsDark(el.classList.contains('dark')));
        observer.observe(el, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

function formatarDuracao(totalMin) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}h${m > 0 ? ` ${m}min` : ''}`;
}

function AlertConfirm({ forms }) {
    const excedidas = forms.map((form, index) => {
        const totalMin = Math.round(
            (new Date(form.fim) - new Date(form.inicio)) / 60000
        );

        const limiteMin = (form.limiteHora || 0) * 60;

        return {
            form,
            index,
            totalMin,
            limiteMin,
            excessoMin: totalMin - limiteMin
        };
    }).filter(
        ({ totalMin, limiteMin, excessoMin }) =>
            limiteMin > 0 &&
            totalMin > 0 &&
            excessoMin > 0
    );

    if (excedidas.length === 0) {
        return (
            <div className="text-sm text-slate-600 dark:text-gray-300">
                <p>
                    Você está prestes a enviar{' '}
                    <strong className="text-slate-800 dark:text-gray-100">
                        {forms.length}{' '}
                        {forms.length === 1 ? 'solicitação' : 'solicitações'}
                    </strong>.
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                    Deseja realmente continuar?
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <AlertTriangle
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-500"
                />

                <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
                        Atenção
                    </p>

                    <p className="text-xs text-slate-500 dark:text-gray-400">
                        {excedidas.length === 1
                            ? 'Uma solicitação ultrapassa o limite permitido.'
                            : `${excedidas.length} de ${forms.length} solicitações ultrapassam o limite permitido.`}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                {excedidas.map(({ form, index, excessoMin }) => (
                    <div
                        key={form.id ?? index}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-gray-700 dark:bg-gray-900/50 px-3 py-2.5"
                    >
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300">
                                    #{index + 1}
                                </span>

                                <span className="truncate text-xs font-semibold text-slate-700 dark:text-gray-200">
                                    {form.motivoMacro || 'Nova Solicitação'}
                                </span>
                            </div>

                            <span className="text-[11px] text-slate-400 dark:text-gray-500">
                                Duração: {formatarDuracao(
                                    Math.round(
                                        (new Date(form.fim) -
                                            new Date(form.inicio)) / 60000
                                    )
                                )}{' '}
                                · Limite: {form.limiteHora}h
                            </span>
                        </div>

                        <span className="shrink-0 rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                            +{formatarDuracao(excessoMin)}
                        </span>
                    </div>
                ))}
            </div>

            <p className="text-[11px] text-slate-400 dark:text-gray-500">
                Você ainda pode continuar com o envio.
            </p>
        </div>
    );
}




export default function FormView({
    forms,
    currentForm,
    descartarSalvos,
    resgatarForms,
    avisoSalvoLocal,
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
    copiarSolicitacaoAnterior,
}) {
    // --- ESTADOS E CONSTANTES ---
    const MAX_CHARS = 200;
    const [departamentoInput, setDepartamentoInput] = useState(currentForm.departamento || "");
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [justificativa, setJustificativa] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', dragFree: true });

    // --- TEMA (MUI DateTimePicker) ---
    const isDark = useIsDark();
    const muiTheme = useMemo(
        () => createTheme({ palette: { mode: isDark ? 'dark' : 'light' } }),
        [isDark]
    );

    // Mesmas props para os dois pickers (início e fim); só a cor do texto muda com o tema
    const pickerSlotProps = {
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
                    color: isDark ? '#f3f4f6' : '#1e293b'
                }
            }
        }
    };


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
            idTipo: type.id,
            limiteHora: type.limite
        });


        console.log(currentForm)
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

    const handleCopyJustificativa = () => {
        if (!currentForm.justificativas?.length) return;

        setJustificativa(
            currentForm.justificativas[currentForm.justificativas.length - 1].justificativa
        );
    };

    const removerJustificativa = (id) => {
        updateCurrentForm('justificativas', currentForm.justificativas.filter(j => j.id !== id));
    };

    function trocarAba(id) {
        setCurrentFormIndex(id);
        setVinculoTexto('');
        setVinculoTexto(null);
    }

    function checkDateOrder(inicio, fim) {
        const ms = new Date(fim) - new Date(inicio);

        if (ms <= 0) {
            return (
                <p className="mt-2 text-[11px] text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-500/15 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Info size={12} /> O fim deve ser depois do início.
                </p>
            );
        }

        const totalMin = Math.round(ms / 60000);
        const h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        const maiorQueLimite = totalMin > (currentForm.limiteHora * 60);

        if (maiorQueLimite) {
            return (
                <p className="mt-2 text-[11px] text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/15 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Info size={12} /> <strong>CUIDADO!</strong> Duração máxima permitida é de {currentForm.limiteHora} horas.
                </p>
            );
        }

        return (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/15 px-3 py-1.5 rounded-lg w-fit">
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
    const liberarTerceiroCard = currentForm.inicio && currentForm.fim && currentForm.turno && primeiroCardPreenchido && horasDeDiferenca > 0 && currentForm.justificativas.length > 0;
    const funcionariosAdicionados = currentForm.justificativas.every(justificativa => justificativa.funcionarios.length > 0);
    const listaComFuncionarios = currentForm.justificativas.find(justificativa => justificativa.funcionarios.length > 0);
    const tudoPreenchido = currentForm.justificativas.length > 0 && liberarTerceiroCard && funcionariosAdicionados;

    const formSemFuncionarios = (f) => f.justificativas.every(j => j.funcionarios.length === 0);
    const [confirmandoDescarte, setConfirmandoDescarte] = useState(false);


    return (
        <ThemeProvider theme={muiTheme}>
            <main className="h-full overflow-auto relative flex flex-col gap-2 items-center animate-fade-in dark:bg-gray-900">


                {avisoSalvoLocal && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="w-full md:max-w-2xl lg:max-w-7xl mt-2 px-2 motion-safe:animate-fade-in"
                    >
                        <div className={`relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 border
                        rounded-2xl pl-6 pr-4 py-4 shadow-md dark:shadow-none ${confirmandoDescarte ? 'bg-red-500 shadow-slate-100/60  border-red-200 dark:border-red-500/40' : 'bg-blue-500 shadow-blue-100/60  border-blue-200 dark:border-blue-500/40'}`}>

                            <span aria-hidden className={`absolute inset-y-0 left-0 w-1.5 ${confirmandoDescarte ? 'bg-red-500' : 'bg-blue-500'}`} />
                            <div className="flex items-start gap-3 min-w-0">
                                <div className={`relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${confirmandoDescarte ? 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300' : 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300'}`}>
                                    {confirmandoDescarte ? (
                                        <Trash2 size={20} strokeWidth={2.25} />
                                    ) : (
                                        <History size={20} strokeWidth={2.25} />
                                    )}
                                    {!confirmandoDescarte && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className='motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-blue-400' />
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white dark:border-gray-800" />
                                        </span>
                                    )}

                                </div>

                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-slate-800 dark:text-gray-100">
                                        {confirmandoDescarte
                                            ? 'Descartar o rascunho salvo?'
                                            : 'Opa! Acho que isso é seu...'}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                                        {confirmandoDescarte
                                            ? 'Essa ação não pode ser desfeita.'
                                            : 'Deseja continuar a solicitação de onde parou?'}
                                    </span>
                                </div>
                            </div>

                            {/* Ações */}
                            <div className="flex items-center gap-2 shrink-0 sm:ml-4">
                                {!confirmandoDescarte ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={resgatarForms}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-sm shadow-blue-200 dark:shadow-none transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                                        >
                                            Continuar
                                            <ChevronRight size={15} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setConfirmandoDescarte(true)}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-300 dark:hover:bg-red-500/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                                        >
                                            <Trash2 size={14} />
                                            Descartar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                descartarSalvos();
                                                setConfirmandoDescarte(false);
                                            }}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                                        >
                                            Sim, descartar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setConfirmandoDescarte(false)}
                                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                                        >
                                            Cancelar
                                        </button>

                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}


                {forms.length > 1 && (
                    <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-700 px-4 py-3">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3 overflow-x-auto no-scrollbar">
                            {forms.map((f, idx) => (
                                <div key={f.id} className="flex items-center group">
                                    <button
                                        type="button"
                                        onClick={() => trocarAba(idx)}
                                        className={`flex w-full items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${idx === currentFormIndex
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <span className={idx === currentFormIndex ? 'text-white' : 'text-slate-400 dark:text-gray-500'}>{idx + 1}.</span>
                                        {f.motivoMacro || 'Nova Solicitação'}
                                    </button>
                                    {idx === currentFormIndex && (
                                        <button
                                            type="button"
                                            onClick={() => removerForm(idx)}
                                            className="ml-1 p-2 text-slate-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </header>
                )}

                <form onSubmit={handleFormSubmit} className="w-full max-w-7xl flex flex-col flex-1 min-h-0 md:gap-y-2 md:p-6 lg:p-2 xl:p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 w-[100%] gap-4 lg:p-2">

                        {/* --- CARD 1: DETALHES E LOCAL --- */}
                        <div className="bg-white dark:bg-gray-800 w-full rounded-2xl shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 transition-all flex flex-col">
                            <div className="bg-slate-50 dark:bg-gray-900/50 px-6 py-4 border-b rounded-t-2xl border-slate-200 dark:border-gray-700 flex items-center justify-between relative gap-2 text-slate-700 dark:text-gray-200 font-semibold">
                                <div className='flex items-center gap-1'>
                                    <FileText size={18} className={`${primeiroCardPreenchido ? 'text-green-500' : 'text-blue-600 dark:text-blue-400'}`} />
                                    <h2>Detalhes</h2>
                                </div>



                                {primeiroCardPreenchido ? (<CheckCircle2 size={20} className="text-green-500 absolute right-5 animate-fade-in" />) : currentFormIndex !== 0 ? <CopyInfo isMinimized={isMinimized} setIsMinimized={setIsMinimized} onCopy={copiarSolicitacaoAnterior} currentForm={currentFormIndex - 1} /> : ''}
                            </div>

                            <div className="flex flex-col w-full p-4 flex-1 gap-2">
                                {/* Planta */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-200">Planta</label>
                                    <nav className="w-full grid grid-cols-3 gap-2">
                                        {plantas.map((planta) => {
                                            const isSelected = currentForm.planta === planta.name;
                                            return (
                                                <button
                                                    key={planta.id}
                                                    type="button"
                                                    onClick={() => handlePlantaChange(planta)}
                                                    disabled={!funcionariosAdicionados || currentForm.departamento}
                                                    className={`flex cursor-pointer justify-between gap-2 p-3 rounded-xl border-2 ${isSelected
                                                        ? `${OPCAO_SELECIONADA} disabled:bg-amber-50 disabled:text-amber-600 disabled:border-amber-200 dark:disabled:bg-amber-500/15 dark:disabled:text-amber-300 dark:disabled:border-amber-500/30`
                                                        : OPCAO_IDLE
                                                        } disabled:cursor-not-allowed transition-all`}
                                                >
                                                    <span className="font-bold text-xs">{planta.name}</span>
                                                    {isSelected ? <CheckCircle2 size={16} /> : <div className={BOLINHA} />}
                                                </button>
                                            );
                                        })}
                                        <button type="button" className="flex cursor-not-allowed justify-between gap-2 p-3 rounded-xl border-2 border-slate-50 dark:border-gray-700 opacity-40 bg-slate-50 dark:bg-gray-700 text-slate-500 dark:text-gray-300">
                                            <span className="font-bold text-xs">MMB</span>
                                            <div className={BOLINHA} />
                                        </button>
                                    </nav>
                                </div>

                                {/* Motivo Macro */}
                                <div className="flex flex-col w-full gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-200">Motivo Macro</label>
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
                                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-200">Departamento</label>
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
                                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50/60 dark:bg-gray-900/40 p-3">

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
                                    <div className={`flex flex-col gap-2 rounded-xl border p-3 transition-all ${maquinaSelecionada
                                        ? 'border-blue-200 bg-white shadow-sm dark:border-blue-500/40 dark:bg-gray-800 dark:shadow-none'
                                        : 'border-slate-200 bg-slate-100/60 dark:border-gray-700 dark:bg-gray-700/60 opacity-25'}`}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <FileText size={14} className={maquinaSelecionada ? 'text-blue-500' : 'text-slate-400 dark:text-gray-500'} />
                                                <label className={`text-sm font-semibold ${maquinaSelecionada ? 'text-slate-700 dark:text-gray-200' : 'text-slate-400 dark:text-gray-500'}`}>
                                                    Justificativa
                                                </label>
                                            </div>
                                            <span className={`text-[10px] font-mono ${justificativa.length >= MAX_CHARS ? 'text-red-500 font-bold' : 'text-slate-400 dark:text-gray-500'}`}>
                                                {justificativa.length}/{MAX_CHARS}
                                            </span>
                                        </div>

                                        <textarea
                                            maxLength={MAX_CHARS}
                                            className={`w-full min-h-[70px] rounded-xl border-slate-200 bg-slate-50 border p-3.5 text-slate-800 outline-none focus:ring-2
                dark:border-gray-600 dark:bg-gray-900/50 dark:text-gray-100 dark:placeholder:text-gray-500
                focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm
                ${maquinaSelecionada ? '' : 'opacity-60 cursor-not-allowed'}
            `}
                                            placeholder={maquinaSelecionada ? 'Explique o motivo detalhadamente...' : 'Selecione uma máquina primeiro'}
                                            disabled={!maquinaSelecionada}
                                            value={justificativa}
                                            onChange={(e) => setJustificativa(e.target.value)}
                                        />

                                        <div className='flex items-center justify-end gap-2'>

                                            {currentForm.justificativas.length >= 1 && (<button
                                                type="button"
                                                disabled={!maquinaSelecionada}
                                                onClick={handleCopyJustificativa}
                                                className="text-blue-500 dark:text-blue-400 cursor-pointer hover:scale-105 active:scale-90"
                                            >
                                                <Copy size={14} />
                                            </button>
                                            )
                                            }
                                            <button
                                                type="button"
                                                disabled={!maquinaSelecionada || !justificativa.trim()}
                                                onClick={handleJustificativa}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold
                hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-sm dark:shadow-none cursor-pointer"
                                            >
                                                <Plus size={14} /> Adicionar
                                            </button>

                                        </div>


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
                                                            className="group flex items-center justify-between gap-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 p-3 rounded-xl
                                                             hover:border-blue-300 dark:hover:border-blue-400/60 hover:shadow-md hover:shadow-blue-500/5 transition-all shrink-0 basis-[10%] sm:basis-[90%]"
                                                        >
                                                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-300 w-40 truncate bg-blue-50 dark:bg-blue-500/15 px-1.5 py-0.5 rounded uppercase tracking-wider border border-blue-100 dark:border-blue-500/30">
                                                                        {item.maquina?.name?.split('_')[0] || 'MÁQUINA'}
                                                                    </span>
                                                                    <span className={`text-[9px] font-medium ${item.funcionarios?.length ? 'text-slate-400 dark:text-gray-500' : 'text-red-300 dark:text-red-400'}`}>
                                                                        • {item.funcionarios?.length || 0} colaborador(es)
                                                                    </span>
                                                                </div>
                                                                <p className="text-[9px] text-slate-600 dark:text-gray-300 font-medium leading-relaxed line-clamp-2 italic">
                                                                    "{item.justificativa}"
                                                                </p>
                                                            </div>

                                                            <button
                                                                onClick={() => removerJustificativa(item.id)}
                                                                className="shrink-0 p-2 text-slate-300 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
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
                                                        className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 dark:text-gray-200 border border-slate-200 dark:border-gray-600 rounded-full p-1 shadow-md dark:shadow-none hover:bg-slate-50 dark:hover:bg-gray-600"
                                                    >
                                                        <ChevronLeft size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => emblaApi?.scrollNext()}
                                                        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 dark:text-gray-200 border border-slate-200 dark:border-gray-600 rounded-full p-1 shadow-md dark:shadow-none hover:bg-slate-50 dark:hover:bg-gray-600"
                                                    >
                                                        <ChevronRight size={14} />
                                                    </button>
                                                </>
                                            )}
                                            <span className="bg-slate-100 dark:bg-gray-700 font-semibold self-center text-slate-700 dark:text-gray-200 text-[8px] px-[5px] py-[1px] rounded-full border border-slate-200 dark:border-gray-600">
                                                {currentForm.justificativas.length}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* --- CARD 2: PLANEJAMENTO (HORÁRIOS) --- */}
                        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all ${primeiroCardPreenchido ? '' : 'opacity-40 bg-slate-50 dark:bg-gray-900'}`}>
                            <div className="bg-slate-50 dark:bg-gray-900/50 px-6 py-4 relative border-b border-slate-200 dark:border-gray-700 flex items-center gap-2 text-slate-700 dark:text-gray-200 font-semibold">
                                <Clock size={18} className={`${liberarTerceiroCard ? "text-green-600" : primeiroCardPreenchido ? "text-blue-400" : "text-slate-400 dark:text-gray-500"}`} />
                                <h2 className={!primeiroCardPreenchido ? "text-slate-400 dark:text-gray-500" : ""}>Planejamento</h2>
                                {liberarTerceiroCard && <CheckCircle2 size={20} className="text-green-500 absolute right-5 animate-fade-in" />}
                            </div>

                            <div className={`p-4 space-y-6 flex flex-col flex-1 ${!primeiroCardPreenchido ? 'pointer-events-none select-none' : ''}`}>
                                {/* Turno */}
                                <div className="space-y-3">
                                    <label className={`text-sm font-semibold ${primeiroCardPreenchido ? 'text-slate-700 dark:text-gray-200' : 'text-slate-400 dark:text-gray-500'}`}>Turno da HE</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                        {Shifts.map((shift) => {
                                            const isSelected = currentForm.turno === shift.name;
                                            return (
                                                <button
                                                    key={shift.id}
                                                    type="button"
                                                    disabled={!primeiroCardPreenchido}
                                                    onClick={() => handleTurnoChange(shift)}
                                                    className={`flex cursor-pointer items-center justify-between p-3 rounded-xl border-2 transition-all ${isSelected ? OPCAO_SELECIONADA : OPCAO_IDLE
                                                        } ${!primeiroCardPreenchido ? 'opacity-50' : ''}`}
                                                >
                                                    <span className="font-bold text-xs">{shift.name}</span>
                                                    {isSelected ? <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-300" /> : <div className={BOLINHA} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Tipo Solicitação */}
                                <div className='flex flex-col'>
                                    <label className={`text-sm font-semibold ${primeiroCardPreenchido ? 'text-slate-700 dark:text-gray-200' : 'text-slate-400 dark:text-gray-500'}`}>Tipo de Solicitação</label>
                                    <div className='grid grid-cols-2 gap-3'>
                                        {tiposSolicitacao.map((type) => {
                                            const selected = currentForm.tipo === type.tipo_solicitacao;
                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => handleTipoChange(type)}
                                                    type="button"
                                                    className={`flex cursor-pointer justify-between gap-2 p-3 rounded-xl border-2 ${selected ? OPCAO_SELECIONADA : OPCAO_IDLE} transition-all`}
                                                >
                                                    <span className="font-bold text-xs">{type.tipo_solicitacao}</span>
                                                    {selected ? <CheckCircle2 className='w-4 h-4 text-blue-600 dark:text-blue-300' /> : <div className={BOLINHA} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Período (Datas) */}
                                <div className={` flex flex-col w-full`}>
                                    <label className={`text-xs font-bold uppercase ${primeiroCardPreenchido ? 'text-slate-500 dark:text-gray-400' : 'text-slate-400 dark:text-gray-500'} mb-2 block`}>Período da HE</label>
                                    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50 p-2 w-full justify-self-center">

                                        {/* Início */}
                                        <div className={`relative w-full rounded-lg border transition-all min-w-[150px] 
                                        ${currentForm.inicio
                                                ? 'border-blue-200 bg-white shadow-sm dark:border-blue-500/40 dark:bg-gray-800 dark:shadow-none'
                                                : !currentForm.tipo
                                                    ? 'border-slate-100 bg-slate-100 dark:border-gray-700 dark:bg-gray-700 cursor-not-allowed'
                                                    : 'border-slate-200 bg-white dark:border-gray-600 dark:bg-gray-800'} 
                                        ${!primeiroCardPreenchido ? 'opacity-60' : 'hover:border-blue-300 dark:hover:border-blue-400/60'}`}
                                        >
                                            <div className="flex w-full items-center gap-2 px-2.5 py-1.5">
                                                <div className={`hidden md:flex shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${currentForm.inicio ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300' : 'bg-slate-100 text-slate-400 dark:bg-gray-700 dark:text-gray-500'}`}>
                                                    <Calendar size={12} />
                                                </div>
                                                <div className="flex-1 px-2 py-1">
                                                    <span className="block text-[9px] font-bold uppercase text-slate-400 dark:text-gray-500 flex items-center gap-1"> <Calendar className={`md:hidden ${currentForm.inicio ? 'text-blue-400' : 'text-gray-400'}`} size={10} />Início </span>
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
                                                            slotProps={pickerSlotProps}
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`border-l-0 h-3 mx-5 ${currentForm.inicio ? 'border-blue-500 border-l-4 animate-cascata-profile' : 'border-gray-400 dark:border-gray-500'}`}></div>

                                        {/* Fim */}
                                        <div className={`relative rounded-lg border transition-all min-w-[150px] ${!currentForm.inicio
                                            ? 'border-slate-100 bg-slate-100 dark:border-gray-700 dark:bg-gray-700 cursor-not-allowed'
                                            : currentForm.fim
                                                ? 'border-blue-200 bg-white shadow-sm dark:border-blue-500/40 dark:bg-gray-800 dark:shadow-none'
                                                : 'border-slate-200 bg-white dark:border-gray-600 dark:bg-gray-800'}`}>
                                            <div className="flex w-full items-center gap-2 px-2.5 py-1.5">
                                                <div className={`hidden md:flex shrink-0 w-6 h-6 rounded-md items-center justify-center ${currentForm.fim ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300' : 'bg-slate-100 text-slate-400 dark:bg-gray-700 dark:text-gray-500'}`}>
                                                    <Calendar size={12} />
                                                </div>
                                                <div className="flex-1 px-2 py-1">
                                                    <span className="block text-[9px] font-bold uppercase text-slate-400 dark:text-gray-500 flex items-center gap-1"> <Calendar className={`md:hidden ${currentForm.fim ? 'text-blue-400' : 'text-gray-400'}`} size={10} />Fim </span>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                                                        <DateTimePicker
                                                            value={currentForm.fim ? dayjs(currentForm.fim) : null}
                                                            onChange={(value) => updateCurrentForm('fim', value ? value.format('YYYY-MM-DDTHH:mm') : '')}
                                                            minDate={currentForm.inicio ? dayjs(currentForm.inicio) : dayjs()}
                                                            maxDate={currentForm.inicio ? dayjs(currentForm.inicio).add(10, 'hour') : undefined}
                                                            disabled={!primeiroCardPreenchido || !currentForm.inicio || !currentForm.tipo}
                                                            format="DD/MM/YYYY HH:mm"
                                                            slotProps={pickerSlotProps}
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {currentForm.inicio && currentForm.fim && checkDateOrder(currentForm.inicio, currentForm.fim)}
                                    {!currentForm.tipo && primeiroCardPreenchido && (
                                        <div className="flex items-center gap-1.5 mt-2 animate-fade-in bg-amber-50 dark:bg-amber-500/15 p-1 rounded-lg text-amber-600 dark:text-amber-300">
                                            <Info width={14} />
                                            <p className="text-[9px]">Selecione o tipo para habilitar o período.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* --- CARD 3: EQUIPE (PESSOAS) --- */}
                        <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm dark:shadow-none overflow-hidden transition-all flex flex-col min-h-0 h-full lg:col-span-1
                            ${liberarTerceiroCard ? '' : 'opacity-40 bg-slate-50 dark:bg-gray-900'}
                        `}>
                            <div className="bg-slate-50 dark:bg-gray-900/50 px-6 py-4 relative border-b border-slate-200 dark:border-gray-700 flex items-center gap-2 text-slate-700 dark:text-gray-200 font-semibold">
                                <UserPlus size={18} className={tudoPreenchido ? "text-green-600" : liberarTerceiroCard ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-gray-500"} />
                                <h2 className={!liberarTerceiroCard ? "text-slate-400 dark:text-gray-500" : ""}>Pessoas</h2>
                                {tudoPreenchido && <CheckCircle2 size={20} className="text-green-500 absolute right-5 animate-fade-in" />}
                            </div>

                            <div className={`p-4 space-y-4 flex flex-col h-full flex-1 ${!liberarTerceiroCard ? 'pointer-events-none select-none' : ''}`}>
                                <div className="bg-slate-50 dark:bg-gray-900/50 p-2 rounded-2xl border border-slate-200 dark:border-gray-700 space-y-4">
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
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-500 text-white text-sm py-1 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md shadow-blue-100 dark:shadow-none"
                                    >
                                        <Plus size={15} /> Adicionar na Lista
                                    </button>
                                </div>

                                {/* Lista de Funcionários */}
                                <div className="bg-slate-50 dark:bg-gray-900/50 p-1 rounded-2xl pr-1 custom-scrollbar flex flex-col flex-1 max-h-90 min-h-0 overflow-y-auto">
                                    {listaComFuncionarios ? (
                                        currentForm.justificativas.map((justificativa) =>
                                            justificativa.funcionarios.map((funcionario) => (
                                                <div key={`${justificativa.id}-${funcionario.id}`} className="group relative bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 p-2.5 rounded-xl flex flex-col shadow-sm dark:shadow-none mb-2">
                                                    <span className="text-slate-700 dark:text-gray-200 font-bold text-xs pr-6 truncate">
                                                        {funcionario.name}
                                                    </span>

                                                    <span className="text-blue-500 dark:text-blue-300 text-[10px] font-bold uppercase">
                                                        {justificativa.maquina?.name}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => removerFuncionario(funcionario.id)}
                                                        className="absolute top-2 right-2 text-slate-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))
                                        )
                                    ) : (
                                        <div className="py-8 text-center border-2 border-dashed border-slate-100 dark:border-gray-700 rounded-2xl text-slate-400 dark:text-gray-500 text-xs italic">
                                            {!liberarTerceiroCard ? "Complete os detalhes e horários primeiro." : "Nenhum funcionário adicionado."}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- FOOTER: AÇÕES E STATUS --- */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm dark:shadow-none">
                        <button
                            type="button"
                            onClick={adicionarForm}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-transparent border-2 border-dashed border-blue-200 dark:border-blue-500/40 text-blue-600 dark:text-blue-300 font-bold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all text-sm"
                        >
                            <Plus size={18} /> Nova Solicitação
                        </button>

                        {/* Stepper de Progresso */}
                        <div className="flex items-center group select-none">
                            {[primeiroCardPreenchido, liberarTerceiroCard, tudoPreenchido].map((step, i) => (
                                <div key={i} className="flex items-center">
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 shadow-sm dark:shadow-none ${step ? 'bg-green-500 border-green-500 text-white' : (i === 0 || (i === 1 && primeiroCardPreenchido) || (i === 2 && liberarTerceiroCard) ? 'bg-blue-600 border-blue-600 text-white animate-pulse' : 'bg-white border-slate-200 text-slate-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500')
                                        }`}>
                                        {step ? <Check size={20} strokeWidth={3} /> : <span className="font-bold">{i + 1}</span>}
                                    </div>
                                    {i < 2 && <div className={`w-8 md:w-12 h-1.5 transition-all duration-500 ${step ? 'bg-green-500' : 'bg-slate-200 dark:bg-gray-600'}`} />}
                                </div>
                            ))}
                        </div>

                        {/* Botão Enviar */}
                        <div className="flex flex-col md:flex-row gap-3 items-center">
                            {forms.length > 1 && <p className='text-gray-400 dark:text-gray-500 font-semibold'>({forms.length})</p>}
                            <nav className="flex flex-col items-center">
                                <button
                                    type="submit"
                                    disabled={loading || !tudoPreenchido || forms.some(formSemFuncionarios)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl dark:shadow-none disabled:bg-gray-300 dark:disabled:bg-gray-700 dark:disabled:text-gray-500 flex items-center gap-3"
                                >
                                    {loading ? <Loader2 className='animate-spin' /> : <><Send size={18} /><span>Enviar {forms.length > 1 ? 'Solicitações' : 'Solicitação'}</span></>}
                                </button>
                                {(loading || !tudoPreenchido || forms.some(formSemFuncionarios)) && (
                                    <p className="text-[10px] text-red-600 dark:text-red-400 mt-1">Preencha todos os campos das solicitações.</p>
                                )}
                            </nav>
                        </div>
                    </div>

                    {/* --- MODAL DE CONFIRMAÇÃO --- */}
                    {mostrarConfirmacao && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 p-4">
                            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl">

                                <div className="p-6">
                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                                            <Send size={18} />
                                        </div>

                                        <div>
                                            <h2 className="text-base font-bold text-slate-800 dark:text-gray-100">
                                                Confirmar envio
                                            </h2>

                                            <p className="text-xs text-slate-500 dark:text-gray-400">
                                                Revise antes de continuar.
                                            </p>
                                        </div>
                                    </div>

                                    <AlertConfirm forms={forms} />
                                </div>

                                <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50 p-4">
                                    <button
                                        type="button"
                                        onClick={() => setMostrarConfirmacao(false)}
                                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 dark:text-gray-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            setMostrarConfirmacao(false);
                                            handleSubmit(event);
                                        }}
                                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        <Check size={16} />
                                        Confirmar envio
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </main>
        </ThemeProvider>
    );
}