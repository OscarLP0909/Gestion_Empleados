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

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
            <div className="container-fluid">
                {/* Botón hamburguesa */}
                <button
                    className="btn btn-dark me-3"
                    onClick={onToggleSidebar}
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
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
                    <div className="text-light d-flex align-items-center gap-2">
                        <span className="badge bg-primary">{user?.role}</span>
                        <div className="dropdown">
                            <button
                                className="btn btn-dark btn-sm dropdown-toggle text-light"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                👤 {user?.name}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => navigate("/profile")}
                                    >
                                        Mi Perfil
                                    </button>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        🚪 Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};