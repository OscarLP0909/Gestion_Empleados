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
        icon,
        label,
        path,
        onClick,
    }: {
        icon: string;
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
            <span style={{ fontSize: "16px", minWidth: "20px", textAlign: "center" }}>{icon}</span>
            {isOpen && <span>{label}</span>}
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
            <MenuItem icon="📊" label="Dashboard" path="/dashboard" />
            <MenuItem icon="👥" label="Empleados" path="/employees" />
            <MenuItem icon="📋" label="Contratos" path="/contracts" />

            {isHROrAdmin && (
                <>
                    <SectionTitle label="Gestión" />
                    <MenuItem icon="➕" label="Crear Empleado" path="/employees/new" />
                    <MenuItem icon="📝" label="Crear Contrato" path="/contracts/new" />
                    <MenuItem icon="✅" label="Aprobaciones" path="/contract-approvals" />
                    <MenuItem icon="📈" label="Reportes" path="/reports" />
                </>
            )}

            {isHROrAdmin && (
                <>
                    <SectionTitle label="Administración" />
                    {isAdmin && (
                        <>
                            <MenuItem icon="👥" label="Usuarios" path="/users" />
                            <MenuItem icon="🆕" label="Crear Usuario" path="/users/new" />
                        </>
                    )}
                    <MenuItem icon="📋" label="Auditoría" path="/audit" />
                </>
            )}

            <SectionTitle label="Cuenta" />
            <MenuItem icon="👤" label="Perfil" path="/profile" />
        </div>
    );
};
