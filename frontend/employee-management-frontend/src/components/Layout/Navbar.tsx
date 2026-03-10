import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
    onMenuToggle: () => void;
}

export const Navbar = ({ onMenuToggle }: NavbarProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-dark bg-dark shadow-sm" style={{ backgroundColor: "#1a1a1a !important" }}>
            <div className="container-fluid">
                <div className="d-flex align-items-center gap-3">
                    <button
                        onClick={onMenuToggle}
                        className="btn btn-dark border-0"
                        style={{
                            fontSize: "22px",
                            padding: "6px 12px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#333";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                    >
                        ☰
                    </button>
                    <span className="navbar-brand mb-0 h5" style={{ fontWeight: "600" }}>
                        📊 Gestión de Empleados
                    </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="text-white small d-flex flex-column align-items-end">
                        <div style={{ fontSize: "13px" }}>
                            Hola, <strong>{user?.name || user?.email}</strong>
                        </div>
                        <div
                            className="badge"
                            style={{
                                backgroundColor:
                                    user?.role === "ADMIN"
                                        ? "#dc3545"
                                        : user?.role === "HR_MANAGER"
                                        ? "#0d6efd"
                                        : "#6c757d",
                                marginTop: "4px",
                                fontSize: "11px",
                                padding: "4px 8px",
                            }}
                        >
                            {user?.role}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger"
                        style={{
                            fontSize: "12px",
                            padding: "6px 12px",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        Salir
                    </button>
                </div>
            </div>
        </nav>
    );
};