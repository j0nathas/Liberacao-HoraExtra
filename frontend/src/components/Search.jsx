import { useEffect, useId, useMemo, useRef, useState } from "react";
import SearchIcon from '../../img/search.svg?react'
import ClearIcon from '../../img/clear.svg?react'

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
    noResultsText = "Nenhum resultado encontrado.",
    containerStyle = "relative w-full",
    inputStyle = "bg-gray-100 w-[100%] text-gray-600 py-3 pl-10 px-8 rounded-xl focus:ring-2 focus:ring-gray-100 outline-0 text-ellipsis placeholder:text-gray-400 disabled:placeholder:text-red-300 disabled:opacity-50 disabled:bg-red-100 disabled:cursor-not-allowed",
    listStyle = "absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg",
    itemStyle = "cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700",
    itemActiveStyle = "bg-blue-100 text-blue-500",
    clearButtonStyle = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700",
    noResultStyle = "px-4 py-2 text-gray-500",
    searchIconStyle = `absolute left-2 pr-1 top-1/2 -translate-y-1/2 border-r-2 ${!disabled ? ' text-gray-600 border-gray-600' : 'text-red-200 border-red-200'}`,
    disabledTextStyle = 'absolute text-[10px] text-red-400',
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
            const id = String(getOptionId(item) ?? "");
            const re = item.re ? normalizar(String(item.re)) : "";

            return label.includes(termo) || id.includes(termo) || re.includes(termo);
        });
    }, [opcoes, value, getOptionLabel, getOptionId, filterLocal]);

    function selecionar(item) {
        onSelect?.(item);
        onChange?.(item ? getOptionLabel(item) : "");
        setAberto(false);
        setIndiceAtivo(-1);
    }

    function limpar() {
        onChange?.("");
        onSelect?.(null);
        setIndiceAtivo(-1);
        inputRef.current?.focus();
    }

    function handleKeyDown(e) {
        if (disabled) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!aberto) {
                setAberto(true);
                return;
            }
            setIndiceAtivo((prev) => Math.min(prev + 1, resultados.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setIndiceAtivo((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            if (aberto && indiceAtivo >= 0 && resultados[indiceAtivo]) {
                e.preventDefault();
                selecionar(resultados[indiceAtivo]);
            }
        } else if (e.key === "Escape") {
            setAberto(false);
            setIndiceAtivo(-1);
        }
    }

    return (
        <div className={containerStyle} ref={containerRef}>
            <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={aberto}
                aria-controls={listboxId}
                aria-autocomplete="list"
                autoFocus={autoFocus}
                disabled={disabled}
                value={value ?? ""}
                placeholder={placeholder}
                onChange={(e) => {
                    onChange?.(e.target.value);
                    setAberto(true);
                    setIndiceAtivo(-1);
                }}
                onFocus={() => setAberto(true)}
                onKeyDown={handleKeyDown}
                className={inputStyle}
            />

            <SearchIcon className={searchIconStyle} width={25} height={25} />

            {value && !disabled && (
                <button
                    type="button"
                    onClick={limpar}
                    className={clearButtonStyle}
                >
                    <ClearIcon width={20} height={20} className="text-red-300 hover:text-red-500 active:text-red-700" />
                </button>
            )}

            {aberto && !disabled && (
                <ul id={listboxId} role="listbox" className={listStyle}>
                    {resultados.length > 0 ? (
                        resultados.map((item, idx) => {
                            const id = getOptionId(item);
                            const ativo = idx === indiceAtivo;
                            return (
                                <li
                                    key={id}
                                    role="option"
                                    onMouseEnter={() => setIndiceAtivo(idx)}
                                    onClick={() => selecionar(item)}
                                    className={`${itemStyle} ${ativo ? itemActiveStyle : ""}`}
                                >
                                    {getOptionLabel(item)}
                                </li>
                            );
                        })
                    ) : (
                        <li className={noResultStyle}>{noResultsText}</li>
                    )}
                </ul>
            )}
            {disabled ? <p className={disabledTextStyle}>{disabledText}</p> : ''}
        </div>
    );
}