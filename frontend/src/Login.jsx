import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './services/api';
import { EyeOff, Eye, Loader2, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from "./context/AuthContext";
import toast from 'react-hot-toast';
import logo from '../img/logo.png';

/* Ilustração abstrata do painel lateral (somente desktop):
   alguém digita -> linha tracejada -> documento -> ZapSign -> aprovação pendente */
function FluxoIlustracao() {
    return (
        <svg viewBox="0 0 440 600" className="w-full max-w-md max-h-[62vh]" role="img"
            aria-label="Ilustração: uma pessoa digita no computador e a solicitação segue por documento e ZapSign até a aprovação pendente">
            <style>{`
                @media (prefers-reduced-motion: no-preference) {
                    .fx-dash { animation: fxFlow 1.6s linear infinite; }
                    .fx-hand-l { animation: fxType 0.5s ease-in-out infinite; }
                    .fx-hand-r { animation: fxType 0.5s ease-in-out 0.25s infinite; }
                    .fx-cursor { animation: fxBlink 1s steps(1) infinite; }
                    .fx-pulse { transform-box: fill-box; transform-origin: center; animation: fxPulse 2s ease-out infinite; }
                }
                @keyframes fxFlow { to { stroke-dashoffset: -28; } }
                @keyframes fxType { 50% { transform: translateY(4px); } }
                @keyframes fxBlink { 50% { opacity: 0; } }
                @keyframes fxPulse { from { transform: scale(1); opacity: .7; } to { transform: scale(1.7); opacity: 0; } }
            `}</style>

            {/* formas abstratas de fundo */}
            <circle cx="60" cy="90" r="46" fill="#fff" opacity="0.08" />
            <circle cx="380" cy="250" r="64" fill="#fff" opacity="0.07" />
            <circle cx="50" cy="470" r="38" fill="#fff" opacity="0.07" />

            {/* trilha: computador -> documento -> ZapSign (concluída) */}
            <path d="M220 185 C220 240 110 240 110 300 C110 360 330 350 330 410"
                fill="none" stroke="#86efac" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 12" className="fx-dash" />
            {/* trilha final: ZapSign -> aprovação (pendente) */}
            <path d="M330 410 C330 470 220 470 220 520"
                fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 12" className="fx-dash" />

            {/* bolinhas de progresso */}
            <circle cx="165" cy="241" r="6" fill="#22c55e" />
            <circle cx="220" cy="355" r="6" fill="#22c55e" />
            <circle cx="275" cy="469" r="6" fill="#fff" opacity="0.85" />

            {/* computador */}
            <rect x="120" y="40" width="200" height="112" rx="14" fill="#fff" />
            <rect x="130" y="50" width="180" height="92" rx="8" fill="#e0f2fe" />
            <rect x="144" y="66" width="96" height="8" rx="4" fill="#3b82f6" />
            <rect x="144" y="84" width="130" height="8" rx="4" fill="#93c5fd" />
            <rect x="144" y="102" width="70" height="8" rx="4" fill="#93c5fd" />
            <rect x="218" y="100" width="4" height="12" rx="2" fill="#1d4ed8" className="fx-cursor" />
            <path d="M92 158 H348 L334 178 H106 Z" fill="#bfdbfe" />
            <rect x="196" y="160" width="48" height="5" rx="2.5" fill="#93c5fd" />

            {/* mãos digitando (abstratas) */}
            <g className="fx-hand-l"><rect x="150" y="166" width="46" height="22" rx="11" fill="#fed7aa" /></g>
            <g className="fx-hand-r"><rect x="244" y="166" width="46" height="22" rx="11" fill="#fed7aa" /></g>

            {/* nó 1: documento */}
            <g transform="translate(110 300)">
                <circle r="34" fill="#22c55e" opacity="0.25" />
                <circle r="28" fill="#22c55e" />
                <path d="M-9 -12 H3 L10 -5 V12 H-9 Z" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
                <path d="M-4 1 H5 M-4 6 H3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </g>
            <text x="156" y="296" fill="#fff" fontSize="16" fontWeight="bold">PDF gerado</text>
            <text x="156" y="316" fill="#fff" fillOpacity="0.8" fontSize="13">Automaticamente</text>

            {/* nó 2: ZapSign */}
            <g transform="translate(330 410)">
                <circle r="34" fill="#22c55e" opacity="0.25" />
                <circle r="28" fill="#22c55e" />
                <path d="M3 -14 L-9 3 H-1 L-3 14 L9 -3 H1 Z" fill="#fff" />
            </g>
            <text x="286" y="406" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="end">ZapSign</text>
            <text x="286" y="426" fill="#fff" fillOpacity="0.8" fontSize="13" textAnchor="end">Fluxo já configurado</text>

            {/* nó 3: aprovação pendente */}
            <g transform="translate(220 520)">
                <circle r="28" fill="#fccc9a" opacity="0.7" className="fx-pulse" />
                <circle r="28" fill="#ffead4" stroke="#f7ac5e" strokeWidth="3" />
                <circle r="11" fill="none" stroke="#f7ac5e" strokeWidth="2.2" />
                <path d="M0 -5 V0 L4 3" fill="none" stroke="#f7ac5e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="220" y="573" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">Aprovação pendente</text>
        </svg>
    );
}

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loadUser } = useAuth();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/auth/login", { username, password });

            const usuario = await loadUser();

            toast.success(`Bem vindo de volta, ${usuario.nome}!`);
            navigate("/home");
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Usuário ou senha incorretos no AD Magna.");
            } else if (
                err.response?.status === 403 &&
                err.response?.data === "USER_NOT_REGISTERED"
            ) {
                setError("Usuário cadastrado no AD Magna, porém sem acesso ao sistema. Contate o ADM.");
            } else {
                setError("Não foi possível conectar ao servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    const inputBase =
        "w-full rounded-2xl bg-slate-100 border border-transparent text-slate-800 placeholder:text-slate-400 " +
        "py-4 pl-12 text-base transition-all focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 " +
        "md:py-[18px] lg:bg-slate-50 lg:border-slate-200";

    return (
        <main
            className="
                min-h-screen w-full flex font-sans
                bg-slate-100
                md:bg-radial-[at_50%_75%] md:from-sky-400 md:via-blue-400 md:to-indigo-900
                lg:bg-none lg:bg-white
            "
        >
            {/* ============ COLUNA DO FORMULÁRIO ============ */}
            <section
                className="
                    w-full lg:w-1/2 min-h-screen
                    flex items-center justify-center
                    px-4 py-6 md:px-10 md:py-12 lg:px-12
                "
            >
                <div
                    className="
                        w-full max-w-md
                        bg-white rounded-[28px] p-6 shadow-sm
                        md:max-w-lg md:p-12 md:rounded-[32px] md:shadow-2xl
                        lg:max-w-sm lg:p-0 lg:rounded-none lg:shadow-none
                    "
                >
                    <header className="flex flex-col items-center text-center gap-5 md:gap-6">
                        <img src={logo} width={72} alt="Logo" className="md:w-20" />
                        <div className="flex flex-col gap-1.5">
                            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
                                Bem-vindo de volta
                            </h1>
                            <p className="text-sm md:text-base text-slate-400">
                                Entre para solicitar e acompanhar suas horas extras.
                            </p>
                        </div>
                    </header>

                    <form onSubmit={handleLogin} className="mt-8 md:mt-10 flex flex-col gap-5 md:gap-6" noValidate={false}>
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium"
                            >
                                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="username" className="text-sm font-semibold text-slate-700 ml-1">
                                Usuário de rede ou e-mail
                            </label>
                            <div className="relative">
                                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ex: jonaoli4"
                                    className={`${inputBase} pr-5`}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                    className={`${inputBase} pr-14 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-400 hover:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition-colors"
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                mt-2 w-full py-4 md:py-[18px] flex items-center justify-center gap-2
                                bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold text-base md:text-lg
                                rounded-full shadow-lg shadow-blue-500/30
                                hover:brightness-110 active:scale-[0.98] transition-all
                                focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            {loading ? <Loader2 className="animate-spin" size={22} /> : "Entrar"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs md:text-sm text-slate-400 leading-relaxed">
                        Use o mesmo usuário e senha do AD Magna.
                        <span className="hidden md:inline"> Em caso de dúvida, contate o administrador.</span>
                    </p>
                </div>
            </section>

            {/* ============ PAINEL VISUAL (somente desktop) ============ */}
            <aside
                className="
                    hidden lg:flex lg:w-1/2 min-h-screen
                    flex-col items-center justify-center gap-6 p-10 text-center
                    bg-radial-[at_50%_60%] from-sky-200 via-sky-400 to-blue-700
                "
            >
                <FluxoIlustracao />
                <div className="max-w-md text-white">
                    <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
                        Solicite hora extra sem planilha e sem papel
                    </h2>
                    <p className="mt-3 text-sky-50/90 leading-relaxed">
                        O PDF é gerado e enviado para assinatura automaticamente. Você acompanha cada etapa sem sair do sistema.
                    </p>
                </div>
            </aside>
        </main>
    );
}