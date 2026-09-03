import { motion, AnimatePresence } from "framer-motion";
import api from '../../../services/api.js'
import { useEffect, useState } from "react";
import { CircleCheckBig, Clock, CircleSlash, CircleX, X, ArrowRight, HardHat, Info, FileText, Trash2, Send, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { totalHours, formatDate } from "../Utils/SentUtils";
import Loading from "../../../components/Loading.jsx";

export default function CardInfo({ dados, closeInfo, carregarDados }) {
    const [activeSolicIndex, setActiveSolicIndex] = useState(0);
    const [activeJustIndex, setActiveJustIndex] = useState(0);
    const [dadosZapSign, setDadosZapSign] = useState(null);
    const [loadingSigners, setLoadingSigners] = useState(true);

    const solicitacoes = dados.solicitacoes || [];
    const solicitacao = solicitacoes[activeSolicIndex] || {};
    const justificativaAtiva = solicitacao.justificativas?.[activeJustIndex] || {};

    const status = dados.status === "pending" ? "pendente" : dados.status === "signed" ? "aprovado" : dados.status === "recusado" ? "recusado" : "Não Enviado";

    useEffect(() => {
        async function carregarInfoDocZapSign() {
            try {
                const response = await api.get(`/query/infoDocZapSign`, { params: { token: dados.token } });
                setDadosZapSign(response.data);
            } catch (error) { console.error("Erro ao consultar documento:", error); }
            finally { setLoadingSigners(false); }
        }
        if (dados.token) carregarInfoDocZapSign();
    }, [dados.token]);

    const handleSelectSolic = (index) => {
        setActiveSolicIndex(index);
        setActiveJustIndex(0);
    };

    const [DeletingState, setDeletingState] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            await api.delete(`/delete/deletarDoc`, { params: { token: dados.token } });
            toast.success("Documento deletado com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar documento:", error);
            toast.error("Erro ao deletar documento.");
        } finally {
            setLoadingDelete(false);
            closeInfo();
            carregarDados();
        }
        closeInfo();


    };

    const tone = {
        pendente: { frame: "bg-amber-100", ink: "text-amber-700", pill: "bg-amber-50 text-amber-700", solid: "bg-amber-500", icon: <Clock width={15} height={15} /> },
        aprovado: { frame: "bg-emerald-100", ink: "text-emerald-700", pill: "bg-emerald-50 text-emerald-700", solid: "bg-emerald-500", icon: <CircleCheckBig width={15} height={15} /> },
        recusado: { frame: "bg-red-100", ink: "text-red-600", pill: "bg-red-50 text-red-600", solid: "bg-red-400", icon: <CircleX width={15} height={15} /> },
        "Não Enviado": { frame: "bg-slate-100", ink: "text-slate-600", pill: "bg-slate-50 text-slate-600", solid: "bg-slate-400", icon: <CircleSlash width={15} height={15} /> },
    }[status];

    const signerTone = {
        pending: { bg: "bg-amber-50", text: "text-amber-700", icon: <Clock width={9} height={9} /> },
        signed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: <CircleCheckBig width={9} height={9} /> },
        rejeitou: { bg: "bg-red-50", text: "text-red-700", icon: <CircleX width={9} height={9} /> },
    };

    const formatTime = (isoString) => isoString?.split('T')[1]?.slice(0, 5) ?? '--:--';

    return (
        <AnimatePresence>
            <motion.div
                className={`fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closeInfo}
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full lg:w-[50%] max-h-[95vh] rounded-t-[32px] p-2 pb-0 ${tone.frame} shadow-2xl overflow-hidden flex flex-col`}
                    initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag="y"
                    dragDirectionLock
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.6}
                    onDragEnd={(event, info) => {
                        if (info.offset.y > 120 || info.velocity.y > 600) {
                            closeInfo();
                        }
                    }}
                >

                    {DeletingState && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                                            <Trash2 size={20} className="text-red-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Deletar documento</h2>
                                            <p className="text-xs text-slate-500">Deseja deletar esse documento?</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                        <p className="text-sm text-slate-500 mt-2">Ao confirmar, o documento será removido permanentemente e cancelado no ZapSign.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end p-4 bg-slate-50 border-t cursor-pointer border-slate-200">
                                    <button type="button" onClick={() => setDeletingState(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-100">
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { handleDelete(); }}
                                        className="px-5 py-2.5 rounded-xl bg-red-200 cursor-pointer text-red-700 font-semibold text-sm hover:bg-red-300 transition-all flex items-center gap-2"
                                    >
                                        <Trash2 size={16} /> Confirmar deleção
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {loadingDelete && <Loading />}

                    <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
                        <div className={`h-1.5 w-12 rounded-full ${tone.solid}`} />
                    </div>

                    <div className="bg-white rounded-t-[24px] flex-1 overflow-y-auto px-4 pt-6 pb-8 md:px-8">

                        <header className="flex justify-between items-start relative">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${tone.pill}`}>
                                        Doc #{dados.id}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        Criado por {dados.usuario}
                                    </span>
                                </div>
                            </div>

                            <button onClick={closeInfo} className="p-2 rounded-full bg-gray-50 cursor-pointer text-gray-400 hover:bg-gray-100">
                                <X size={20} />
                            </button>
                        </header>

                        {/* Seletor de solicitações */}
                        {solicitacoes.length > 1 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {solicitacoes.map((solic, index) => (
                                        <button
                                            key={solic.id ?? index}
                                            onClick={() => handleSelectSolic(index)}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-left ${activeSolicIndex === index
                                                ? `${tone.pill} shadow-md`
                                                : "bg-gray-50 border-transparent text-gray-400 cursor-pointer hover:bg-gray-100"
                                                }`}
                                        >
                                            {index + 1}.
                                            <span className="flex flex-col">
                                                <span className="text-xs font-bold whitespace-nowrap">{solic.motivoMacro}</span>
                                                <span className="text-[9px] opacity-70 whitespace-nowrap">{solic.tipoSolicitacao}</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            {loadingSigners ? (
                                <div className="flex gap-2"><div className="h-6 w-24 bg-gray-100 animate-pulse rounded-lg" /></div>
                            ) : (
                                <div className="flex flex-wrap gap-1.5">
                                    {dadosZapSign?.signers?.map((s) => {
                                        const t = signerTone[s.status] || signerTone.pending;
                                        return (
                                            <span key={s.email} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${t.bg} ${t.text} text-[10px] font-bold border border-current/10`}>
                                                {t.icon} {s.name}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <motion.div
                            key={activeSolicIndex}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 leading-tight mb-1">
                                {solicitacao.motivoMacro}
                            </h2>
                            <p className="text-xs font-semi-bold text-gray-400 uppercase tracking-widest mb-6">
                                {solicitacao.departamento} • {solicitacao.planta}
                            </p>

                            <section className="bg-gray-50 rounded-3xl p-5 mb-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="text-center md:text-left">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Início</p>
                                        <p className="text-xl font-black text-gray-800">{formatTime(solicitacao.inicio)}</p>
                                        <p className="text-[10px] font-medium text-gray-500">{formatDate(solicitacao.inicio?.split('T')[0])}</p>
                                    </div>

                                    <div className="flex-1 px-6 flex flex-col items-center">
                                        <span className={`text-xs font-black px-3 py-1 rounded-full mb-2 ${tone.pill}`}>
                                            {totalHours(solicitacao.inicio, solicitacao.fim)}h
                                        </span>
                                        <div className="w-full flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${tone.solid}`} />
                                            <div className="flex-1 h-[2px] border-t-2 border-dashed border-gray-300" />
                                            <ArrowRight size={16} className="text-gray-300" />
                                            <div className="flex-1 h-[2px] border-t-2 border-dashed border-gray-300" />
                                            <div className={`h-2 w-2 rounded-full ${tone.solid}`} />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">{solicitacao.turno}</p>
                                    </div>

                                    <div className="text-center md:text-right">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Término</p>
                                        <p className="text-xl font-black text-gray-800">{formatTime(solicitacao.fim)}</p>
                                        <p className="text-[10px] font-medium text-gray-500">{formatDate(solicitacao.fim?.split('T')[0])}</p>
                                    </div>
                                </div>
                            </section>

                            <div className="mb-4">
                                <p className="text-[10px] uppercase font-semibold text-gray-400 mb-3 ml-1 tracking-widest">Justificativas por Posto ({solicitacao.justificativas?.length})</p>
                                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {solicitacao.justificativas?.map((just, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveJustIndex(index)}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${activeJustIndex === index
                                                ? `${tone.pill} shadow-md`
                                                : "bg-gray-50 border-transparent text-gray-400 cursor-pointer hover:bg-gray-100"
                                                }`}
                                        >
                                            <span className="text-xs font-bold whitespace-nowrap">{just.maquina}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                key={`${activeSolicIndex}-${activeJustIndex}`}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <div className="bg-gray-50 rounded-2xl p-4 text-gray-700 shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-2 opacity-60 text-[10px] font-bold uppercase">
                                            <Info size={12} /> Justificativa
                                        </div>
                                        <p className="text-sm leading-relaxed font-medium">
                                            "{justificativaAtiva.justificativa}"
                                        </p>
                                    </div>
                                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${tone.solid}`} />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Colaboradores Alocados</p>
                                        <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded-md text-gray-500">
                                            {justificativaAtiva.funcionarios?.length} pessoas
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {justificativaAtiva.funcionarios?.map((pessoa, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-700">{pessoa.nome}</span>
                                                    <span className="text-[9px] text-gray-400 font-semibold uppercase">RE: {pessoa.RE}</span>
                                                </div>
                                                <div className={`w-1.5 h-1.5 rounded-full ${tone.solid} opacity-40`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    <div className="p-4 bg-white border-t border-gray-50 grid grid-cols-2">
                        <button
                            onClick={() => setDeletingState(true)}
                            className={`w-[50%] flex items-center justify-center gap-2 p-2 rounded-2xl text-red-600 font-extrabold cursor-pointer bg-red-100 text-[11px] uppercase tracking-[0.2em] hover:bg-red-200 transition-colors`}
                        >
                            <Trash2 />

                            <p className="hidden md:block">Deletar</p>
                        </button>
                        <button
                            onClick={closeInfo}
                            className={`w-[50%] self-end justify-self-end cursor-pointer py-4 rounded-2xl text-gray-500 bg-gray-100 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors`}
                        >
                            <p className="">
                                <span className="md:hidden">Fechar</span>
                                <span className="hidden md:inline">Fechar Detalhes</span>
                            </p>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence >
    );
}