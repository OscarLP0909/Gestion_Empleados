import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface SidebarProps {
    isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();

    const isActive = (path: string) => {
        return location.pathname === path ? "active bg-primary text-white" : "text-dark";
    };

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
            className={`btn btn-light w-100 text-start d-flex align-items-center gap-2 px-3 py-2 mb-2 border-0 ${isActive(
                path || ""
            )}`}
            title={label}
            style={{
                fontSize: "14px",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}
        >
            <span style={{ fontSize: "18px", minWidth: "24px" }}>{icon}</span>
            {isOpen && <span>{label}</span>}
        </button>
    );

    const SectionTitle = ({ label }: { label: string }) => (
        <div
            style={{
                opacity: isOpen ? 1 : 0,
                height: isOpen ? "auto" : "0",
                overflow: "hidden",
                transition: "all 0.3s ease",
                marginTop: "16px",
                marginBottom: "8px",
            }}
        >
            <h6
                className="fw-bold text-uppercase text-muted"
                style={{
                    fontSize: "11px",
                    letterSpacing: "0.5px",
                    margin: 0,
                    padding: "0 12px",
                }}
            >
                {label}
            </h6>
        </div>
    );

    return (
        <div
            className="bg-white border-end"
            style={{
                minHeight: "calc(100vh - 56px)",
                width: isOpen ? "250px" : "80px",
                borderRight: "1px solid #e0e0e0",
                transition: "width 0.3s ease, box-shadow 0.3s ease",
                overflowY: "auto",
                padding: isOpen ? "20px 12px" : "20px 8px",
                boxShadow: isOpen ? "2px 0 8px rgba(0,0,0,0.05)" : "none",
            }}
        >
            {/* SECCIÓN: Navegación Principal */}
            <SectionTitle label="Principal" />

            <MenuItem icon="📊" label="Dashboard" path="/dashboard" />
            <MenuItem icon="👥" label="Empleados" path="/employees" />
            <MenuItem icon="📋" label="Contratos" path="/contracts" />

            {/* SECCIÓN: Gestión (Solo HR_MANAGER y ADMIN) */}
            {isHROrAdmin && (
                <>
                    <SectionTitle label="Gestión" />
                    <MenuItem icon="➕" label="Crear Empleado" path="/employees/new" />
                    <MenuItem icon="📝" label="Crear Contrato" path="/contracts/new" />
                    <MenuItem icon="✅" label="Aprobaciones" path="/contract-approvals" />
                    <MenuItem icon="📊" label="Reportes" path="/reports" />
                </>
            )}

            {/* SECCIÓN: Información */}
            <SectionTitle label="Más" />
            <MenuItem icon="❓" label="Ayuda" path="/help" />
            <MenuItem icon="📱" label="Perfil" path="/profile" />
        </div>
    );
};