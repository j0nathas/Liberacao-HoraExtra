import { useAuth } from '../context/AuthContext'
import { useNavigate, Navigate } from 'react-router-dom'
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

import ByeIcon from '../../img/bye.svg?react'
import toast, { Toaster } from 'react-hot-toast';


const btnMenu = [
    { name: "Home", path: "/home", icon: <HomeIcon width={35} height={35} /> },
    { name: "Form", path: "/form", icon: <FormIcon width={35} height={35} /> },
    { name: "Document", path: "/document", icon: <FormIcon width={35} height={35} /> },
    /* { name: Chart, path: "/Chart", icon: "", element: Chart } */
]





export default function Header() {
    const [hamburguer, setHamburguer] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        toast.success(`Bem vindo de volta, ${user.nome}!`, {
            id: "welcome-toast",
        });
    }, [user.nome]);


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
        { name: "Config", icon: ConfigIcon, function: null },
        { name: "Logout", icon: LogoutIcon, function: logout },
    ]


    return (
        <>
            <header className='w-full flex items-center justify-between p-4 shadow-sm bg-white relative'>

                <div className='flex items-center gap-2 text-sm'>
                    <button onClick={() => setHamburguer(!hamburguer)} className={`bg-gray-100 shadow-2xs rounded-sm p-2 cursor-pointer transition-all active:bg-blue-300 ${hamburguer ? 'text-red-400 bg-red-200' : 'text-black'}`}>
                        {hamburguer ? <CloseIcon width={28} height={28} /> : <MenuIcon width={28} height={28} />}
                    </button>
                </div>

                {hamburguer && (
                    <div className='absolute top-full z-10 left-0 flex-col justify-center items-center w-5/12 md:w-3/12 lg:w-2/12 bg-white rounded-b-lg gap-5 overflow-hidden shadow-xl'>
                        {btnMenu.map((btn) => (
                            <button key={btn.path} onClick={() => { navigate(btn.path); setHamburguer(false) }} className='flex items-center gap-2 bg-white w-full border-b-1 p-2 text-gray-500 border-gray-200 transition hover:bg-gray-100 active:bg-blue-100 active:text-blue-500'>
                                {btn.icon}{btn.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className='bg-blue-50 p-2 rounded-full'><ClockIcon width={45} height={45} /></div>

                <section className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className={`w-12 h-12 rounded-full  flex justify-center items-center  text-[1.3rem] cursor-pointer transition-all hover:bg-blue-100
                    ${profileOpen ? 'bg-blue-200 text-blue-400' : 'bg-gray-200 text-gray-400'}`}>
                        <p>{user.nome[0]}{user.sobrenome[0]}</p>
                    </button>

                    {
                        profileOpen && (
                            <>
                                <p className='absolute left-[-110%] hidden translate-y-[-50%] translate-x-[-60%] top-6/12 w-max animate-name-profile font-light md:block lg:block'>{user.nome} {user.sobrenome}</p>
                                <div className="absolute top-14 flex flex-col items-center gap-2 z-50 animate-cascata-profile">
                                    {btnSettings.map((btn) => {
                                        const Icon = btn.icon;

                                        return (
                                            <button
                                                key={btn.name}
                                                onClick={btn.function}
                                                className="w-12 h-12 flex items-center justify-center rounded-full transition-all bg-white text-gray-600 shadow-[0px_0px_10px_0px_#d4d4d4a3] cursor-pointer hover:translate-y-[-3px] active:bg-gray-100 active:text-gray-700"
                                            >
                                                <Icon width={28} height={28} />
                                            </button>
                                        );
                                    })}

                                </div>
                            </>

                        )
                    }


                </section>



            </header>

        </>
    )
}