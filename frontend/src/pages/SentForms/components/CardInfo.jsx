import { motion, AnimatePresence } from "framer-motion";
import SentIcon from '../../../../img/sent-date.svg?react'
import OpenIcon from '../../../../img/open.svg?react'
import api from '../../../services/api.js'
import { useEffect, useState } from "react";
import { CircleCheckBig, Clock, CircleSlash, CircleX, X, ArrowRight } from 'lucide-react';
import { totalAccHours, totalHours, formatDate } from "../Utils/SentUtils";




export default function CardInfo({ dados, closeInfo }) {

    const [openLista, setOpenLista] = useState(false);
    const status = dados.status === "pending" ? "pendente" : dados.status === "signed" ? "aprovado" : "Não Enviado";

    const [dadosZapSign, setDadosZapSign] = useState(null);
    const [loadingSigners, setLoadingSigners] = useState(true);

    useEffect(() => {
        async function carregarInfoDocZapSign() {
            try {

                const response = await api.get(`/query/infoDocZapSign`, {
                    params: {
                        token: dados.token
                    }
                });
                setDadosZapSign(response.data);

            } catch (error) {
                console.error("Erro ao consultar documento:", error);
            }
            finally {
                setLoadingSigners(false);
            }
        }

        carregarInfoDocZapSign();
    }, []);

    const tone = {
        pendente: {
            frame: "bg-amber-100",
            ink: "text-amber-700",
            pill: "bg-amber-50 text-amber-700",
            solid: "bg-amber-500",
            icon: <Clock width={15} height={15} />,
        },
        aprovado: {
            frame: "bg-emerald-100",
            ink: "text-emerald-700",
            pill: "bg-emerald-50 text-emerald-700",
            solid: "bg-emerald-500",
            icon: <CircleCheckBig width={15} height={15} />,
        },
        "Não Enviado": {
            frame: "bg-slate-100",
            ink: "text-slate-600",
            pill: "bg-slate-50 text-slate-600",
            solid: "bg-slate-400",
            icon: <CircleSlash width={15} height={15} />,
        },
    }[status];

    const signerTone = {
        pending: { bg: "bg-amber-50", text: "text-amber-700", icon: <Clock width={9} height={9} /> },
        signed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: <CircleCheckBig width={9} height={9} /> },
        rejected: { bg: "bg-red-50", text: "text-red-700", icon: <CircleX width={9} height={9} /> },
    };

    const formatTime = (isoString) => isoString?.split('T')[1]?.slice(0, 5) ?? '--:--';

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeInfo}
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full lg:w-[60%] rounded-t-[28px] p-2 pb-0 ${tone.frame} shadow-2xl font-sans`}
                    initial={{ y: "120%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                    drag="y"
                    dragDirectionLock
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(event, info) => {
                        if (info.offset.y > 120 || info.velocity.y > 600) {
                            closeInfo();
                        }
                    }}
                >
                    <div className="flex justify-center py-2.5 cursor-grab active:cursor-grabbing relative">
                        <div className="h-1.5 w-14 rounded-full bg-white/70" />
                    </div>

                    <div className="bg-white rounded-[22px] px-3 pt-3 pb-3 md:px-6 md:pt-6 md:pb-5 flex flex-col gap-2 md:gap-5">

                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full ${tone.pill}`}>
                                    {tone.icon}
                                </span>
                                <span className="text-xs font-semibold text-gray-400">#{dados.id}</span>
                            </div>
                            <button
                                onClick={closeInfo}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
                            >
                                <X width={14} height={14} />
                            </button>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-800 leading-tight">
                                {dados.motivosMacro.descricao}
                            </h2>
                            <p className={`text-xs font-bold uppercase tracking-wide mt-1 ${tone.ink}`}>
                                {dados.departamento.departamento}
                            </p>
                        </div>

                        {loadingSigners ? (
                            <div className="flex flex-wrap gap-1.5">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <span key={i} className="h-5 w-16 rounded-lg bg-gray-100 animate-pulse" />
                                ))}
                            </div>
                        ) : dadosZapSign ? (
                            <div className="flex flex-wrap gap-1.5">
                                {dadosZapSign.signers?.map((signer) => {
                                    const t = signerTone[signer.status] ?? signerTone.pending;

                                    return (
                                        <span
                                            key={signer.email}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${t.bg} ${t.text} text-[9px] md:text-sm font-semibold`}
                                        >
                                            {t.icon}
                                            {signer.name}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400">Não foi possível carregar as informações da assinatura.</p>
                        )}

                        <section className="flex flex-wrap items-center gap-1.5 text-[9px] md:text-[11px]">

                            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${tone.pill}  font-semibold uppercase tracking-wide first-letter:uppercase`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${tone.solid}`} />
                                {status}
                            </span>
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 font-semibold">
                                <SentIcon width={11} height={11} />
                                {formatDate(dados.data.split('T')[0])}
                            </span>
                        </section>


                        {/* Timeline início -> fim, com a duração no meio */}
                        <section className="bg-gray-50 rounded-2xl px-3 py-1 md:px-4 md:py-3.5">
                            <div className="flex items-center justify-between">

                                <div className="flex flex-col items-start">
                                    <p className="text-[9px] uppercase tracking-wide text-gray-400 font-semibold">Início</p>
                                    <p className="text-[14px] md:text-lg font-bold text-gray-800 leading-tight">{formatTime(dados.inicio)}</p>
                                    <p className="text-[10px] text-gray-400">{formatDate(dados.inicio.split('T')[0])}</p>
                                </div>

                                <div className="flex-1 flex flex-col items-center px-3">
                                    <span className={`text-[10px] font-bold ${tone.ink}`}>
                                        {totalHours(dados.inicio, dados.fim)}h
                                    </span>
                                    <div className="w-full flex items-center gap-1 mt-1">
                                        <span className={`w-2 h-2 rounded-full ${tone.solid}`} />
                                        <span className="flex-1 border-t-2 border-dashed border-gray-300" />
                                        <ArrowRight width={13} height={13} className="text-gray-300 shrink-0" />
                                        <span className="flex-1 border-t-2 border-dashed border-gray-300" />
                                        <span className={`w-2 h-2 rounded-full ${tone.solid}`} />
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <p className="text-[9px] uppercase tracking-wide text-gray-400 font-semibold">Fim</p>
                                    <p className="md:text-lg font-bold text-gray-800 leading-tight">{formatTime(dados.fim)}</p>
                                    <p className="text-[10px] text-gray-400">{formatDate(dados.fim.split('T')[0])}</p>
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center gap-0.5 bg-gray-50 rounded-xl py-1 md:py-2.5">
                                <p className="text-[9px] uppercase tracking-wide text-gray-400 font-semibold">Turno</p>
                                <p className="text-[0.8em] md:text-[0.9rem] text-gray-700 font-bold">{dados.turno}</p>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 bg-gray-50 rounded-xl py-1 md:py-2.5">
                                <p className="text-[9px] uppercase tracking-wide text-gray-400 font-semibold">Total</p>
                                <p className="text-[0.8em] md:text-[0.9rem] text-gray-700 font-bold">
                                    {totalHours(dados.inicio, dados.fim)}h
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 bg-gray-50 rounded-xl py-1 md:py-2.5">
                                <p className="text-[9px] uppercase tracking-wide text-gray-400 font-semibold">Acumulado</p>
                                <p className="text-[0.8em] md:text-[0.9rem] text-gray-700 font-bold">
                                    {totalAccHours(dados.inicio, dados.fim, dados.funcionarios.length)}h
                                </p>
                            </div>
                        </section>

                        <div className="relative">
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-1.5">
                                Motivo Detalhado
                            </p>

                            <div className="relative">
                                <p className="text-[0.75em] md:text-[0.9rem] p-3 rounded-xl bg-gray-50 text-gray-600 max-h-30 overflow-y-auto md:h-max">
                                    {dados.motivoDetalhado}
                                </p>

                            </div>
                        </div>

                        <div>
                            <button
                                className="font-semibold flex gap-1.5 items-center text-gray-700"
                                onClick={() => { setOpenLista(!openLista) }}
                            >
                                Lista de Pessoas
                                <span className="text-[0.75em] font-semibold md:text-[0.9rem] text-gray-400">({dados.funcionarios.length})</span>
                                <OpenIcon className={`text-gray-400 ${openLista ? 'animate-open-list rotate-180' : 'animate-close-list rotate-0 '}`} width={12} height={12} />
                            </button>

                            {openLista && (
                                <section className="animate-list-in flex md:grid md:grid-cols-2 lg:grid-cols-3 md:auto-rows-max flex-col md:h-50 h-40 overflow-auto gap-2 pt-3">
                                    {dados.funcionarios.map((pessoa) => (
                                        <nav key={pessoa.id} className="pl-2 bg-gray-50 p-2 rounded-[15px] border border-gray-100">
                                            <div className="flex items-center justify-between gap-1">
                                                <p className="text-sm font-semibold text-gray-700">{pessoa.funcionario.name}</p>
                                                <p className="text-[0.6em] font-semibold text-gray-400">{pessoa.funcionario.re}</p>
                                            </div>
                                            <p className="text-[0.6em] text-gray-400">{pessoa.maquina.maquina}</p>
                                        </nav>
                                    ))}
                                </section>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center pt-2 pb-2 md:pt-3 md:pb-4">
                        <button
                            onClick={closeInfo}
                            className={`px-8 py-2.5 rounded-full bg-white ${tone.ink} text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity`}
                        >
                            Fechar
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}