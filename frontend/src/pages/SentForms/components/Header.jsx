import ClockIcon from '../../../../img/clock-card.svg?react'

export default function Header() {
    return (
        <>
            <div className="flex justify-center gap-10 w-fulsticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
                <button className='font-bold text-blue-500'>Todas</button>
                <button className='text-gray-400 font-light'>Enviadas</button>
                <button className='text-gray-400 font-light'>Aprovadas</button>
            </div>
        </>
    )
}