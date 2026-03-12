import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useDarkMode } from "../../hooks/useDarkMode";

interface NavbarProps {
    onToggleSidebar: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        console.log("🚪 Iniciando logout...");
        
        // Limpiar token
        localStorage.removeItem("token");
        console.log("💾 Token eliminado");
        
        // Limpiar usuario del store
        logout();
        console.log("👤 Usuario eliminado del store");
        
        // Cerrar dropdown
        setShowDropdown(false);
        
        // Redirigir a login
        console.log("🔐 Redirigiendo a login...");
        navigate("/login", { replace: true });
    };

    const handleProfile = () => {
        setShowDropdown(false);
        navigate("/profile");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
            <div className="container-fluid">
                {/* Botón hamburguesa */}
                <button
                    className="btn btn-dark me-3"
                    onClick={onToggleSidebar}
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    title="Toggle Sidebar"
                >
                    ☰
                </button>

                {/* Logo */}
                <span
                    className="navbar-brand fw-bold cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                    style={{ cursor: "pointer" }}
                >
                    📊 Gestión de Empleados
                </span>

                {/* Spacer */}
                <div className="ms-auto"></div>

                {/* Controles derecha */}
                {user ? (
                    <div className="d-flex align-items-center gap-3">
                        {/* Botón Dark Mode */}
                        <button
                            className="btn btn-outline-light"
                            onClick={toggleDarkMode}
                            title="Toggle Dark Mode"
                            style={{ borderColor: "rgba(255,255,255,0.3)" }}
                        >
                            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
                        </button>

                        {/* Información del usuario */}
                        <div className="text-light d-flex align-items-center gap-2" style={{ position: "relative" }}>
                            <span className="badge bg-primary">{user?.role}</span>
                            
                            {/* Botón usuario */}
                            <button
                                className="btn btn-dark btn-sm text-light"
                                onClick={() => setShowDropdown(!showDropdown)}
                                style={{ borderColor: "rgba(255,255,255,0.3)" }}
                            >
                                👤 {user?.name || user?.email}
                            </button>

                            {/* Dropdown personalizado */}
                            {showDropdown && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        right: 0,
                                        marginTop: "8px",
                                        backgroundColor: "white",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        zIndex: 1000,
                                        minWidth: "200px",
                                    }}
                                >
                                    {/* Opción Perfil */}
                                    <button
                                        onClick={handleProfile}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "10px 16px",
                                            border: "none",
                                            backgroundColor: "transparent",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            color: "#333",
                                            fontSize: "14px",
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.target as HTMLElement).style.backgroundColor = "#f5f5f5";
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.target as HTMLElement).style.backgroundColor = "transparent";
                                        }}
                                    >
                                        📱 Mi Perfil
                                    </button>

                                    {/* Divisor */}
                                    <div style={{ height: "1px", backgroundColor: "#e0e0e0", margin: "4px 0" }}></div>

                                    {/* Opción Logout */}
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "10px 16px",
                                            border: "none",
                                            backgroundColor: "transparent",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            color: "#dc3545",
                                            fontSize: "14px",
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.target as HTMLElement).style.backgroundColor = "#fff5f5";
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.target as HTMLElement).style.backgroundColor = "transparent";
                                        }}
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/login")}
                    >
                        🔐 Login
                    </button>
                )}
            </div>
        </nav>
    );
};