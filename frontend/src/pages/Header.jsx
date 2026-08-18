import { useAuth } from '../context/AuthContext'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api';
import { DatabaseArrowDown, Database, Download, LoaderCircle, Calendar } from 'lucide-react';


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
    const [exportData, setExportData] = useState(false);
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

    const [exportActive, setExportActive] = useState(false);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");


    const exportarCSV = async () => {

        if (!dataInicio || !dataFim) {
            toast.error("Selecione a data inicial e final.");
            return;
        }

        setExportActive(true);

        try {

            const response = await api.get(
                "/query/exportar",
                {
                    params: {
                        inicio: dataInicio,
                        fim: dataFim
                    },
                    responseType: "blob"
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "text/csv;charset=utf-8"
                }
            );

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `solicitacoes_${dataInicio}_${dataFim}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setDataInicio("");
            setDataFim("");
            setExportData(false);
            toast.success("Dados exportados com sucesso!");

        } catch (error) {

            console.error(error);
            toast.error("Erro ao exportar solicitações.");

        } finally {
            setExportActive(false);
        }
    };

    const [periodo, setPeriodo] = useState({
        inicio: null,
        fim: null
    });

    useEffect(() => {
        async function carregarPeriodo() {

            try {

                const { data } = await api.get(
                    "/query/periodo"
                );

                setPeriodo({
                    inicio: data.dataMinima,
                    fim: data.dataMaxima
                });

            } catch (error) {
                console.error(
                    "Erro ao carregar período:",
                    error
                );
            }
        }

        carregarPeriodo();
    }, [exportData]);



    return (
        <>
            <header className='w-full grid grid-cols-3 p-4 shadow-sm bg-white relative'>

                <div className='flex lg:hidden items-center gap-2 text-sm'>
                    <button onClick={() => setHamburguer(!hamburguer)} className={`bg-gray-100 shadow-2xs rounded-sm p-2 cursor-pointer transition-all active:bg-blue-300 ${hamburguer ? 'text-red-400 bg-red-200' : 'text-black'}`}>
                        {hamburguer ? <CloseIcon width={28} height={28} /> : <MenuIcon width={28} height={28} />}
                    </button>
                </div>



                {hamburguer && (
                    <div
                        className="absolute top-[calc(100%+8px)] left-3 z-[100] w-64 md:w-72 bg-white rounded-2xl border border-gray-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] overflow-hidden animate-[menuOpen_0.18s_ease-out]">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Menu
                            </p>
                            <p className="text-sm font-semibold text-gray-700 mt-0.5">
                                Navegação
                            </p>
                        </div>

                        <div className="p-2">
                            {btnMenu.map((btn) => {
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
                                            ${ativo ? `bg-blue-50 text-blue-600 border-blue-100 cursor-default` : `bg-transparent text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900`}`}>
                                        <span
                                            className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 
                                                ${ativo ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600'}`}>
                                            <Icon width={19} height={19} strokeWidth={2} />
                                        </span>

                                        <span className="flex-1 text-left">
                                            {btn.name}
                                        </span>

                                        {ativo && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className='self-center justify-self-center lg:justify-self-start'> <img src="../../img/logo.png" width={50} alt="" /> </div>

                <nav className="hidden lg:flex justify-self-center items-center gap-2">
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

                <section className="relative flex items-center justify-end gap-2">

                    {user.permissions.includes("EXTRAIR_SOLICITACOES") && (
                        <>
                            <button
                                onClick={() => setExportData(true)}
                                className='flex items-center gap-2 p-2 h-max cursor-pointer bg-blue-400 text-white rounded-xl shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <DatabaseArrowDown className='w-5 h-5' />
                            </button>

                            {exportData && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.15s_ease-out]">
                                    <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-[modalIn_0.2s_ease-out]">

                                        {/* Overlay de loading */}
                                        {exportActive && (
                                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/90 backdrop-blur-sm">
                                                <LoaderCircle className="animate-spin text-blue-600" size={32} />
                                                <p className="text-sm font-medium text-slate-600">Gerando arquivo CSV...</p>
                                            </div>
                                        )}

                                        {/* Header com destaque de cor */}
                                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 pt-6 pb-8 text-white">
                                            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
                                                <Database size={22} />
                                            </div>
                                            <h2 className="text-lg font-bold">
                                                Exportar Dados
                                            </h2>
                                            <p className="text-xs text-blue-100 mt-0.5">
                                                Escolha o período e baixe em CSV
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-4 p-6 -mt-4">

                                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
                                                <div className={`relative rounded-xl transition-all duration-150 ${dataInicio ? 'bg-blue-50' : ''} focus-within:bg-blue-50`}>
                                                    <div className="flex items-center gap-3 px-3 py-3">
                                                        <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${dataInicio ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                            <Calendar size={16} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                                Data início
                                                            </span>
                                                            <input
                                                                type="date"
                                                                value={dataInicio}
                                                                min={periodo.inicio}
                                                                max={periodo.fim}
                                                                disabled={exportActive}
                                                                onChange={(e) => {
                                                                    setDataInicio(e.target.value);
                                                                    if (dataFim && e.target.value > dataFim) {
                                                                        setDataFim("");
                                                                    }
                                                                }}
                                                                className="w-full bg-transparent text-slate-800 text-sm font-semibold outline-none disabled:cursor-not-allowed p-0 border-0"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-px bg-slate-100 mx-3" />

                                                <div className={`relative rounded-xl transition-all duration-150 ${dataFim ? 'bg-blue-50' : ''} focus-within:bg-blue-50`}>
                                                    <div className="flex items-center gap-3 px-3 py-3">
                                                        <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${dataFim ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                            <Calendar size={16} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                                Data fim
                                                            </span>
                                                            <input
                                                                type="date"
                                                                value={dataFim}
                                                                min={dataInicio || periodo.inicio}
                                                                max={periodo.fim}
                                                                disabled={exportActive}
                                                                onChange={(e) => setDataFim(e.target.value)}
                                                                className="w-full bg-transparent text-slate-800 text-sm font-semibold outline-none disabled:cursor-not-allowed p-0 border-0"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {!dataInicio || !dataFim ? (
                                                <p className="text-xs text-slate-400 text-center">
                                                    Selecione as duas datas para continuar
                                                </p>
                                            ) : null}

                                            <div className="flex gap-3 mt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setExportData(false)}
                                                    disabled={exportActive}
                                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Cancelar
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={exportarCSV}
                                                    disabled={!dataInicio || !dataFim || exportActive}
                                                    className="flex-1 px-4 py-3 rounded-xl bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Download size={16} />
                                                    Baixar CSV
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </>
                    )}

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