import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox } from 'lucide-react';
import api from '../../services/api'
import Card from './components/Card'
import Header from './components/Header'
import CardInfo from './components/CardInfo';

export default function SentForms() {
    const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
    const [dados, setDados] = useState([]);
    const [filtro, setFiltro] = useState('todas');

    const handleInfoOpen = (dados) => setSolicitacaoSelecionada(dados);
    const handleInfoClose = () => setSolicitacaoSelecionada(null);


    useEffect(() => {
        const carregarDados = async () => {
            try {
                const { data } = await api.get("/query/solicitacoes");
                setDados(data);
            } catch (error) {
                console.error(error);
            }
        };
        carregarDados();
    }, []);

    const dadosFiltrados = useMemo(() => {
        if (filtro === 'todas') return dados;
        if (filtro === 'pendente') return dados.filter((d) => d.status === 'pending');
        if (filtro === 'aprovado') return dados.filter((d) => d.status === 'signed');
        if (filtro === 'recusado') return dados.filter((d) => d.status === 'recusado');
        return dados;
    }, [dados, filtro]);

    const counts = useMemo(() => ({
        todas: dados.length,
        pendente: dados.filter((d) => d.status === 'pending').length,
        aprovado: dados.filter((d) => d.status === 'signed').length,
        recusado: dados.filter((d) => d.status === 'recusado').length,
    }), [dados]);

    return (
        <main className='flex w-full h-[90vh] flex-col relative overflow-hidden'>
            <Header filtro={filtro} onFiltroChange={setFiltro} counts={counts} />

            <div className="relative flex-1 overflow-auto bg-white">

                <div
                    className="pointer-events-none fixed inset-x-0 top-[10vh] bottom-0 opacity-[0.4]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #9c9c9c 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                    }}
                />

                <AnimatePresence mode="wait">
                    {dadosFiltrados.length > 0 ? (
                        <motion.div
                            key={filtro}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="relative grid auto-rows-max gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4"
                        >
                            {dadosFiltrados.map((solicitacao) => (
                                <Card dados={solicitacao} key={solicitacao.id} openInfo={handleInfoOpen} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="vazio"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative flex flex-col items-center justify-center gap-2 h-full text-slate-400"
                        >
                            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
                                <Inbox width={22} height={22} />
                            </span>
                            <p className="text-sm font-semibold">Nenhuma solicitação por aqui</p>
                            <p className="text-xs text-slate-300">
                                {filtro === 'todas' ? 'Nada foi enviado ainda.' : 'Nada nessa categoria no momento.'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {solicitacaoSelecionada && (
                <CardInfo dados={solicitacaoSelecionada} closeInfo={handleInfoClose} />
            )}
        </main>
    )
}