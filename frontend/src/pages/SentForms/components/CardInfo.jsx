import { motion, AnimatePresence } from "framer-motion";
import SentIcon from '../../../../img/sent-date.svg?react'
import StartFlagIcon from '../../../../img/start-flag.svg?react'
import NextIcon from '../../../../img/next.svg?react'
import OpenIcon from '../../../../img/open.svg?react'
import { useState } from "react";


export default function CardInfo({ closeInfo }) {

    const [openLista, setOpenLista] = useState(false);
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-end bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeInfo}
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full rounded-t-3xl bg-white shadow-2xl"
                    initial={{ y: "120%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 35,
                    }}
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
                    <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing relative">
                        <div className="h-1.5 w-14 rounded-full bg-gray-300" />
                    </div>

                    <div className="flex flex-col px-6 pb-5 w-full gap-5">

                        <div className="grid auto-rows-max gap-2 grid-cols-[70%_30%] w-full text-gray-600">
                            <div className="flex flex-col border-l-3 border-amber-300 pl-2 bg-linear-to-l to-amber-50 from-45%">
                                <h2 className="text-xl font-semibold italic">ID 34</h2>
                                <p className="text-sm">Falta de Componente - Comprado</p>
                                <p className="text-[0.7em] font-semibold text-amber-500">Montagem de Lanternas</p>
                            </div>
                            <div className="w-full flex flex-col items-end justify-center gap-1">
                                <div className={`flex items-center justify-center gap-1 bg-amber-100 py-2 rounded-2xl w-25`}>
                                    <article className="w-2 h-2 bg-amber-300 rounded-full"></article>
                                    <p className="text-sm text-amber-700">Pendente</p>
                                </div>

                                <div className='flex items-center justify-center gap-1 text-gray-300 italic w-25'>
                                    <SentIcon width={15} height={15} />
                                    <p className='text-[11px]'>02/06/2026</p>
                                </div>

                            </div>
                        </div>


                        <div className="grid grid-cols-4 bg-gray-100 p-3 rounded-2xl gap-2">

                            <div className="flex flex-col items-center">
                                <p className="text-gray-400 text-[0.8em]">Dia</p>
                                <p className="text-[0.8em] text-gray-600 font-semibold">26/10/2026</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-gray-400 text-[0.8em]">Turno</p>
                                <p className="text-[0.8em] text-gray-600 font-semibold">1º Turno</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-gray-400 text-[0.8em]">Total</p>
                                <p className="text-[0.8em] text-gray-600 font-semibold">10h</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-gray-400 text-[0.8em]">Acumulado</p>
                                <p className="text-[0.8em] text-gray-600 font-semibold">30h</p>
                            </div>

                        </div>

                        <div>
                            <p className="font-semibold">Motivo Detalhado</p>
                            <p className="text-[0.75em] p-2 rounded-2xl bg-gray-100 h-max">A implementação de um sistema de solicitação de horas extras proporciona maior controle, transparência e agilidade no processo de aprovação.
                                Com ele, gestores podem analisar solicitações de forma organizada, enquanto os setores envolvidos recebem as informações necessárias em tempo real.
                            </p>
                        </div>

                        <div>
                            <button className="font-semibold flex gap-2 items-center"
                                onClick={() => { setOpenLista(!openLista) }}
                            >
                                Lista de Pessoas
                                <OpenIcon className={`text-gray-500 ${openLista ? 'animate-open-list rotate-180' : 'animate-close-list rotate-0 '}`} width={12} height={12} />
                            </button>

                            {openLista && (
                                <section className="animate-list-in flex flex-col h-40 overflow-auto gap-2 bg-gray-100 p-3 rounded-2xl">
                                    <nav className="border-l-4 border-gray-400 pl-2 bg-white p-2 rounded-sm shadow-2xs">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="text-sm font-semibold">FELIPE LIMA</p>
                                            <p className="text-[0.6em] font-semibold opacity-40">1835</p>
                                        </div>
                                        <p className="text-[0.6em] text-gray-500">J.I07-H1K1000_INJETORA_HORIZ_1K_1000T</p>
                                    </nav>
                                    <nav className="border-l-4 border-gray-400 pl-2 bg-white p-2 rounded-sm shadow-2xs">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="text-sm font-semibold">FELIPE LIMA</p>
                                            <p className="text-[0.6em] font-semibold opacity-40">1835</p>
                                        </div>
                                        <p className="text-[0.6em] text-gray-500">J.I07-H1K1000_INJETORA_HORIZ_1K_1000T</p>
                                    </nav>
                                    <nav className="border-l-4 border-gray-400 pl-2 bg-white p-2 rounded-sm shadow-2xs">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="text-sm font-semibold">FELIPE LIMA</p>
                                            <p className="text-[0.6em] font-semibold opacity-40">1835</p>
                                        </div>
                                        <p className="text-[0.6em] text-gray-500">J.I07-H1K1000_INJETORA_HORIZ_1K_1000T</p>
                                    </nav>

                                </section>
                            )}
                        </div>

                        <button
                            onClick={closeInfo}
                            className="w-full rounded-xl bg-blue-600 py-3 text-white"
                        >
                            Fechar
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}