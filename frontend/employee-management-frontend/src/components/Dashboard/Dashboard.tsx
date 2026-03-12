import { useNavigate } from "react-router-dom";
import { useContracts } from "../../hooks/useContract";
import { useEmployees } from "../../hooks/useEmployees";
import { useContractsAdvanced } from "../../hooks/useContractsAdvanced";
import { useAuth } from "../../hooks/useAuth";  // ← AGREGAR
import { employeeService } from "../../services/employeeService";
import { Layout } from "../Layout/Layout";
import { useState, useEffect } from "react";
import type { Employee } from "../../types/employee";

const StatCard = ({
    title,
    value,
    icon,
    color,
    onClick,
}: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    onClick?: () => void;
}) => (
    <div
        className="card border-0 shadow-sm h-100"
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : "default" }}
    >
        <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
                <div>
                    <p className="text-muted small mb-2">{title}</p>
                    <h3 className="fw-bold mb-0">{value}</h3>
                </div>
                <span style={{ fontSize: "32px" }}>{icon}</span>
            </div>
        </div>
    </div>
);

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();  // ← AGREGAR
    const { contractCount, activeContractCount, finalizedContractCount } = useContracts();
    const { employeeCount, loading: employeesLoading } = useEmployees();
    const {
        upcomingExpiringContracts,
        upcomingStartingContracts,
        pendingApprovalContracts,
        loading: contractsLoading,
    } = useContractsAdvanced();
    const [employees, setEmployees] = useState<Map<string, Employee>>(new Map());

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const data = await employeeService.getAll();
            const employeeMap = new Map();
            data.forEach((emp) => {
                employeeMap.set((emp as any).id, emp);
            });
            setEmployees(employeeMap);
        } catch (err) {
            console.error("Error loading employees:", err);
        }
    };

    const getEmployeeName = (employeeId: string) => {
        const emp = employees.get(employeeId);
        return emp ? `${emp.name} ${emp.surname}` : "Empleado";
    };

    const getDaysUntilExpiry = (endDate: Date) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getExpiryColor = (days: number) => {
        if (days <= 7) return "danger";
        if (days <= 14) return "warning";
        return "info";
    };

    return (
        <Layout>
            <div className="container-fluid">
                {/* Título */}
                <div className="mb-4">
                    <h1 className="fw-bold mb-2">Dashboard</h1>
                    <p className="text-muted">
                        Resumen general de empleados y contratos
                    </p>
                </div>

                {/* Cards de estadísticas principales */}
                <div className="row mb-4">
                    <div className="col-md-6 col-lg-3 mb-4">
                        <StatCard
                            title="Total de Empleados"
                            value={employeesLoading ? "..." : employeeCount}
                            icon="👥"
                            color="#3498db"
                            onClick={() => navigate("/employees")}
                        />
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4">
                        <StatCard
                            title="Total de Contratos"
                            value={contractsLoading ? "..." : contractCount}
                            icon="📋"
                            color="#2ecc71"
                            onClick={() => navigate("/contracts")}
                        />
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4">
                        <StatCard
                            title="Contratos Activos"
                            value={contractsLoading ? "..." : activeContractCount}
                            icon="✅"
                            color="#f39c12"
                            onClick={() => navigate("/contracts")}
                        />
                    </div>
                    <div className="col-md-6 col-lg-3 mb-4">
                        <StatCard
                            title="Contratos Finalizados"
                            value={contractsLoading ? "..." : finalizedContractCount}
                            icon="🏁"
                            color="#e74c3c"
                            onClick={() => navigate("/contracts")}
                        />
                    </div>
                </div>

                {/* Sección: Próximos contratos */}
                <div className="row mb-4">
                    {/* Próximos a finalizar */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">
                                    ⏰ Próximos a Finalizar
                                </h5>
                                {contractsLoading ? (
                                    <div className="text-center py-4">
                                        <div
                                            className="spinner-border spinner-border-sm text-primary"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Cargando...
                                            </span>
                                        </div>
                                    </div>
                                ) : upcomingExpiringContracts.length === 0 ? (
                                    <p className="text-muted mb-0 text-center py-4">
                                        ✅ No hay contratos próximos a finalizar
                                    </p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-sm mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Empleado</th>
                                                    <th>Días</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {upcomingExpiringContracts.map(
                                                    (contract) => (
                                                        <tr
                                                            key={(contract as any).id}
                                                            onClick={() =>
                                                                navigate(
                                                                    `/contracts/${(contract as any).id}`
                                                                )
                                                            }
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <td className="small">
                                                                {getEmployeeName(
                                                                    (contract as any)
                                                                        .employeeId
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className={`badge bg-${getExpiryColor(
                                                                        getDaysUntilExpiry(
                                                                            contract.endDate!
                                                                        )
                                                                    )}`}
                                                                >
                                                                    {getDaysUntilExpiry(
                                                                        contract.endDate!
                                                                    )}d
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Próximos a empezar */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">
                                    🚀 Próximos a Empezar
                                </h5>
                                {contractsLoading ? (
                                    <div className="text-center py-4">
                                        <div
                                            className="spinner-border spinner-border-sm text-primary"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Cargando...
                                            </span>
                                        </div>
                                    </div>
                                ) : upcomingStartingContracts.length === 0 ? (
                                    <p className="text-muted mb-0 text-center py-4">
                                        ✅ No hay contratos próximos a empezar
                                    </p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-sm mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Empleado</th>
                                                    <th>Inicio</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {upcomingStartingContracts.map(
                                                    (contract) => (
                                                        <tr
                                                            key={(contract as any).id}
                                                            onClick={() =>
                                                                navigate(
                                                                    `/contracts/${(contract as any).id}`
                                                                )
                                                            }
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <td className="small">
                                                                {getEmployeeName(
                                                                    (contract as any)
                                                                        .employeeId
                                                                )}
                                                            </td>
                                                            <td className="small">
                                                                {new Date(
                                                                    contract.startDate
                                                                ).toLocaleDateString("es-ES")}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pendientes de aprobación */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">
                                    ⏳ Pendientes de Aprobación
                                </h5>
                                {contractsLoading ? (
                                    <div className="text-center py-4">
                                        <div
                                            className="spinner-border spinner-border-sm text-primary"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Cargando...
                                            </span>
                                        </div>
                                    </div>
                                ) : pendingApprovalContracts.length === 0 ? (
                                    <p className="text-muted mb-0 text-center py-4">
                                        ✅ No hay contratos pendientes
                                    </p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-sm mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Empleado</th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingApprovalContracts.map(
                                                    (contract) => (
                                                        <tr key={(contract as any).id}>
                                                            <td className="small">
                                                                {getEmployeeName(
                                                                    (contract as any)
                                                                        .employeeId
                                                                )}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() =>
                                                                        navigate(
                                                                            "/contract-approvals"
                                                                        )
                                                                    }
                                                                    className="btn btn-sm btn-outline-primary"
                                                                >
                                                                    Revisar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones rápidas */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">
                                    🚀 Acciones Rápidas
                                </h5>
                                <div className="row g-2">
                                    <div className="col-md-6 col-lg-4">
                                        <button
                                            onClick={() => navigate("/employees/new")}
                                            className="btn btn-primary w-100"
                                        >
                                            ➕ Nuevo Empleado
                                        </button>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <button
                                            onClick={() => navigate("/contracts/new")}
                                            className="btn btn-success w-100"
                                        >
                                            📝 Nuevo Contrato
                                        </button>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <button
                                            onClick={() => navigate("/contract-approvals")}
                                            className="btn btn-warning w-100"
                                        >
                                            ✅ Aprobar Contratos
                                        </button>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <button
                                            onClick={() => navigate("/reports")}
                                            className="btn btn-info w-100"
                                        >
                                            📊 Ver Reportes
                                        </button>
                                    </div>

                                    {/* Solo para ADMIN */}
                                    {user?.role === "ADMIN" && (
                                        <div className="col-md-6 col-lg-4">
                                            <button
                                                onClick={() => navigate("/users")}
                                                className="btn btn-secondary w-100"
                                            >
                                                👥 Gestionar Usuarios
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};