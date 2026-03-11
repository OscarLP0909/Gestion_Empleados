import { useEmployees } from "../../hooks/useEmployees";
import { useContracts } from "../../hooks/useContract";
import { useNavigate } from "react-router-dom";
import { Layout } from "../Layout/Layout";

export const Dashboard = () => {
    const { employeeCount, loading: employeesLoading } = useEmployees();
    const {
        contractCount,
        approvedContractCount,
        activeContractCount,
        finalizedContractCount,
        loading: contractsLoading
    } = useContracts();
    const navigate = useNavigate();

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
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <div
                        className="p-3 rounded-circle"
                        style={{
                            backgroundColor: color + "20",
                            fontSize: "32px",
                        }}
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
                    <h1 className="fw-bold mb-2">Dashboard</h1>
                    <p className="text-muted">
                        Resumen de tu sistema de gestión de empleados y contratos.
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
                            value={
                                contractsLoading ? "..." : activeContractCount
                            }
                            icon="✅"
                            color="#f093fb"
                        />
                    </div>

                    <div className="col-md-6 col-lg-3 mb-4">
                        <StatCard
                            title="Contratos Finalizados"
                            value={
                                contractsLoading
                                    ? "..."
                                    : finalizedContractCount 
                            }
                            icon="🏁"
                            color="#ff6b6b"
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">
                                    📚 Acciones Rápidas
                                </h5>
                                <div className="row g-3">
                                    <div className="col-md-6 col-lg-3">
                                        <button
                                            onClick={() => navigate("/employees")}
                                            className="btn btn-primary w-100"
                                        >
                                            ➕ Nuevo Empleado
                                        </button>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <button
                                            onClick={() => navigate("/contracts")}
                                            className="btn btn-secondary w-100"
                                        >
                                            ➕ Nuevo Contrato
                                        </button>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <button
                                            onClick={() => navigate("/employees")}
                                            className="btn btn-info w-100"
                                        >
                                            👥 Ver Empleados
                                        </button>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <button
                                            onClick={() => navigate("/contracts")}
                                            className="btn btn-warning w-100"
                                        >
                                            📋 Ver Contratos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};