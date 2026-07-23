import ClockIcon from '../../../../img/clock-card.svg?react'

export default function Header() {
    return (
        <>
            <div className="w-full grid grid-cols-3 gap-10 px-7 py-2 shadow-2xl">
                <button className='font-bold text-blue-500'>Todas</button>
                <button className='text-gray-400 font-light'>Enviadas</button>
                <button className='text-gray-400 font-light'>Aprovadas</button>
            </div>
        </>
    )
}