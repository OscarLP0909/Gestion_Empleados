import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();

    const isActive = (path: string) => {
        return location.pathname === path ? "active" : "";
    };

    const canCreate = ["ADMIN", "HR_MANAGER"].includes(user?.role || "");

    return (
        <div
            className="d-flex flex-column bg-light p-3"
            style={{
                minHeight: "calc(100vh - 56px)",
                width: "250px",
                borderRight: "1px solid #dee2e6",
            }}
        >
            <h6 className="fw-bold mb-3 text-uppercase">Menú</h6>

            <button
                onClick={() => navigate("/dashboard")}
                className={`btn btn-light text-start mb-2 ${isActive("/dashboard")}`}
            >
                📈 Dashboard
            </button>

            <button
                onClick={() => navigate("/employees")}
                className={`btn btn-light text-start mb-2 ${isActive("/employees")}`}
            >
                👥 Empleados
            </button>

            <button
                onClick={() => navigate("/contracts")}
                className={`btn btn-light text-start mb-2 ${isActive("/contracts")}`}
            >
                📋 Contratos
            </button>

            {canCreate && (
                <>
                    <hr />
                    <h6 className="fw-bold mb-3 text-uppercase text-muted">Admin</h6>

                    <button
                        onClick={() => navigate("/reports")}
                        className={`btn btn-light text-start mb-2 ${isActive("/reports")}`}
                    >
                        📊 Reportes
                    </button>

                    <button
                        onClick={() => navigate("/users")}
                        className={`btn btn-light text-start mb-2 ${isActive("/users")}`}
                    >
                        🔑 Usuarios
                    </button>
                </>
            )}
        </div>
    );
};