import { useState, useEffect } from 'react';
import api from '../../services/api'
import Card from './components/Card'
import Header from './components/Header'
import CardInfo from './components/CardInfo';

const status = true;

export default function SentForms() {
    const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

    const handleInfoOpen = (dados) => {
        setSolicitacaoSelecionada(dados);
    };

    const handleInfoClose = () => {
        setSolicitacaoSelecionada(null);
    };

    const [dados, setDados] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const { data } = await api.get("/query/solicitacoes");
                setDados(data);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };

        carregarDados();
    }, []);

    return (
        <>
            <main className='flex w-[100%] h-[90vh] flex-col relative overflow-hidden '>
                <Header />

                <div className='grid overflow-auto auto-rows-max md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4 p-2 h-full bg-linear-to-b from-blue-100 to-purple-100 w-full'>

                    {dados.map((solicitacao) => (<Card dados={solicitacao} key={solicitacao.id} openInfo={handleInfoOpen} />))}

                </div>

                {solicitacaoSelecionada && (
                    <CardInfo dados={solicitacaoSelecionada} closeInfo={handleInfoClose} />
                )}
            </main>
        </>
    )
}