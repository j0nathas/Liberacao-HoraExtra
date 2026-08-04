import { useState } from 'react'
import SentIcon from '../../../../img/sent-date.svg?react'

function getISOWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    // Ajusta para a quinta-feira da semana atual
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));

    // Primeira quinta-feira do ano
    const firstThursday = new Date(d.getFullYear(), 0, 4);
    firstThursday.setDate(
        firstThursday.getDate() +
        3 -
        ((firstThursday.getDay() + 6) % 7)
    );

    return (
        1 +
        Math.round((d - firstThursday) / (7 * 24 * 60 * 60 * 1000))
    );
}

export default function Card({ dados, openInfo }) {
    const [viewCard, setViewCard] = useState(false);
    const status = dados.status === "pending" ? "pendente" : dados.status === "signed" ? "aprovado" : "Não Enviado";

    return (
        <>

            <div className="flex flex-col relative bg-white shadow-[0px_0px_5px_0px_#ccc] p-4 rounded-xl gap-4 mt-2 overflow-hidden">
                <p className={`absolute top-[0%] left-[0%] px-[0.65rem] py-1 text-sm rounded-br-3xl font-bold
                    ${status === "pendente" ? "bg-amber-200 text-amber-600" : status === "aprovado" ? "bg-green-200 text-green-600" : "bg-gray-200"}`}>{dados.id}</p>


                <section className="flex justify-between items-center relative">


                    <div className="relative mt-3">
                        <p>Semana {getISOWeek(dados.inicio)}</p>
                        <p className="text-[11px] text-gray-400">{dados.motivosMacro.descricao}</p>
                        <p className={`text-[10px] font-semibold ${status === "pendente" ? "text-amber-500" : status === "aprovado" ? "text-green-500" : "text-gray-500"}`}>{dados.departamento}</p>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <div className={`flex items-center px-3 py-1 gap-2 text-sm  rounded-3xl  
                            ${status === "pendente" ? "bg-amber-100 text-amber-600" : status === "aprovado" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>

                            <p className='font-semibold first-letter:uppercase'>{status}</p>
                            <article className={`w-3 h-3 rounded-full bg-amber-300 ${status === "pendente" ? 'bg-amber-300' : status === "aprovado" ? 'bg-green-300' : 'bg-gray-300'}`}></article>

                        </div>

                        <div className='flex items-center justify-center gap-1 text-gray-300 italic'>
                            <SentIcon width={15} height={15} />
                            <p className='text-[10px]'>{dados.data.split('T')[0]}</p>
                        </div>
                    </div>

                </section>


                <section className="grid grid-cols-3 w-full justify-center items-center text-center text-sm rounded-3xl bg-gray-50 text-gray-400">

                    <p className=" py-2 px-4 border-r-3 font-semibold border-white">{dados.inicio.split('T')[0]}</p>

                    <p className=" py-2 px-4 border-r-3 font-semibold border-white">{dados.turno}</p>

                    <p className=" py-2 px-4 font-semibold">30h</p>


                </section>

                <button className="w-[50%] self-center bg-linear-to-r transition-all from-blue-500 to-[#7aadff] rounded-sm text-white shadow-[0_0_10px_1px] shadow-blue-200 font-semibold py-2 cursor-pointer"
                    onClick={() => openInfo(dados)}
                >Visualizar</button>

            </div>
        </>
    )
}