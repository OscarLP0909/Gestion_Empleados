import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useDarkMode } from "../../hooks/useDarkMode";

interface NavbarProps {
    onToggleSidebar: () => void;
}

const MenuIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const SunIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const initialsOf = (value?: string) => {
    if (!value) return "?";
    const parts = value.trim().split(/\s+/);
    const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
    return initials.join("") || "?";
};

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        logout();
        setShowDropdown(false);
        navigate("/login", { replace: true });
    };

    const handleProfile = () => {
        setShowDropdown(false);
        navigate("/profile");
    };

    return (
        <nav className="app-navbar d-flex align-items-center px-3 px-lg-4">
            <button
                className="app-navbar-icon-btn d-flex align-items-center justify-content-center me-3"
                onClick={onToggleSidebar}
                title="Mostrar/ocultar menú"
                style={{ width: 38, height: 38 }}
            >
                <MenuIcon />
            </button>

            <span
                className="fw-semibold d-flex align-items-center gap-2"
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer", color: "#fff", fontSize: "1.05rem" }}
            >
                Gestión de Empleados
            </span>

            <div className="ms-auto d-flex align-items-center gap-2">
                {user ? (
                    <>
                        <button
                            className="app-navbar-icon-btn d-flex align-items-center gap-2 px-3"
                            onClick={toggleDarkMode}
                            title="Cambiar tema"
                            style={{ height: 38 }}
                        >
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                            <span className="d-none d-md-inline small">
                                {isDarkMode ? "Claro" : "Oscuro"}
                            </span>
                        </button>

                        <span
                            className="badge rounded-pill"
                            style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "#e2e8f0", fontWeight: 600 }}
                        >
                            {user?.role}
                        </span>

                        <div style={{ position: "relative" }}>
                            <button
                                className="app-navbar-icon-btn d-flex align-items-center gap-2 px-2"
                                onClick={() => setShowDropdown((prev) => !prev)}
                                style={{ height: 38 }}
                            >
                                <span
                                    className="d-flex align-items-center justify-content-center fw-semibold"
                                    style={{
                                        width: 26,
                                        height: 26,
                                        borderRadius: "50%",
                                        backgroundColor: "var(--bs-primary)",
                                        color: "#fff",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {initialsOf(user?.name || user?.email)}
                                </span>
                                <span className="d-none d-lg-inline small">
                                    {user?.name || user?.email}
                                </span>
                            </button>

                            {showDropdown && (
                                <>
                                    <div
                                        onClick={() => setShowDropdown(false)}
                                        style={{ position: "fixed", inset: 0, zIndex: 999 }}
                                    />
                                    <div
                                        className="app-user-menu"
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0,
                                            marginTop: "8px",
                                            zIndex: 1000,
                                            minWidth: "200px",
                                        }}
                                    >
                                        <button className="app-user-menu-item" onClick={handleProfile}>
                                            Mi perfil
                                        </button>
                                        <button className="app-user-menu-item danger" onClick={handleLogout}>
                                            Cerrar sesión
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => navigate("/login")}>
                        Iniciar sesión
                    </button>
                )}
            </div>
        </nav>
    );
};
