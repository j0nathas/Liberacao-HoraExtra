import { useEffect, useRef, useState } from "react";
import SearchIcon from '../../img/search.svg?react'
import ClearIcon from '../../img/clear.svg?react'

export default function Search({
    value = '',
    opcoes,
    placeholder = "Pesquisar...",
    onSelect,
    onChange,
    containerStyle = "relative w-full",
    inputStyle = "bg-gray-100 w-[100%] text-gray-600 py-3 pl-10 px-8 rounded-xl focus:ring-2 focus:ring-gray-100 outline-0 text-ellipsis placeholder:text-gray-400",
    listStyle = "absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg",
    itemStyle = "cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700 active:bg-blue-100 active:text-blue-500",
    clearButtonStyle = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700",
    noResultStyle = "px-4 py-2 text-gray-500",
    searchIconStyle = "absolute left-2 pr-1 top-1/2 -translate-y-1/2 border-r-2 text-gray-600 border-gray-600"
}) {
    const [texto, setTexto] = useState("");
    const [aberto, setAberto] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setAberto(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const resultados = opcoes.filter((item) => {
        const porNome = item.name.toLowerCase().includes(texto.toLowerCase());
        const porId = item.id.toString().includes(texto);
        return porNome || porId;
    });

    return (
        <div className={containerStyle} ref={containerRef}>
            <input
                type="text"
                value={!texto ? value : texto}
                placeholder={placeholder}
                onChange={(e) => setTexto(e.target.value)}
                onFocus={() => setAberto(true)}
                className={inputStyle}
            />

            <SearchIcon className={searchIconStyle} width={25} height={25} />

            {texto && (
                <button onClick={() => setTexto("")} className={clearButtonStyle}>
                    <ClearIcon width={20} height={20} className="text-red-300 hover:text-red-500 active:text-red-700" />
                </button>
            )}

            {aberto && (
                <ul className={`search-scroll ${listStyle}`}>
                    {resultados.length > 0 ? (
                        resultados.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => {
                                    setTexto(item.name);
                                    setAberto(false);
                                    onSelect?.(item);
                                    onChange?.(item);
                                }}
                                className={itemStyle}
                            >
                                {item.name}
                            </li>
                        ))
                    ) : (
                        <li className={noResultStyle}>
                            Nenhum resultado encontrado.
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}