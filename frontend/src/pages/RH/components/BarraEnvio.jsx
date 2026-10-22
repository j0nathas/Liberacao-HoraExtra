import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, Users, Loader } from 'lucide-react';

const OPCOES = [
    { id: 'signed', label: 'Apenas aprovadas', icon: CheckCircle2 },
    { id: 'all', label: 'Todas', icon: Users },
];

export default function BarraEnvio({
    diasSelecionados,
    pessoas,          // { signed, pending }
    modo,             // 'signed' | 'all'
    onModoChange,
    onEnviar,
    enviando,
}) {
    const totalEnvio = modo === 'signed' ? pessoas.signed : pessoas.signed + pessoas.pending;
    const desabilitado = !diasSelecionados || !totalEnvio || enviando;

    return (
        <motion.footer
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.07)] backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95"
        >
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Resumo da seleção */}
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                        <Mail size={20} />
                    </span>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-gray-100">
                            {diasSelecionados === 0
                                ? 'Nenhum dia selecionado'
                                : `${diasSelecionados} ${diasSelecionados === 1 ? 'dia selecionado' : 'dias selecionados'}`}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">
                            {totalEnvio} {totalEnvio === 1 ? 'pessoa será incluída' : 'pessoas serão incluídas'} no envio
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Seletor de modo */}
                    <div
                        role="radiogroup"
                        aria-label="O que enviar"
                        className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-gray-700 dark:bg-gray-800"
                    >
                        {OPCOES.map(({ id, label, icon: Icon }) => {
                            const ativo = modo === id;
                            const qtd = id === 'signed' ? pessoas.signed : pessoas.signed + pessoas.pending;

                            return (
                                <button
                                    key={id}
                                    type="button"
                                    role="radio"
                                    aria-checked={ativo}
                                    onClick={() => onModoChange(id)}
                                    className={`inline-flex flex-1 items-center justify-center cursor-pointer gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition sm:flex-none ${ativo
                                        ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-300'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <Icon size={14} />
                                    {label}
                                    <span className="rounded-full bg-slate-200/80 px-1.5 py-0.5 text-[10px] dark:bg-gray-600">
                                        {qtd}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        disabled={desabilitado}
                        onClick={onEnviar}
                        className="inline-flex items-center justify-center cursor-pointer gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
                    >
                        {enviando ? <Loader size={16} className='animate-spin' /> : <Send size={16} />}
                        {enviando ? 'Enviando...' : modo === 'signed' ? 'Enviar aprovadas' : 'Enviar todas'}
                    </button>
                </div>
            </div>
        </motion.footer>
    );
}