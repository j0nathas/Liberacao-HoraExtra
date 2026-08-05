import React from 'react';
import {
  PlusCircle,
  FileCheck,
  Clock,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Mail
} from 'lucide-react';

export default function Home() {
  // Dados fictícios para o Dashboard
  const stats = [
    { label: 'Pendentes de Assinatura', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Concluídas (Assinadas)', value: '148', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Aguardando Aprovação', value: '5', icon: Send, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total de Horas (Mês)', value: '320h', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  const solicitacoesRecentes = [
    { id: 1, depto: 'Produção', data: '22/05', status: 'Aguardando ZapSign', color: 'amber' },
    { id: 2, depto: 'Logística', data: '21/05', status: 'Finalizado', color: 'emerald' },
    { id: 3, depto: 'Manutenção', data: '20/05', status: 'E-mail enviado', color: 'blue' },
  ];

  return (
    <main className="flex-1 overflow-auto bg-slate-50">
      {/* Header de Boas-vindas */}
      <header className="bg-white border-b border-slate-200 px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestão de Horas Extra</h1>
              <p className="text-slate-500 mt-1">Bem-vindo, Administrador. O que deseja fazer hoje?</p>
            </div>
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200">
              <PlusCircle size={20} />
              Nova Solicitação
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-8 py-10 space-y-10">

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Fluxo de Automação */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="text-blue-600" /> Fluxo Inteligente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                  <FileCheck size={60} />
                </div>
                <h3 className="font-bold text-slate-800">1. Geração de PDF</h3>
                <p className="text-xs text-slate-500 mt-2">Documento gerado automaticamente com dados do formulário.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                  <Send size={60} />
                </div>
                <h3 className="font-bold text-slate-800">2. ZapSign</h3>
                <p className="text-xs text-slate-500 mt-2">Envio direto para assinatura eletrônica do gestor e colaborador.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                  <Mail size={60} />
                </div>
                <h3 className="font-bold text-slate-800">3. Finalização</h3>
                <p className="text-xs text-slate-500 mt-2">E-mail automático com o PDF assinado para o RH e colaborador.</p>
              </div>
            </div>

            {/* Tabela Simples */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Atividades Recentes</h3>
                <button className="text-blue-600 text-sm font-semibold hover:underline">Ver tudo</button>
              </div>
              <div className="divide-y divide-slate-50">
                {solicitacoesRecentes.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.depto}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">{item.data}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-100`}>
                        {item.status}
                      </span>
                      <ArrowRight size={16} className="text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar de Alertas/Ações */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="text-amber-500" /> Notificações
            </h2>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold">Verificação ZapSign</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  Existem <strong>3 solicitações</strong> paradas há mais de 48 horas aguardando assinatura.
                </p>
                <button className="mt-4 w-full bg-white text-slate-900 py-2 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                  Reenviar Cobrança
                </button>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <Users size={120} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase">Links Rápidos</h3>
              <nav className="space-y-2">
                {['Relatórios Mensais', 'Configurar Departamentos', 'Base de Funcionários', 'Logs de E-mail'].map((link) => (
                  <button key={link} className="w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all text-sm font-medium">
                    {link}
                  </button>
                ))}
              </nav>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}