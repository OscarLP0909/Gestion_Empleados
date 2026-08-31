import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface SidebarProps {
    isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();

    const isAdmin = user?.role === "ADMIN";
    const isHROrAdmin = ["ADMIN", "HR_MANAGER"].includes(user?.role || "");

    const MenuItem = ({
        label,
        path,
        onClick,
    }: {
        label: string;
        path?: string;
        onClick?: () => void;
    }) => (
        <button
            onClick={() => {
                if (path) navigate(path);
                if (onClick) onClick();
            }}
            className={`app-sidebar-link mb-1 ${location.pathname === path ? "active" : ""}`}
            title={label}
        >
            {isOpen ? <span>{label}</span> : <span>{label.charAt(0)}</span>}
        </button>
    );

    const SectionTitle = ({ label }: { label: string }) => (
        <div
            className="app-sidebar-section"
            style={{
                opacity: isOpen ? 1 : 0,
                height: isOpen ? "auto" : "0",
                overflow: "hidden",
                transition: "opacity 0.2s ease",
                marginTop: "18px",
                marginBottom: "8px",
                padding: "0 12px",
            }}
        >
            {label}
        </div>
    );

    return (
        <div
            className="app-sidebar"
            style={{
                minHeight: "calc(100vh - 60px)",
                width: isOpen ? "250px" : "76px",
                transition: "width 0.2s ease",
                overflowY: "auto",
                overflowX: "hidden",
                padding: "16px 10px",
                flexShrink: 0,
            }}
        >
            <SectionTitle label="Principal" />
            <MenuItem label="Dashboard" path="/dashboard" />
            <MenuItem label="Empleados" path="/employees" />
            <MenuItem label="Contratos" path="/contracts" />

            {isHROrAdmin && (
                <>
                    <SectionTitle label="Gestión" />
                    <MenuItem label="Crear Empleado" path="/employees/new" />
                    <MenuItem label="Crear Contrato" path="/contracts/new" />
                    <MenuItem label="Aprobaciones" path="/contract-approvals" />
                    <MenuItem label="Reportes" path="/reports" />
                </>
            )}

            {isHROrAdmin && (
                <>
                    <SectionTitle label="Administración" />
                    {isAdmin && (
                        <>
                            <MenuItem label="Usuarios" path="/users" />
                            <MenuItem label="Crear Usuario" path="/users/new" />
                        </>
                    )}
                    <MenuItem label="Auditoría" path="/audit" />
                </>
            )}

            <SectionTitle label="Cuenta" />
            <MenuItem label="Perfil" path="/profile" />
        </div>
    );
};
