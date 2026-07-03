import React, { useState } from 'react'; // Adicionado useState
import { useNavigate } from 'react-router-dom'; // Adicionado para navegar após login
import api from './services/api';
import { EyeOff, Eye, Loader2 } from 'lucide-react';

export default function LoginScreen() {
    // 1. Estados para os campos e mensagens
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                username: username,
                password: password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/form');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Usuário ou senha incorretos no AD Magna.');
            } else {
                setError('Não foi possível conectar ao servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-linear-to-tl to-white from-gray-50 flex flex-col px-8 py-12 mx-auto font-sans">

            <header className="mb-12">
                <h1 className="text-[32px] font-bold text-blue-900 leading-tight mb-4">
                    Oh, Olá!
                </h1>
                <h2 className="text-3xl font-light text-blue-300 leading-tight">
                    Bem-vindo de volta
                </h2>
                <h2 className="text-3xl font-light text-blue-300 leading-tight">
                    vamos começar?
                </h2>
            </header>

            <form onSubmit={handleLogin} className="flex flex-col flex-1">

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-blue-900 ml-1">
                            Usuário de Rede
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ex: jonaoli4"
                            className="w-full px-6 py-5 border bg-white border-blue-100 rounded-[18px] focus:outline-none focus:ring-1 focus:bg-blue-50 focus:ring-blue-200 transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-blue-900 ml-1">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className="w-full px-6 py-5 border border-blue-100 bg-white rounded-[18px] focus:outline-none focus:ring-1 focus:ring-blue-200 focus:bg-blue-50 transition-all placeholder:text-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-300"
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-10">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 flex items-center justify-center bg-linear-to-l to-blue-400 from-blue-600 shadow-2xl text-white font-bold rounded-[22px] text-lg hover:brightness-110 transition-all active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Login"}
                    </button>
                </div>
            </form>
        </main>
    );
}