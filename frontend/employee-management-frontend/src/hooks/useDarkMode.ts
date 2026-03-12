import { useState, useEffect } from "react";

export const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Leer del localStorage al iniciar
        const saved = localStorage.getItem("darkMode");
        if (saved !== null) {
            return JSON.parse(saved);
        }
        // Si no hay guardado, usar preferencia del sistema
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        // Guardar en localStorage cuando cambie
        localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

        // Aplicar la clase al documento
        if (isDarkMode) {
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-bs-theme", "light");
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode((prev: boolean) => !prev);
    };

    return { isDarkMode, toggleDarkMode };
};