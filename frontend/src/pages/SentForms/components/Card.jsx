import { getISOWeek, formatDate } from '../Utils/SentUtils'
import SentIcon from '../../../../img/sent-date.svg?react'
import { CircleCheckBig, Clock, CircleSlash, CircleX } from 'lucide-react';


export default function Card({ dados, openInfo }) {
    const status = dados.status === "pending" ? "pendente" : dados.status === "signed" ? "aprovado" : dados.status === "recusado" ? "recusado" : "Não Enviado";
    const tone = {
        pendente: {
            frame: "bg-amber-100",
            ink: "text-amber-700",
            pill: "bg-amber-50 text-amber-700",
            icon: <Clock width={15} height={15} />,
        },
        aprovado: {
            frame: "bg-emerald-100",
            ink: "text-emerald-700",
            pill: "bg-emerald-50 text-emerald-700",
            icon: <CircleCheckBig width={15} height={15} />,
        },
        "Não Enviado": {
            frame: "bg-slate-100",
            ink: "text-slate-600",
            pill: "bg-slate-50 text-slate-600",
            icon: <CircleSlash width={15} height={15} />,
        },
        recusado: {
            frame: "bg-red-100",
            ink: "text-red-600",
            pill: "bg-red-50 text-red-600",
            icon: <CircleX width={15} height={15} />,
        },
    }[status];

    return (
        <nav onClick={() => openInfo(dados)} className={`w-full drop-shadow-sm cursor-pointer flex flex-col rounded-[22px] p-1.5 ${tone.frame} transition-transform hover:-translate-y-0.5`}>
            <div className="bg-white rounded-[17px] p-4 flex flex-col gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">

                <section className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className={`flex items-center justify-center w-max p-2 h-6 rounded-full ${tone.pill}`}>
                            {tone.icon}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">#{dados.id}</span>
                    </div>
                </section>

                <div>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">
                        Semana {
                            [...new Set(
                                dados.solicitacoes.map(solicitacao =>
                                    getISOWeek(solicitacao.inicio)
                                )
                            )].join(', ')
                        }
                    </h3>
                    <div>

                        <div className='flex items-center gap-1'>
                            {dados.solicitacoes.map((solicitacao) => (
                                <p key={solicitacao.id} className="text-sm text-gray-500">
                                    {solicitacao.motivoMacro}
                                </p>
                            ))}

                            <span className={`px-1 py-1 rounded-lg ${tone.pill} text-[8px] font-semibold uppercase tracking-wide first-letter:uppercase`}>
                                {status}
                            </span>
                        </div>

                    </div>

                </div>

                <section className="flex flex-wrap gap-1.5">
                    {/* <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-semibold uppercase tracking-wide">
                        {dados.turno}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-semibold uppercase tracking-wide">
                        {dados.departamento.departamento}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-semibold uppercase tracking-wide">
                        {totalAccHours(dados.inicio, dados.fim, dados.funcionarios.length)}h
                    </span> */}
                </section>
            </div>

            <div className="flex items-center justify-between px-3 py-2">
                <div className={`flex items-center gap-1 ${tone.ink}`}>
                    <SentIcon width={12} height={12} />
                    <span className="text-[11px] font-medium">{formatDate(dados.data.split('T')[0])}</span>
                </div>
                <button
                    className={`text-[11px] font-bold uppercase tracking-wide ${tone.ink} hover:opacity-70 transition-opacity cursor-pointer`}
                    onClick={() => openInfo(dados)}
                >
                    Clique para Visualizar →
                </button>
            </div>
        </nav>
    )
}