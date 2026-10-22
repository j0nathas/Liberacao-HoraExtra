import { Check, CalendarDays, CheckCircle2, Clock, Users, Ban } from 'lucide-react';

const STATUS = {
    signed: {
        label: 'Aprovadas',
        icon: CheckCircle2,
        color: 'text-emerald-600 dark:text-emerald-300',
        bg: 'bg-emerald-50 dark:bg-emerald-500/15',
        border: 'border-emerald-200 dark:border-emerald-500/20',
    },
    pending: {
        label: 'Pendentes',
        icon: Clock,
        color: 'text-amber-600 dark:text-amber-300',
        bg: 'bg-amber-50 dark:bg-amber-500/15',
        border: 'border-amber-200 dark:border-amber-500/20',
    },
};

const TONS = {
    pending: {
        frame: 'border-amber-200 bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10',
        footer: 'text-amber-700 dark:text-amber-300',
    },
    signed: {
        frame: 'border-emerald-200 bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10',
        footer: 'text-emerald-700 dark:text-emerald-300',
    },
    empty: {
        frame: 'border-slate-200 bg-slate-100 dark:border-gray-700 dark:bg-gray-800/60',
        footer: 'text-slate-400 dark:text-gray-500',
    },
};

const interpretarDataLocal = (data) => {
    const [ano, mes, dia] = data.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
};

const formatarData = (data) =>
    interpretarDataLocal(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
    });

const formatarDiaSemana = (data, hoje) => {
    if (data === hoje) return 'Hoje';
    return interpretarDataLocal(data)
        .toLocaleDateString('pt-BR', { weekday: 'long' })
        .replace('-feira', '');
};

function somarTurnos(turnos) {
    return turnos.reduce(
        (total, t) => ({
            signed: total.signed + t.signed,
            pending: total.pending + t.pending,
        }),
        { signed: 0, pending: 0 }
    );
}

// Só renderiza os status que têm pelo menos 1 pessoa
const statusComValor = (valores) =>
    ['signed', 'pending'].filter((tipo) => valores[tipo] > 0);

const colunas = (qtd) => (qtd === 1 ? 'grid-cols-1' : 'grid-cols-2');

function CelulaTurno({ valor, tipo }) {
    const estilo = STATUS[tipo];
    return (
        <div className={`rounded-lg border px-2 py-1 text-center ${estilo.bg} ${estilo.border}`}>
            <p className={`text-lg font-bold leading-tight ${estilo.color}`}>{valor}</p>
        </div>
    );
}

export default function CardDia({ dia, hoje, selecionando, selecionado, onToggle }) {
    const totais = somarTurnos(dia.turnos);
    const total = totais.signed + totais.pending;
    const vazio = total === 0;
    const bloqueado = selecionando && vazio;
    const tiposTotais = statusComValor(totais);

    const tom = TONS[vazio ? 'empty' : totais.pending > 0 ? 'pending' : 'signed'];

    return (
        <div className="min-w-0 flex-[0_0_88%] pl-3 sm:flex-[0_0_320px]">
            <button
                type="button"
                disabled={!selecionando || vazio}
                onClick={onToggle}
                aria-pressed={selecionando && !vazio ? selecionado : undefined}
                aria-disabled={vazio}
                className={`flex h-full w-full flex-col rounded-2xl border-2 p-1.5 text-left shadow-sm transition-all ${tom.frame} ${selecionado && !vazio
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-gray-900'
                    : ''
                    } ${selecionando && !vazio ? 'cursor-pointer hover:shadow-md' : ''
                    } ${bloqueado ? 'cursor-not-allowed opacity-60' : ''
                    } ${!selecionando || vazio ? 'cursor-default' : ''}`}
            >
                {/* Miolo */}
                <div
                    className={`flex-1 rounded-xl p-4 ${vazio
                        ? 'bg-slate-50 dark:bg-gray-800/60'
                        : 'bg-white dark:bg-gray-800'
                        }`}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${vazio
                                    ? 'bg-slate-200 text-slate-400 dark:bg-gray-700 dark:text-gray-500'
                                    : 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300'
                                    }`}
                            >
                                <CalendarDays size={19} />
                            </span>
                            <div>
                                <h3
                                    className={`text-lg font-bold capitalize leading-tight ${vazio
                                        ? 'text-slate-500 dark:text-gray-400'
                                        : 'text-slate-900 dark:text-gray-100'
                                        }`}
                                >
                                    {formatarDiaSemana(dia.data, hoje)}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                    {formatarData(dia.data)}
                                </p>
                            </div>
                        </div>

                        {selecionando && !vazio && (
                            <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${selecionado
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-slate-300 bg-white text-transparent dark:border-gray-600 dark:bg-gray-700'
                                    }`}
                            >
                                <Check size={15} />
                            </span>
                        )}

                        {bloqueado && (
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 dark:text-gray-500">
                                <Ban size={16} />
                            </span>
                        )}
                    </div>

                    {vazio ? (
                        <div className="mt-4 rounded-xl border border-dashed border-slate-300 py-8 text-center dark:border-gray-700">
                            <Users size={20} className="mx-auto text-slate-300 dark:text-gray-600" />
                            <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
                                Nenhuma solicitação neste dia
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Totais (apenas o que for maior que zero) */}
                            <div className={`mt-4 grid gap-2 ${colunas(tiposTotais.length)}`}>
                                {tiposTotais.map((tipo) => {
                                    const { icon: Icon, bg, border, color, label } = STATUS[tipo];
                                    return (
                                        <div key={tipo} className={`rounded-xl border px-3 py-2 ${bg} ${border}`}>
                                            <div className={`flex items-center gap-1 text-[11px] font-semibold ${color}`}>
                                                <Icon size={12} />
                                                {label}
                                            </div>
                                            <p className={`mt-0.5 text-2xl font-bold ${color}`}>{totais[tipo]}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Turnos */}
                            <div className="mt-4">
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">
                                    Distribuição por turno
                                </p>

                                <div className="space-y-2.5">
                                    {dia.turnos.map((turno) => {
                                        const tiposTurno = statusComValor(turno);
                                        const totalTurno = turno.signed + turno.pending;

                                        if (totalTurno === 0) return null;

                                        return (
                                            <div key={turno.nome}>
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-gray-700 dark:text-gray-200">
                                                        {turno.nome}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 dark:text-gray-400">
                                                        {totalTurno} {totalTurno === 1 ? 'pessoa' : 'pessoas'}
                                                    </span>
                                                </div>
                                                <div className={`grid gap-2 ${colunas(tiposTurno.length)}`}>
                                                    {tiposTurno.map((tipo) => (
                                                        <CelulaTurno key={tipo} valor={turno[tipo]} tipo={tipo} />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Tarja inferior */}
                <div className={`flex items-center justify-between px-2.5 pb-1 pt-2 text-[11px] font-bold uppercase ${tom.footer}`}>
                    <span>
                        {vazio
                            ? 'Sem solicitações'
                            : selecionando
                                ? selecionado ? 'Selecionado' : 'Clique para selecionar'
                                : `${total} ${total === 1 ? 'pessoa' : 'pessoas'}`}
                    </span>
                </div>
            </button>
        </div>
    );
}