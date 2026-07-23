import { useState } from 'react'
import SentIcon from '../../../../img/sent-date.svg?react'



export default function Card({ status, openInfo }) {
    const [viewCard, setViewCard] = useState(false);


    return (
        <>

            <div className="flex flex-col relative bg-white h-max shadow-2xl p-4 rounded-2xl gap-4 mt-2">

                <section className="flex justify-between items-center relative">


                    <div className="">
                        <p>#ID 34</p>
                        <p className="text-[11px] text-gray-400">Falta de Componente - Comprado</p>
                        <p className={`text-[10px]  ${status ? "text-amber-300" : "text-green-300"}`}>Montagem de Lanternas</p>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <div className={`flex items-center px-3 py-1 gap-2 text-sm  rounded-3xl  
                            ${status ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>

                            <p className='font-semibold'>{status ? "Pendente" : "Aprovado"}</p>
                            <article className={`w-3 h-3 rounded-full bg-amber-300 ${status ? 'bg-amber-300' : 'bg-green-300'}`}></article>

                        </div>

                        <div className='flex items-center justify-center gap-1 text-gray-300 italic'>
                            <SentIcon width={15} height={15} />
                            <p className='text-[10px]'>02/06/2026</p>
                        </div>
                    </div>

                </section>


                <section className="grid grid-cols-3 w-full justify-center items-center text-center text-sm rounded-3xl bg-gray-50 text-gray-400">

                    <p className=" py-2 px-4 border-r-3 font-semibold border-white">06/07/2026</p>

                    <p className=" py-2 px-4 border-r-3 font-semibold border-white">1º Turno</p>

                    <p className=" py-2 px-4 font-semibold">30h</p>


                </section>

                <button className="w-[50%] self-center bg-linear-to-r from-blue-500 to-[#7aadff] rounded-2xl text-white shadow-[0_0_10px_1px] shadow-blue-200 font-semibold py-2"
                    onClick={openInfo}
                >Visualizar</button>

            </div>
        </>
    )
}