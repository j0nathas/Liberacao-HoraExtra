import { useState, useEffect, useMemo, useCallback, use } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    X,
    ListChecks,
    Mail,
    RefreshCcw
} from 'lucide-react';

import CardDia from './components/CardDia';
import BarraEnvio from './components/BarraEnvio';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DIAS_EXIBIDOS = 7;

const formatarDataLocal = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

function normalizarDados(resposta) {
    if (!Array.isArray(resposta)) return [];

    return resposta.map((dia) => {
        const turnos = {};

        for (const status of dia.status ?? []) {
            if (!['signed', 'pending'].includes(status.status)) continue;

            for (const turno of status.turnos ?? []) {
                if (!turnos[turno.turno]) {
                    turnos[turno.turno] = { nome: turno.turno, signed: 0, pending: 0 };
                }
                turnos[turno.turno][status.status] += Number(turno.quantidade_pessoas) || 0;
            }
        }

        return { data: dia.inicio, turnos: Object.values(turnos) };
    });
}

const somarDia = (dia) =>
    dia.turnos.reduce(
        (acc, t) => ({ signed: acc.signed + t.signed, pending: acc.pending + t.pending }),
        { signed: 0, pending: 0 }
    );

export default function RH() {
    const [dados, setDados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizadoEm, setAtualizadoEm] = useState(null);

    const [selecionando, setSelecionando] = useState(false);
    const [selecionados, setSelecionados] = useState([]);
    const [modoEnvio, setModoEnvio] = useState('all');
    const [enviando, setEnviando] = useState(false);
    const [reloading, setReloading] = useState(false);

    const HandleReloading = () => {
        setReloading(true);
        setTimeout(() => { setReloading(false) }, 1000);
        void carregarDados();
    }



    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
    });

    const hoje = formatarDataLocal(new Date());

    const dias = useMemo(() => {
        const mapa = new Map(dados.map((dia) => [dia.data, dia]));

        return Array.from({ length: DIAS_EXIBIDOS }, (_, index) => {
            const data = new Date();
            data.setHours(12, 0, 0, 0);
            data.setDate(data.getDate() + index);
            const chave = formatarDataLocal(data);

            return mapa.get(chave) ?? { data: chave, turnos: [] };
        });
    }, [dados, hoje]);

    const totaisSelecionados = useMemo(
        () =>
            dias
                .filter((dia) => selecionados.includes(dia.data))
                .reduce(
                    (acc, dia) => {
                        const t = somarDia(dia);
                        return { signed: acc.signed + t.signed, pending: acc.pending + t.pending };
                    },
                    { signed: 0, pending: 0 }
                ),
        [dias, selecionados]
    );

    const diasSelecionaveis = useMemo(
        () =>
            dias.filter((dia) => {
                const t = somarDia(dia);
                return t.signed + t.pending > 0;
            }),
        [dias]
    );

    const todosSelecionados =
        diasSelecionaveis.length > 0 &&
        selecionados.length === diasSelecionaveis.length;

    const carregarDados = useCallback(async () => {
        setCarregando(true);

        try {
            const { data } = await api.get('/query/quantidadePessoas');
            setDados(normalizarDados(data));
            setAtualizadoEm(new Date());
        } catch (error) {
            console.error('Erro ao carregar indicadores de RH:', error);
            toast.error(
                'Não foi possível carregar os dados. Verifique a conexão com o servidor e tente novamente.'
            );
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const alternarDia = (data) => {
        if (!diasSelecionaveis.some((dia) => dia.data === data)) return;

        setSelecionados((atual) =>
            atual.includes(data)
                ? atual.filter((item) => item !== data)
                : [...atual, data].sort()
        );
    };

    const sairDaSelecao = () => {
        setSelecionando(false);
        setSelecionados([]);
        setModoEnvio('all');
    };

    const alternarTodos = () => {
        setSelecionados(
            todosSelecionados ? [] : diasSelecionaveis.map((dia) => dia.data)
        );
    };
    const enviarEmails = async () => {
        if (!selecionados.length || enviando) return;

        const status = modoEnvio === 'signed' ? ['signed'] : ['signed', 'pending'];


        setEnviando(true);
        try {
            await api.post('/post/emailRestaurante', { datasSelecionadas: selecionados, listaStatus: status });
            sairDaSelecao();
            toast.custom(
                (t) => (
                    <AnimatePresence>
                        {t.visible && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                className="pointer-events-auto flex w-[calc(100vw-32px)] max-w-md items-start gap-4 rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl shadow-emerald-900/10 dark:border-emerald-900/60 dark:bg-gray-800"
                            >
                                {/* Ícone de sucesso */}
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                                    <Mail />
                                </div>

                                {/* Conteúdo */}
                                <div className="min-w-0 flex-1 pt-0.5">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-slate-900 dark:text-gray-100">
                                            Envio concluído!
                                        </p>
                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                            Sucesso
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-gray-300">
                                        O e-mail foi enviado conforme os filtros selecionados.
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-gray-700">
                                            <ListChecks size={14} />
                                            {selecionados.length} {selecionados.length === 1 ? 'dia' : 'dias'}
                                        </span>

                                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-gray-700">
                                            {modoEnvio === 'signed'
                                                ? 'Somente aprovadas'
                                                : 'Aprovadas e pendentes'}
                                        </span>
                                    </div>
                                </div>

                                {/* Fechar */}
                                <button
                                    type="button"
                                    onClick={() => toast.dismiss(t.id)}
                                    aria-label="Fechar notificação"
                                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                >
                                    <X size={17} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                ),
                {
                    duration: 5000,
                    position: 'top-right',
                }
            );
        } catch (e) {
            toast.error('Não foi possível enviar os e-mails.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className="min-h-screen flex-1 overflow-auto bg-slate-50 pb-32 transition-colors dark:bg-gray-900 bg-[radial-gradient(circle,#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] dark:bg-[radial-gradient(circle,#374151_1px,transparent_1px)]  animate-fade-in transition-colors">
            {/* Cabeçalho */}
            <header className="w-full border-b border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100 sm:text-3xl">
                            Painel de horas extras
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                            Acompanhe as solicitações por dia e turno, com destaque para as aprovações pendentes.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {selecionando ? (
                            <>
                                <button
                                    type="button"
                                    onClick={alternarTodos}
                                    disabled={diasSelecionaveis.length === 0}
                                    className="rounded-xl border cursor-pointer border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    {todosSelecionados ? 'Limpar seleção' : 'Selecionar todos'}
                                </button>
                                <button
                                    type="button"
                                    onClick={sairDaSelecao}
                                    className="inline-flex items-center cursor-pointer gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900"
                                >
                                    <X size={16} />
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={HandleReloading}
                                    disabled={reloading}
                                    className="inline-flex items-center cursor-pointer gap-2 rounded-xl bg-slate-200 dark:bg-slate-700 px-5 py-3 text-sm font-semibold text-slate-500 shadow-lg shadow-slate-400/25 dark:shadow-slate-800/25 transition hover:bg-slate-400 hover:text-white disabled:scale-110 disabled:bg-blue-200 disabled:text-blue-700"
                                >
                                    <RefreshCcw className={reloading ? 'animate-loading' : ''} size={18} strokeWidth={2} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelecionando(true);
                                    }}
                                    className="inline-flex items-center cursor-pointer gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
                                >
                                    <ListChecks size={17} />
                                    Selecionar dias
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">

                {/* Dias */}
                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/60">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100">
                            Solicitações por data
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">
                            {selecionando
                                ? 'Selecione os dias e escolha, na barra abaixo, o que deseja enviar.'
                                : 'Arraste os cartões para consultar cada dia.'}
                        </p>
                    </div>

                    {carregando ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }, (_, i) => (
                                <div
                                    key={i}
                                    className="h-[340px] animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="h-4 w-24 rounded bg-slate-200 dark:bg-gray-700" />
                                    <div className="mt-3 h-7 w-36 rounded bg-slate-200 dark:bg-gray-700" />
                                    <div className="mt-6 h-20 rounded-xl bg-slate-100 dark:bg-gray-700" />
                                    <div className="mt-5 space-y-3">
                                        <div className="h-12 rounded-lg bg-slate-100 dark:bg-gray-700" />
                                        <div className="h-12 rounded-lg bg-slate-100 dark:bg-gray-700" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative">
                            <div ref={emblaRef} className="-ml-3 overflow-hidden py-2">
                                <div className="flex">
                                    {dias.map((dia) => (
                                        <CardDia
                                            key={dia.data}
                                            dia={dia}
                                            hoje={hoje}
                                            selecionando={selecionando}
                                            selecionado={selecionados.includes(dia.data)}
                                            onToggle={() => alternarDia(dia.data)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                aria-label="Dias anteriores"
                                onClick={() => emblaApi?.scrollPrev()}
                                className="absolute -left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <ChevronLeft size={19} />
                            </button>
                            <button
                                type="button"
                                aria-label="Próximos dias"
                                onClick={() => emblaApi?.scrollNext()}
                                className="absolute -right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:bg-slate-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <ChevronRight size={19} />
                            </button>
                        </div>
                    )}

                    {!carregando && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 dark:text-gray-500">
                            <span>{dias.length} dias no período</span>
                            {atualizadoEm && (
                                <span>
                                    Atualizado às{' '}
                                    {atualizadoEm.toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            )}
                        </div>
                    )}
                </section>
            </div>

            {/* Barra de ações */}
            <AnimatePresence>
                {selecionando && (
                    <BarraEnvio
                        diasSelecionados={selecionados.length}
                        pessoas={totaisSelecionados}
                        modo={modoEnvio}
                        onModoChange={setModoEnvio}
                        onEnviar={enviarEmails}
                        enviando={enviando}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}