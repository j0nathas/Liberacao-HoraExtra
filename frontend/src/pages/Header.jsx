import { useAuth } from '../context/AuthContext'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api';


//ICONES
import HomeIcon from '../../img/home.svg?react'
import FormIcon from '../../img/form.svg?react'
import MenuIcon from '../../img/menu.svg?react'
import CloseIcon from '../../img/close.svg?react'
import ProfileIcon from '../../img/profile.svg?react'
import ClockIcon from '../../img/clock.svg?react'
import LogoutIcon from '../../img/logout.svg?react'
import ConfigIcon from '../../img/config.svg?react'
import SentIcon from '../../img/sent-date.svg?react'

import ByeIcon from '../../img/bye.svg?react'
import toast, { Toaster } from 'react-hot-toast';


const btnMenu = [
    { name: "Home", path: "/home", icon: HomeIcon },
    { name: "Form", path: "/form", icon: FormIcon },
    { name: "Enviados", path: "/sent", icon: SentIcon },
];


export default function Header() {
    const [hamburguer, setHamburguer] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();
    const [profileOpen, setProfileOpen] = useState(false);
    const initials = `${user.nome[0]}${user.sobrenome[0]}`;


    const logout = async (e) => {
        try {
            const nome = user.nome;
            await api.post("/auth/logout");
            navigate("/login");
            toast.custom(() => (
                <div className='bg-white p-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl'>
                    <img className="animate-bye text-yellow-600 text-8xl " width={35} height={35} src="../img/bye.png" alt="" />
                    <nav className='flex flex-col border-l-2 pl-3 border-gray-200'>
                        <p className='text-[1rem] font-normal text-gray-700'>Tchau, {user.nome}!</p>
                        <p className='text-[0.8rem] font-normal text-gray-500'>Nos vemos em breve.</p>
                    </nav>
                </div>
            ));

        }
        catch (err) {
            console.log(err);
        }

    }

    const btnSettings = [
        { name: "Configurações", icon: ConfigIcon, function: null },
        { name: "Sair", icon: LogoutIcon, function: logout },
    ]


    return (
        <>
            <header className='w-full flex items-center justify-between p-4 shadow-sm bg-white relative'>

                <div className='flex lg:hidden items-center gap-2 text-sm'>
                    <button onClick={() => setHamburguer(!hamburguer)} className={`bg-gray-100 shadow-2xs rounded-sm p-2 cursor-pointer transition-all active:bg-blue-300 ${hamburguer ? 'text-red-400 bg-red-200' : 'text-black'}`}>
                        {hamburguer ? <CloseIcon width={28} height={28} /> : <MenuIcon width={28} height={28} />}
                    </button>
                </div>



                {hamburguer && (
                    <div className='absolute top-full z-10 left-0 flex-col justify-center items-center w-5/12 md:w-3/12 lg:w-2/12 bg-white rounded-b-lg gap-5 overflow-hidden shadow-xl'>
                        {btnMenu.map((btn) => (
                            <button key={btn.path} onClick={() => { navigate(btn.path); setHamburguer(false) }} className={`${location.pathname === btn.path ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-100 active:text-blue-500'}
                            flex items-center gap-2  w-full border-b-1 p-2  border-gray-200 transition `}
                                disabled={location.pathname === btn.path ? true : false}
                            >
                                {<btn.icon width={35} height={35} />}{btn.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className='bg-blue-50 p-2 rounded-full'><ClockIcon width={45} height={45} /></div>

                <nav className="hidden lg:flex items-center gap-2">
                    {btnMenu.map((btn) => (
                        <button
                            key={btn.path}
                            onClick={() => navigate(btn.path)}
                            className={`flex w-30 gap-2 items-center justify-center rounded-lg p-2 transition cursor-pointer
                ${location.pathname === btn.path
                                    ? " text-blue-600 bg-blue-50 font-semibold"
                                    : "text-gray-500 hover:text-gray-600"
                                }`}
                        >
                            {<btn.icon width={20} height={20} />}
                            <span>{btn.name}</span>
                        </button>
                    ))}
                </nav>

                <section className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className={`w-12 h-12 rounded-full  flex justify-center items-center  text-[1.3rem] cursor-pointer transition-all hover:bg-blue-100
                    ${profileOpen ? 'bg-blue-200 text-blue-400' : 'bg-gray-200 text-gray-400'}`}>
                        <p>{user.nome[0]}{user.sobrenome[0]}</p>
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl bg-white border border-[#E4E8F1] shadow-[0_12px_32px_rgba(27,35,64,0.14)] overflow-hidden z-50 animate-cascata-profile">
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E4E8F1]">
                                <div className="w-9 h-9 rounded-full bg-[#E6F1FB] text-[#185FA5] flex items-center justify-center text-[0.78rem] font-semibold shrink-0">
                                    {initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[0.85rem] font-medium text-[#1B2340] truncate">{user.nome} {user.sobrenome}</p>
                                    <p className="text-[0.6rem] text-gray-400 font-light">{user.email}</p>
                                </div>
                            </div>

                            <div className="py-1.5">
                                {btnSettings.map((btn) => {
                                    const Icon = btn.icon;
                                    return (
                                        <button
                                            key={btn.name}
                                            onClick={btn.function}
                                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[0.85rem] transition-colors cursor-pointer
                                                    ${btn.name === 'Sair'
                                                    ? 'text-[#A32D2D] hover:bg-[#FCEBEB]'
                                                    : 'text-[#1B2340] hover:bg-[#F4F6FB]'}`}
                                        >
                                            <Icon width={18} height={18} />
                                            {btn.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}


                </section>



            </header>

        </>
    )
}