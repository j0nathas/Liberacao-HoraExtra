import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import api from '../services/api';
import bye from '../../img/bye.png';
import logo from '../../img/logo.png';
import { X, Menu, Shredder, ClipboardPen, House, Sun, Moon, UtensilsCrossed } from 'lucide-react';
import { useTheme } from "../hooks/useTheme.js";


//ICONES
import LogoutIcon from '../../img/logout.svg?react'
import ConfigIcon from '../../img/config.svg?react'

import toast from 'react-hot-toast';

const btnMenu = [
    { name: "Home", path: "/home", icon: House },
    { name: "Form", path: "/form", icon: ClipboardPen },
    { name: "Enviados", path: "/sent", icon: Shredder },
    { name: "Refeições", path: "/refeicoes", icon: UtensilsCrossed, permission: "ENVIAR_EMAIL_RESTAURANTE" }
];


export default function Header() {
    const [hamburguer, setHamburguer] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const location = useLocation();
    const [profileOpen, setProfileOpen] = useState(false);
    const initials = `${user.nome[0]}${user.sobrenome[0]}`;
    const { theme, toggleTheme } = useTheme();


    const logout = async () => {
        try {
            await api.post("/auth/logout");

            toast.custom(() => (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl">
                    <img
                        className="animate-bye text-yellow-600 text-8xl"
                        width={35}
                        height={35}
                        src={bye}
                        alt=""
                    />

                    <nav className="flex flex-col border-l-2 pl-3 border-gray-200 dark:border-gray-600">
                        <p className="text-[1rem] font-normal text-gray-700 dark:text-gray-100">
                            Tchau, {user?.nome}!
                        </p>

                        <p className="text-[0.8rem] font-normal text-gray-500 dark:text-gray-400">
                            Nos vemos em breve.
                        </p>
                    </nav>
                </div>
            ));

            setUser(null);

            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    };

    const btnSettings = [
        { name: "Configurações", icon: ConfigIcon, function: null },
        { name: "Sair", icon: LogoutIcon, function: logout },
    ];

    const menusAutorizados = btnMenu.filter(
        btn => !btn.permission || user?.permissions?.includes(btn.permission)
    );

    return (
        <header className='w-full grid grid-cols-3 p-4 shadow-sm bg-white dark:bg-gray-800 dark:shadow-none dark:border-gray-700 relative transition-colors'>

            <div className='flex lg:hidden items-center gap-2 text-sm'>
                <button
                    onClick={() => setHamburguer(!hamburguer)}
                    className={`shadow-2xs rounded-sm p-2 cursor-pointer transition-all active:bg-blue-300 dark:active:bg-blue-500/40
                        ${hamburguer
                            ? 'text-red-400 bg-red-200 dark:bg-red-500/20 dark:text-red-300'
                            : 'text-black bg-gray-100 dark:text-gray-100 dark:bg-gray-700'}`}>
                    {hamburguer ? <X width={28} height={28} /> : <Menu width={28} height={28} />}
                </button>
            </div>



            {hamburguer && (
                <div
                    className="absolute top-[calc(100%+8px)] left-3 z-[100] w-64 md:w-72 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-[0_10px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.5)] overflow-hidden animate-[menuOpen_0.18s_ease-out]">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Menu
                        </p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">
                            Navegação
                        </p>
                    </div>

                    <div className="p-2">
                        {menusAutorizados.map((btn) => {
                            const ativo = location.pathname === btn.path;
                            const Icon = btn.icon;

                            return (
                                <button
                                    key={btn.path}
                                    type="button"
                                    onClick={() => {
                                        navigate(btn.path);
                                        setHamburguer(false);
                                    }}
                                    disabled={ativo}
                                    className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border
                                            ${ativo
                                            ? `bg-blue-50 text-blue-600 border-blue-100 cursor-default dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20`
                                            : `bg-transparent text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white`}`}>
                                    <span
                                        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 
                                                ${ativo
                                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300'
                                                : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-gray-600 dark:group-hover:text-gray-100'}`}>
                                        <Icon width={19} height={19} strokeWidth={2} />
                                    </span>

                                    <span className="flex-1 text-left">
                                        {btn.name}
                                    </span>

                                    {ativo && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className='self-center justify-self-center lg:justify-self-start'> <img src={logo} width={50} alt="" /> </div>

            <nav className="hidden lg:flex justify-self-center items-center gap-2">
                {menusAutorizados.map((btn) => (
                    <button
                        key={btn.path}
                        onClick={() => navigate(btn.path)}
                        className={`flex w-30 gap-2 items-center justify-center rounded-lg p-2 transition cursor-pointer
                ${location.pathname === btn.path
                                ? "text-blue-600 bg-blue-50 font-semibold dark:text-blue-300 dark:bg-blue-500/10"
                                : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                    >
                        {<btn.icon width={20} height={20} />}
                        <span>{btn.name}</span>
                    </button>
                ))}
            </nav>

            <section className="relative flex items-center justify-end gap-2">


                <button
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
                    title={theme === "dark" ? "Modo claro" : "Modo escuro"}
                    className={`
        relative inline-flex h-7 w-13 sm:h-8 sm:w-15 items-center rounded-full p-1
        cursor-pointer transition-colors duration-300 ease-in-out focus:outline-none
        dark:bg-slate-700 dark:hover:bg-slate-600 bg-sky-200 hover:bg-sky-300
    `}
                >
                    <span
                        className={`
            h-5 w-5 sm:h-6 sm:w-6 
            flex items-center justify-center rounded-full bg-white dark:bg-slate-400 shadow-md translate-x-0 text-amber-500
            transform transition-transform duration-300 ease-in-out dark:translate-x-6  dark:sm:translate-x-7 dark:text-purple-100
        `}
                    >
                        {theme === "dark" ? (
                            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300" />
                        ) : (
                            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300" />
                        )}
                    </span>
                </button>


                <button onClick={() => setProfileOpen(!profileOpen)} className={`w-12 h-12 rounded-full  flex justify-center items-center  text-[1.3rem] cursor-pointer transition-all hover:bg-blue-100 dark:hover:bg-blue-500/30
                    ${profileOpen
                        ? 'bg-slate-200 text-blue-400 dark:bg-blue-500/30 dark:text-blue-200'
                        : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-300'}`}>
                    <p>{user.nome[0]}{user.sobrenome[0]}</p>
                </button>

                {profileOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl bg-white dark:bg-gray-800 border border-[#E4E8F1] dark:border-gray-700 shadow-[0_12px_32px_rgba(27,35,64,0.14)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-cascata-profile">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E4E8F1] dark:border-gray-700">
                            <div className="w-9 h-9 rounded-full bg-[#E6F1FB] text-[#185FA5] dark:bg-blue-500/20 dark:text-blue-300 flex items-center justify-center text-[0.78rem] font-semibold shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[0.85rem] font-medium text-[#1B2340] dark:text-gray-100 truncate">{user.nome} {user.sobrenome}</p>
                                <p className="text-[0.6rem] text-gray-400 dark:text-gray-500 font-light">{user.email}</p>
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
                                                ? 'text-[#A32D2D] hover:bg-[#FCEBEB] dark:text-red-400 dark:hover:bg-red-500/10'
                                                : 'text-[#1B2340] hover:bg-[#F4F6FB] dark:text-gray-200 dark:hover:bg-gray-700'}`}
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
    )
}