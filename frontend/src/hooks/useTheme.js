import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';

export function useTheme() {
    const { user } = useAuth();
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem(`${user?.id}_theme`);
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem(`${user?.id}_theme`, theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme((t) => (t === "dark" ? "light" : "dark"));

    return { theme, toggleTheme };
}