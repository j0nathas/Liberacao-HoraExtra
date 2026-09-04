import { React, useEffect, useState } from 'react';
import api from '../services/api';
import {
  PlusCircle,
  FileCheck,
  Clock,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Mail,
  CircleX,
  GlobeX,
  Ban,
  Construction
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDate } from './SentForms/Utils/SentUtils';

export default function Home() {
  const { user } = useAuth();
  const stats = [
    { id: 1, status: 'signed', label: 'Assinado', labelHead: 'Assinadas', icon: Clock, color: 'text-green-600', bg: 'bg-green-100', stateColor: 'bg-green-400' },
    { id: 2, status: 'pending', label: 'Pendente', labelHead: 'Pendentes', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-100', stateColor: 'bg-amber-400' },
    { id: 3, status: 'recusado', label: 'Recusado', labelHead: 'Recusadas', icon: CircleX, color: 'text-red-600', bg: 'bg-red-100', stateColor: 'bg-red-400' },
    { id: 4, status: 'error', label: 'Não enviado', labelHead: 'Não Enviadas', icon: GlobeX, color: 'text-gray-600', bg: 'bg-gray-100', stateColor: 'bg-gray-400' },
  ];

  const [dados, setDados] = useState([]);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    async function HomeInfo() {
      try {
        const response = await api.get(`/query/homeInfo`);
        setDados(response.data);
      } catch (error) { console.error("Erro ao consultar documento:", error); }
    }
    HomeInfo();


    async function HomeCount() {
      try {
        const response = await api.get(`/query/homeCount`);
        setCounts(response.data);
        console.log(response.data)
      } catch (error) { console.error("Erro ao consultar documento:", error); }
    }
    HomeCount();
  }, []);

  const navigate = useNavigate();

  return (
    <main className="flex-1 overflow-auto bg-slate-50 animate-fade-in">
      <header className="bg-white border-b border-slate-200 px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestão de Horas Extra</h1>
              <p className="text-slate-500 mt-1">Bem-vindo, <strong>{user?.nome || 'Usuário'}</strong>. O que deseja fazer hoje?</p>
            </div>
            <button onClick={() => navigate("/form")}
              className="flex items-center cursor-pointer justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200">
              <PlusCircle size={20} />
              Nova Solicitação
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-8 py-10 space-y-10">

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const statInfo = counts.find(s => s.status === stat.status);

            return (
              <div key={stat.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.labelHead || stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{statInfo?.contagem ?? 0}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="w-full grid grid-cols-1 gap-8">

          {/* Fluxo de Automação */}
          <div className="space-y-6">

            <aside className="grid lg:grid-cols-2 gap-5">

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Atividades Recentes</h3>
                  <button onClick={() => navigate("/sent")} className="text-blue-600 text-sm font-semibold hover:underline">Ver tudo</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {dados.map((item) => {

                    const departamentos = [
                      ...new Set(
                        item.solicitacoes
                          ?.map(solicitacao => solicitacao.departamento?.departamento)
                          .filter(Boolean)
                      )
                    ];

                    const statusSoli = stats.find(stat => stat.status === item.status);


                    return (
                      <button key={item.id}
                        onClick={() => navigate("/sent", { state: { openId: item.id } })}
                        className="px-4 py-4 flex w-full items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <p className='font-semibold text-[10px] p-0 text-gray-300'>#{item.id}</p>
                          <div className={`w-2 h-2 rounded-full ${statusSoli.stateColor}`} />
                          <div className="flex flex-col items-start">
                            <nav className="flex flex-wrap items-center gap-1">
                              {departamentos.map((departamento, index) => {
                                return (
                                  <p key={index} className={`text-sm font-bold lowercase first-letter:uppercase text-slate-700`}>{departamento}</p>
                                )
                              })}
                            </nav>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">{formatDate(item.data)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-bold px-3 py-2 rounded-full ${statusSoli.bg} ${statusSoli.color}`}>
                            {statusSoli.label}
                          </span>
                          <ArrowRight size={16} className="text-slate-300" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="h-full flex flex-col gap-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileCheck className="text-blue-600" /> Fluxo Inteligente
                </h2>

                <nav className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center h-full">
                  <div className="flex flex-col justify-center bg-white p-6 rounded-2xl border h-full border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                      <FileCheck size={60} />
                    </div>
                    <h3 className="font-bold text-slate-800">1. Geração de PDF</h3>
                    <p className="text-xs text-slate-500 mt-2">Documento gerado automaticamente com dados do formulário.</p>
                  </div>
                  <div className="flex flex-col justify-center bg-white p-6 rounded-2xl border h-full border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                      <Send size={60} />
                    </div>
                    <h3 className="font-bold text-slate-800">2. ZapSign</h3>
                    <p className="text-xs text-slate-500 mt-2">Envio direto para assinatura eletrônica do gestor e colaborador.</p>
                  </div>
                  <div className="flex flex-col justify-center bg-white p-6 rounded-2xl border h-full border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                      <Mail size={60} />
                    </div>
                    <h3 className="font-bold text-slate-800">3. Finalização</h3>
                    <p className="text-xs text-slate-500 mt-2">E-mail automático com o PDF assinado.</p>
                  </div>
                </nav>

              </div>

              {/* Tabela Simples */}

            </aside>


          </div>

        </div>
      </section>
    </main>
  )
}