import { useEmployees } from "../../hooks/useEmployees";
import { useContracts } from "../../hooks/useContract";
import { useAuthStore } from "../../store/authStore";
import { Layout } from "../Layout/Layout";

export const Dashboard = () => {
    const { employeeCount, loading: employeesLoading } = useEmployees();
    const { contractCount, activeContractCount, loading: contractsLoading } = useContracts();
    const { user } = useAuthStore();

    const StatCard = ({
        title,
        value,
        icon,
        color,
    }: {
        title: string;
        value: number | string;
        icon: string;
        color: string;
    }) => (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <div
                        className="p-3 rounded-circle"
                        style={{ backgroundColor: color + "20", fontSize: "32px" }}
                    >
                        {icon}
                    </div>
                    <div className="ms-3">
                        <p className="text-muted mb-1">{title}</p>
                        <h4 className="mb-0 fw-bold">{value}</h4>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Layout>
            <div>
                {/* Header */}
                <div className="mb-5">
                    <h1 className="fw-bold mb-2">
                        ¡Bienvenido, {user?.email}!
                    </h1>
                    <p className="text-muted">
                        Aquí puedes gestionar empleados y contratos de tu empresa.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="row mb-5">
                    <div className="col-md-6 col-lg-3 mb-4">
                        <StatCard
                            title="Total Empleados"
                            value={employeesLoading ? "..." : employeeCount}
                            icon="👥"
                            color="#667eea"
                        />
                    </div>

                    <div className="col-md-6 col-lg-3 mb-4">
                        <StatCard
                            title="Total Contratos"
                            value={contractsLoading ? "..." : contractCount}
                            icon="📋"
                            color="#764ba2"
                        />
                    </div>

                    <div className="col-md-6 col-lg-3 mb-4">
                        <StatCard
                            title="Contratos Activos"
                            value={contractsLoading ? "..." : activeContractCount}
                            icon="✅"
                            color="#f093fb"
                        />
                    </div>

                    <div className="col-md-6 col-lg-3 mb-4">
                        <StatCard
                            title="Tu Rol"
                            value={user?.role || "N/A"}
                            icon="🔐"
                            color="#4facfe"
                        />
                    </div>
                </div>

                {/* Info Cards */}
                <div className="row">
                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">
                                    📚 Acciones Rápidas
                                </h5>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary btn-sm">
                                        ➕ Nuevo Empleado
                                    </button>
                                    <button className="btn btn-secondary btn-sm">
                                        ➕ Nuevo Contrato
                                    </button>
                                    <button className="btn btn-info btn-sm">
                                        📊 Ver Reportes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">
                                    ℹ️ Información
                                </h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <strong>Email:</strong> {user?.email}
                                    </li>
                                    <li className="mb-2">
                                        <strong>Rol:</strong>{" "}
                                        <span className="badge bg-primary">{user?.role}</span>
                                    </li>
                                    <li>
                                        <strong>Permisos:</strong>
                                        <div className="small text-muted mt-1">
                                            {["ADMIN", "HR_MANAGER"].includes(
                                                user?.role || ""
                                            )
                                                ? "✅ Crear y editar"
                                                : "❌ Solo lectura"}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};