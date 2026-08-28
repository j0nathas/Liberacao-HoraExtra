import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from './services/api';
import { Check, LoaderCircle } from 'lucide-react';

export default function DocSigned() {
    const { tokenDoc } = useParams();
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);
    const [dadosZapSign, setDadosZapSign] = useState(null);

    useEffect(() => {
        async function carregarDocumento() {
            if (!tokenDoc) return;

            try {
                const response = await api.get(`/webhook/infoDocZapSign`, {
                    params: { token: tokenDoc }
                });

                setDadosZapSign(response.data);
                console.log(response.data)

                if (response.data.signed_file) {
                    setTimeout(() => {
                        window.location.href = response.data.signed_file;
                    }, 2000);
                } else {
                    setLoading(false);
                }

            } catch (error) {
                console.error("Erro ao consultar documento:", error);
                setErro(true);
                setLoading(false);
            }
        }

        carregarDocumento();
    }, [tokenDoc]);

    return (
        <>
            <main className="flex flex-col relative w-full h-full items-center justify-center gap-10">
                <img className="absolute opacity-5" src="/img/logo.png" width={300} alt="Logo" />

                {tokenDoc && loading ? (
                    <>
                        <div className="three-body">
                            <div className="three-body__dot"></div>
                            <div className="three-body__dot"></div>
                            <div className="three-body__dot"></div>
                        </div>

                        <div className={`${dadosZapSign ? 'text-green-600' : 'text-blue-900'} flex items-center gap-2 opacity-80 animate-pulse font-bold absolute top-[60%]`}>
                            {dadosZapSign ? <Check /> : < LoaderCircle className='animate-spin' />}
                            {dadosZapSign ? "Documento encontrado! Redirecionando..." : "Buscando documento..."}
                        </div>
                    </>
                ) : erro ? (
                    <div className="text-red-500 font-bold z-10 text-center">
                        <p>Erro ao localizar o documento.</p>
                        <p className="text-sm font-normal text-gray-500">Verifique se o link está correto.</p>
                    </div>
                ) : (
                    <div className="text-gray-500 font-bold z-10">
                        Documento não encontrado ou URL inválida.
                    </div>
                )}
            </main>
        </>
    );
}