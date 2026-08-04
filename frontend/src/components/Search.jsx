import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search as SearchIcon, X as ClearIcon, ChevronDown } from "lucide-react";

function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

export default function Search({
    value,
    onChange,
    onSelect,
    opcoes = [],
    placeholder = "Pesquisar...",
    getOptionLabel = (item) => item.name,
    getOptionId = (item) => item.id,
    filterLocal = true,
    disabled = false,
    disabledText = '',
    autoFocus = false,
}) {
    const [aberto, setAberto] = useState(false);
    const [indiceAtivo, setIndiceAtivo] = useState(-1);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const listboxId = useId();

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setAberto(false);
                setIndiceAtivo(-1);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const resultados = useMemo(() => {
        if (!filterLocal) return opcoes;
        const termo = normalizar(value ?? "");
        if (!termo) return opcoes;
        return opcoes.filter((item) => {
            const label = normalizar(String(getOptionLabel(item) ?? ""));
            const re = item.re ? normalizar(String(item.re)) : "";
            return label.includes(termo) || re.includes(termo);
        });
    }, [opcoes, value, getOptionLabel, filterLocal]);

    function selecionar(item) {
        onSelect?.(item);
        onChange?.(item ? getOptionLabel(item) : "");
        setAberto(false);
        setIndiceAtivo(-1);
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative flex items-center">
                <div className={`absolute left-3 transition-colors ${disabled ? 'text-slate-300' : 'text-slate-400'}`}>
                    <SearchIcon size={18} />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    disabled={disabled}
                    value={value ?? ""}
                    placeholder={disabled ? (disabledText || "Bloqueado") : placeholder}
                    onChange={(e) => {
                        onChange?.(e.target.value);
                        setAberto(true);
                        setIndiceAtivo(-1);
                    }}
                    onFocus={() => setAberto(true)}
                    className={`w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-10 pr-10 rounded-xl outline-none transition-all
                        ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}
                    `}
                />

                {value && !disabled && (
                    <button
                        type="button"
                        onClick={() => { onChange(""); onSelect(null); }}
                        className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                    >
                        <ClearIcon size={16} />
                    </button>
                )}

                {!value && (
                    <div className="absolute right-3 pointer-events-none text-slate-300">
                        <ChevronDown size={18} />
                    </div>
                )}
            </div>

            {aberto && !disabled && (
                <ul className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl py-2">
                    {resultados.length > 0 ? (
                        resultados.map((item, idx) => (
                            <li
                                key={getOptionId(item)}
                                onClick={() => selecionar(item)}
                                onMouseEnter={() => setIndiceAtivo(idx)}
                                className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${idx === indiceAtivo ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {getOptionLabel(item)}
                                {item.re && <span className="ml-2 text-xs opacity-50">({item.re})</span>}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 text-sm text-slate-400 italic text-center">Nenhum resultado</li>
                    )}
                </ul>
            )}
        </div>
    );
}