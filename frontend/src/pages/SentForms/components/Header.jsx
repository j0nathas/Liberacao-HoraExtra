import { motion } from "framer-motion";
import { LayoutGrid, Send, CircleCheckBig } from "lucide-react";

const TABS = [
    { key: "todas", label: "Todas", icon: LayoutGrid },
    { key: "pendente", label: "Enviadas", icon: Send },
    { key: "aprovado", label: "Aprovadas", icon: CircleCheckBig },
];

export default function Header({ filtro, onFiltroChange, counts }) {
    return (
        <div className="sticky top-0 flex justify-center bg-white/80 backdrop-blur-md px-4 py-3">
            <div className="flex gap-1 bg-slate-100 rounded-full p-1">
                {TABS.map(({ key, label, icon: Icon }) => {
                    const active = filtro === key;
                    return (
                        <button
                            key={key}
                            onClick={() => onFiltroChange(key)}
                            className={`cursor-pointer relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
                                ${active ? "text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            {active && (
                                <motion.span
                                    layoutId="header-tab-highlight"
                                    className="absolute inset-0 bg-white rounded-full shadow-[0_1px_4px_rgba(15,23,42,0.12)]"
                                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                />
                            )}
                            <Icon width={14} height={14} className="relative z-10" />
                            <span className="relative z-10 hidden md:block">{label}</span>
                            {counts?.[key] != null && (
                                <span className={`relative z-10 text-[10px] font-bold rounded-full px-1.5 py-0.5
                                    ${active ? "bg-slate-100 text-slate-600" : "bg-slate-200 text-slate-500"}`}>
                                    {counts[key]}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}