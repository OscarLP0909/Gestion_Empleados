import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-dark bg-dark shadow-sm">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h5">
                    📊 Gestión de Empleados
                </span>
                <div className="d-flex align-items-center gap-3">
                    <div className="text-white small">
                        <div>Hola, <strong>{user?.email}</strong></div>
                        <div className="badge bg-primary">{user?.role}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-sm btn-danger"
                    >
                        Salir
                    </button>
                </div>
            </div>
        </nav>
    );
};