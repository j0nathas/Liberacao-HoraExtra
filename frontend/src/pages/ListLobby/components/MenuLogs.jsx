"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, CircleHelp, ShieldX, X } from "lucide-react";

/* ---------- Configuração ---------- */

const TIPOS = {
    liberado: {
        label: "Liberado",
        icon: CheckCircle2,
        item: "border-emerald-400/40 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-500/10",
        texto: "text-emerald-700 dark:text-emerald-300",
        ponto: "bg-emerald-500",
    },
    bloqueado: {
        label: "Bloqueado",
        icon: ShieldX,
        item: "border-red-400/40 bg-red-50 dark:border-red-400/30 dark:bg-red-500/10",
        texto: "text-red-700 dark:text-red-300",
        ponto: "bg-red-500",
    },
    semRegistro: {
        label: "Sem registro",
        icon: CircleHelp,
        item: "border-amber-400/50 bg-amber-50 dark:border-amber-400/30 dark:bg-amber-500/10",
        texto: "text-amber-700 dark:text-amber-300",
        ponto: "bg-amber-400",
    },
};

const FILTROS = [
    { id: "todos", label: "Todos" },
    { id: "liberado", label: "Liberados" },
    { id: "bloqueado", label: "Bloqueados" },
    { id: "semRegistro", label: "Sem registro" },
];

/* ---------- Helpers ---------- */

const semNulo = (v) => {
    if (v === null || v === undefined) return null;
    const s = String(v).trim();
    return s === "" || s.toUpperCase() === "NULL" ? null : s;
};

const normalizar = (t) =>
    String(t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// "2026-11-12 16:59:54.183" -> Date (horário local)
const lerData = (valor) => {
    if (valor instanceof Date) return valor;
    const d = new Date(String(valor).replace(" ", "T"));
    return Number.isNaN(d.getTime()) ? null : d;
};

const tipoDoLog = (status) => {
    const s = normalizar(status);
    if (s === "liberado") return "liberado";
    if (s === "bloqueado") return "bloqueado";
    return "semRegistro";
};

/**
 * Aceita tanto a linha do banco quanto o evento do SSE.
 * Ajuste os nomes dos campos aqui se o seu back-end usar outros.
 */
export const normalizarLog = (bruto) => {
    const data = lerData(bruto.data ?? bruto.dataHora ?? bruto.created_at ?? bruto.timestamp);
    const nome = semNulo(bruto.nome);
    const re = semNulo(bruto.re);
    const tipo = nome || re ? tipoDoLog(bruto.liberacao ?? bruto.status) : "semRegistro";
    return {
        id: `${data?.getTime() ?? "x"}-${re ?? "sem"}-${tipo}`,
        nome,
        re,
        setor: semNulo(bruto.setor),
        tipo,
        data,
    };
};

const formatarHora = (d) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const formatarQuando = (d, agora) => {
    const seg = Math.max(0, Math.floor((agora - d) / 1000));
    if (seg < 60) return "agora";
    const min = Math.floor(seg / 60);
    if (min < 60) return `há ${min} min`;
    const h = Math.floor(min / 60);
    return `há ${h} h`;
};

/* ---------- Item ---------- */

function ItemLog({ log, agora }) {
    const { icon: Icon, item, texto, label } = TIPOS[log.tipo];
    const titulo = log.nome ?? "Pessoa não identificada";

    return (
        <li className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${item}`}>
            <Icon size={18} className={`mt-0.5 shrink-0 ${texto}`} aria-hidden="true" />

            <div className="min-w-0 flex-1">
                <p
                    title={titulo}
                    className="truncate text-sm font-semibold text-slate-900 dark:text-gray-100"
                >
                    {titulo}
                </p>
                <p className="truncate text-xs text-slate-600 dark:text-gray-400">
                    {log.re ? `RE ${log.re}` : "Sem RE"}
                    {log.setor ? ` • ${log.setor}` : ""}
                </p>
                <p className={`mt-0.5 text-xs font-medium ${texto}`}>{label}</p>
            </div>

            {log.data && (
                <div className="shrink-0 text-right">
                    <p className="text-xs font-medium tabular-nums text-slate-700 dark:text-gray-300">
                        {formatarHora(log.data)}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-500">
                        {formatarQuando(log.data, agora)}
                    </p>
                </div>
            )}
        </li>
    );
}

/* ---------- Componente principal ---------- */

/**
 * Props:
 *  - logs: array de registros (históricos + novos do SSE), em qualquer ordem.
 *          Aceita o formato bruto; o componente normaliza, remove duplicados
 *          e ordena do mais novo para o mais antigo. A janela de horas vem do back-end.
 *  - subtitulo: texto abaixo do título (padrão "Últimas 12 horas").
 *  - className: classes extras para o wrapper.
 */
export default function MenuLogs({ logs = [], subtitulo = "Últimas 12 horas", className = "" }) {
    const [aberto, setAberto] = useState(false);
    const [filtro, setFiltro] = useState("todos");
    const [agora, setAgora] = useState(() => Date.now());
    const [ultimaLeitura, setUltimaLeitura] = useState(() => Date.now());
    const raiz = useRef(null);

    // Atualiza o "há X min" e a janela de 12h
    useEffect(() => {
        const id = setInterval(() => setAgora(Date.now()), 30_000);
        return () => clearInterval(id);
    }, []);

    // Fecha ao clicar fora ou apertar Esc
    useEffect(() => {
        if (!aberto) return;
        const fora = (e) => {
            if (raiz.current && !raiz.current.contains(e.target)) setAberto(false);
        };
        const esc = (e) => e.key === "Escape" && setAberto(false);
        document.addEventListener("mousedown", fora);
        document.addEventListener("touchstart", fora);
        document.addEventListener("keydown", esc);
        return () => {
            document.removeEventListener("mousedown", fora);
            document.removeEventListener("touchstart", fora);
            document.removeEventListener("keydown", esc);
        };
    }, [aberto]);

    // A janela de horas já vem filtrada do back-end: aqui só normaliza, remove duplicados e ordena
    const lista = useMemo(() => {
        const vistos = new Set();
        return logs
            .map(normalizarLog)
            .filter((l) => l.data)
            .filter((l) => (vistos.has(l.id) ? false : vistos.add(l.id)))
            .sort((a, b) => b.data - a.data);
    }, [logs]);

    const contagem = useMemo(() => {
        const c = { todos: lista.length, liberado: 0, bloqueado: 0, semRegistro: 0 };
        lista.forEach((l) => (c[l.tipo] += 1));
        return c;
    }, [lista]);

    const visiveis = filtro === "todos" ? lista : lista.filter((l) => l.tipo === filtro);

    const naoLidos = useMemo(
        () => lista.filter((l) => l.data.getTime() > ultimaLeitura).length,
        [lista, ultimaLeitura]
    );

    const alternar = () => {
        setAberto((v) => {
            if (v) setUltimaLeitura(Date.now()); // ao fechar, marca como lido
            return !v;
        });
    };

    return (
        <div ref={raiz} className={`relative inline-block ${className}`}>
            <button
                type="button"
                onClick={alternar}
                aria-haspopup="true"
                aria-expanded={aberto}
                aria-label={`Registros de acesso${naoLidos ? `, ${naoLidos} novos` : ""}`}
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                <Bell size={18} />
                {naoLidos > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                        {naoLidos > 99 ? "99+" : naoLidos}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {aberto && (
                    <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="
                            fixed inset-x-2 top-16 z-50 flex max-h-[75vh] flex-col
                            rounded-2xl border border-slate-200 bg-white shadow-xl
                            dark:border-gray-700 dark:bg-gray-900
                            sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96 sm:max-h-[70vh]
                            lg:w-[26rem]
                            xl:w-[30rem] xl:max-h-[75vh]
                        "
                    >
                        {/* Cabeçalho */}
                        <header className="flex items-center justify-between gap-2 px-4 pb-2 pt-3">
                            <div className="min-w-0">
                                <h2 className="text-base font-bold text-slate-900 dark:text-gray-100">
                                    Registros de acesso
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                    {subtitulo}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={alternar}
                                aria-label="Fechar"
                                className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                            >
                                <X size={16} />
                            </button>
                        </header>

                        {/* Filtros (também servem de legenda das cores) */}
                        <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
                            {FILTROS.map(({ id, label }) => {
                                const ativo = filtro === id;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setFiltro(id)}
                                        aria-pressed={ativo}
                                        className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${ativo
                                                ? "border-blue-500 bg-blue-600 text-white"
                                                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {id !== "todos" && (
                                            <span className={`h-2 w-2 rounded-full ${TIPOS[id].ponto}`} />
                                        )}
                                        {label}
                                        <span className="tabular-nums opacity-70">{contagem[id]}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Lista */}
                        <div className="min-h-0 flex-1 overflow-y-auto border-t border-slate-100 px-3 py-3 dark:border-gray-800">
                            {visiveis.length === 0 ? (
                                <p className="py-8 text-center text-sm text-slate-500 dark:text-gray-400">
                                    Nenhum registro encontrado.
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {visiveis.map((log) => (
                                        <ItemLog key={log.id} log={log} agora={agora} />
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}