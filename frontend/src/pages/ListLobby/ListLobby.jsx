"use client";

import { useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarDays,
    CheckCircle2,
    Clock,
    Users,
    Search,
    X,
    Sun,
    Sunset,
    Moon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

/* ---------- Constantes de estilo (mesmo padrão do CardDia) ---------- */

const STATUS = {
    signed: {
        label: "Aprovado",
        icon: CheckCircle2,
        color: "text-emerald-400 dark:text-emerald-300",
        bg: "bg-emerald-50 dark:bg-emerald-500/15",
        border: "border-emerald-200 dark:border-emerald-500/20",
    },
    pending: {
        label: "Pendente",
        icon: Clock,
        color: "text-amber-500 dark:text-amber-300",
        bg: "bg-amber-50 dark:bg-amber-500/15",
        border: "border-amber-200 dark:border-amber-500/20",
    },
};

const TONS = {
    pending: {
        frame: "border-amber-200 bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10",
        footer: "text-amber-700 dark:text-amber-300",
    },
    signed: {
        frame: "border-emerald-200 bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10",
        footer: "text-emerald-700 dark:text-emerald-300",
    },
    empty: {
        frame: "border-slate-200 bg-slate-100 dark:border-gray-700 dark:bg-gray-800/60",
        footer: "text-slate-400 dark:text-gray-500",
    },
};

const TURNOS = [
    { nome: "Manhã", icone: Sun },
    { nome: "Tarde", icone: Sunset },
    { nome: "Noite", icone: Moon },
];

const FILTROS = [
    { id: "all", label: "Todos", icon: Users },
    { id: "signed", label: "Aprovados", icon: CheckCircle2 },
    { id: "pending", label: "Pendentes", icon: Clock },
];

const DIAS_EXIBIDOS = 7;

/* ---------- Helpers ---------- */

const formatarDataLocal = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
};

const interpretarDataLocal = (data) => {
    const [ano, mes, dia] = data.split("-").map(Number);
    return new Date(ano, mes - 1, dia);
};

const formatarData = (data) =>
    interpretarDataLocal(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

const formatarDiaSemana = (data, hoje) => {
    if (data === hoje) return "Hoje";
    return interpretarDataLocal(data)
        .toLocaleDateString("pt-BR", { weekday: "long" })
        .replace("-feira", "");
};

const normalizar = (texto) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const plural = (n, singular, pluralTxt) => `${n} ${n === 1 ? singular : pluralTxt}`;

function gerarMock() {
    const pessoas = [
        ["Ana Souza", "10234"], ["Bruno Lima", "10587"], ["Carla Mendes", "11002"],
        ["Diego Alves", "10911"], ["Elaine Costa", "10455"], ["Fábio Rocha", "11230"],
        ["Gabriela Nunes", "10678"], ["Hugo Martins", "11345"], ["Isabela Pires", "10099"],
        ["João Ribeiro", "10812"], ["Kátia Moreira", "11120"], ["Lucas Andrade", "10390"],
    ];

    return Array.from({ length: DIAS_EXIBIDOS }, (_, i) => {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        d.setDate(d.getDate() + i);
        return formatarDataLocal(d);
    }).flatMap((data, i) =>
        pessoas
            .filter((_, j) => i === 5 ? j < 2 : i === 6 ? false : true)
            .map(([nome, re], j) => ({
                id: `${data}-${re}`,
                data,
                turno: TURNOS[(i + j) % 3].nome,
                nome,
                re,
                aprovado: (i + j) % 3 !== 0,
            }))
    );
}

/* ---------- Componentes ---------- */

function Destaque({ texto, termo }) {
    const t = normalizar(termo);
    const base = normalizar(texto);
    const pos = t && base.length === texto.length ? base.indexOf(t) : -1;
    if (pos === -1) return texto;
    return (
        <>
            {texto.slice(0, pos)}
            <mark className="rounded bg-blue-100 px-0.5 text-blue-700 dark:bg-blue-500/25 dark:text-blue-200">
                {texto.slice(pos, pos + t.length)}
            </mark>
            {texto.slice(pos + t.length)}
        </>
    );
}

function BadgeStatus({ aprovado }) {
    const { icon: Icon, label, bg, border, color } = STATUS[aprovado ? "signed" : "pending"];
    return (
        <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-1 py-1 text-[11px] font-semibold ${color}`}
        >
            <Icon size={16} />
        </span>
    );
}

function CardDiaLobby({ dia, hoje, ativo, busca, encontrados, onSelect }) {
    const vazio = dia.signed + dia.pending === 0;
    const total = dia.signed + dia.pending;
    const tom = TONS[vazio ? "empty" : dia.pending > 0 ? "pending" : "signed"];
    const semResultado = busca && encontrados === 0;

    return (
        <div className="min-w-0 flex-[0_0_170px] pl-3">
            <button
                type="button"
                onClick={onSelect}
                aria-pressed={ativo}
                className={`flex h-full w-full cursor-pointer flex-col rounded-2xl p-1.5 text-left shadow-sm transition-all hover:shadow-md ${ativo ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-slate-700 dark:ring-offset-gray-900" : "dark:bg-gray-800"
                    } ${semResultado ? "opacity-50" : ""}`}
            >
                <div
                    className={`flex-1 rounded-xl p-1 py-3 
                        }`}
                >
                    <div className="flex items-center gap-2.5">
                        <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-xl ${ativo
                                ? "bg-blue-600 text-white"
                                : vazio
                                    ? "bg-slate-200 text-slate-400 dark:bg-gray-700 dark:text-gray-500"
                                    : "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
                                }`}
                        >
                            <CalendarDays size={10} />
                        </span>
                        <div className="min-w-0">
                            <h3
                                className={`truncate text-base font-bold capitalize leading-tight ${vazio ? "text-slate-500 dark:text-gray-400" : "text-slate-900 dark:text-gray-100"
                                    }`}
                            >
                                {formatarDiaSemana(dia.data, hoje)}
                            </h3>
                            <p className="truncate text-xs text-slate-500 dark:text-gray-400">{formatarData(dia.data)}</p>
                        </div>
                    </div>
                </div>
            </button>
        </div>
    );
}

/* ---------- Página ---------- */

export default function ListLobby() {
    const hoje = formatarDataLocal(new Date());
    const registros = useMemo(gerarMock, []);

    const [diaSelecionado, setDiaSelecionado] = useState(hoje);
    const [filtro, setFiltro] = useState("all");
    const [busca, setBusca] = useState("");

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        dragFree: true,
        containScroll: "trimSnaps",
    });

    const termo = normalizar(busca);

    const casaBusca = (r) =>
        !termo || normalizar(r.nome).includes(termo) || normalizar(r.re).includes(termo);
    const casaFiltro = (r) => filtro === "all" || (filtro === "signed" ? r.aprovado : !r.aprovado);

    const dias = useMemo(
        () =>
            Array.from({ length: DIAS_EXIBIDOS }, (_, i) => {
                const d = new Date();
                d.setHours(12, 0, 0, 0);
                d.setDate(d.getDate() + i);
                const data = formatarDataLocal(d);
                const doDia = registros.filter((r) => r.data === data);
                return {
                    data,
                    signed: doDia.filter((r) => r.aprovado).length,
                    pending: doDia.filter((r) => !r.aprovado).length,
                    encontrados: doDia.filter((r) => casaBusca(r) && casaFiltro(r)).length,
                };
            }),
        [registros, termo, filtro]
    );

    const doDia = registros.filter((r) => r.data === diaSelecionado);
    const visiveis = doDia.filter((r) => casaBusca(r) && casaFiltro(r));
    const contagemFiltro = {
        all: doDia.filter(casaBusca).length,
        signed: doDia.filter((r) => casaBusca(r) && r.aprovado).length,
        pending: doDia.filter((r) => casaBusca(r) && !r.aprovado).length,
    };

    return (
        <main className="min-h-screen flex-1 overflow-auto relative bg-slate-50 pb-16 transition-colors dark:bg-gray-900 bg-[radial-gradient(circle,#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] dark:bg-[radial-gradient(circle,#374151_1px,transparent_1px)]">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6">
                {/* Dias */}
                <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/60">
                    <div className="relative">
                        <div ref={emblaRef} className="-ml-3 overflow-hidden py-2">
                            <div className="flex items-center">
                                {dias.map((dia) => (
                                    <CardDiaLobby
                                        key={dia.data}
                                        dia={dia}
                                        hoje={hoje}
                                        ativo={dia.data === diaSelecionado}
                                        busca={termo}
                                        encontrados={dia.encontrados}
                                        onSelect={() => setDiaSelecionado(dia.data)}
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
                </section>

                {/* Lista do dia */}
                <section className="rounded-3xl border border-slate-200 bg-slate-100/80 p-5 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/60">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={diaSelecionado}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3"
                        >
                            {TURNOS.map(({ nome: turno, icone: Icone }) => {
                                const todos = doDia.filter((r) => r.turno === turno);
                                const aprovados = todos.filter((r) => r.aprovado).length;
                                const pessoas = visiveis.filter((r) => r.turno === turno);
                                const vazio = todos.length === 0;
                                const tom = TONS[vazio ? "empty" : todos.length - aprovados > 0 ? "pending" : "signed"];

                                return (
                                    <article
                                        key={turno}
                                        className={`flex flex-col rounded-2xl p-1.5 shadow-sm ${vazio ? "bg-slate-50 dark:bg-gray-800/60" : "bg-white dark:bg-gray-800"}`}
                                    >
                                        <div
                                            className={`flex-1 rounded-xl p-4`}
                                        >
                                            <header className="flex items-center gap-3">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                                                    <Icone size={19} />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-gray-100">
                                                        {turno}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 dark:text-gray-400">
                                                        {aprovados} de {plural(todos.length, "pessoa", "pessoas")} aprovados
                                                    </p>
                                                </div>
                                            </header>

                                            {pessoas.length === 0 ? (
                                                <div className="mt-4 rounded-xl border border-dashed border-slate-300 py-8 text-center dark:border-gray-700">
                                                    <Users size={20} className="mx-auto text-slate-300 dark:text-gray-600" />
                                                    <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
                                                        {vazio
                                                            ? "Nenhuma pessoa neste turno"
                                                            : "Nenhum resultado para os filtros"}
                                                    </p>
                                                </div>
                                            ) : (
                                                <ul className="mt-4 space-y-2">
                                                    {pessoas.map((p) => (
                                                        <li
                                                            key={p.id}
                                                            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-700/50"
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-gray-100">
                                                                    <Destaque texto={p.nome} termo={busca} />
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                                                    RE <Destaque texto={p.re} termo={busca} />
                                                                </p>
                                                            </div>
                                                            <BadgeStatus aprovado={p.aprovado} />
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </section>
            </div>

            <div className="fixed w-90 top-[91%] left-[50%] translate-x-[-50%] bg-white dark:bg-gray-800 pt-4 px-4 pb-10 rounded-2xl border border-gray-200 dark:border-slate-600">
                <Search
                    size={17}
                    className="pointer-events-none absolute left-8 top-[38%] -translate-y-1/2 text-slate-400 dark:text-gray-500"
                />
                <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por nome ou RE"
                    aria-label="Buscar pessoa por nome ou RE"
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-gray-900"
                />
                {busca && (
                    <button
                        type="button"
                        onClick={() => setBusca("")}
                        aria-label="Limpar busca"
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>
        </main>
    );
}