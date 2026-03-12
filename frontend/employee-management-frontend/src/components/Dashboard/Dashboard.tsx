import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeeService } from "../../services/employeeService";
import { contractService } from "../../services/contractService";
import { useNotification } from "../../hooks/useNotification";
import { useAuthStore } from "../../store/authStore";
import { Layout } from "../Layout/Layout";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { Contract } from "../../types/contract";
import type { Employee } from "../../types/employee";

interface DashboardStats {
    totalEmployees: number;
    totalContracts: number;
    activeContracts: number;
    pendingContracts: number;
    approvedContracts: number;
    rejectedContracts: number;
    finalizedContracts: number;
    expiringContracts: number;
    startingSoonContracts: number;
}

interface ContractStatusData {
    name: string;
    value: number;
    color: string;
}

interface SalaryData {
    range: string;
    count: number;
}

export const Dashboard = () => {
    const navigate = useNavigate();
    const notification = useNotification();
    const { user } = useAuthStore();

    const [stats, setStats] = useState<DashboardStats>({
        totalEmployees: 0,
        totalContracts: 0,
        activeContracts: 0,
        pendingContracts: 0,
        approvedContracts: 0,
        rejectedContracts: 0,
        finalizedContracts: 0,
        expiringContracts: 0,
        startingSoonContracts: 0,
    });

    const [loading, setLoading] = useState(true);
    const [contractStatusData, setContractStatusData] = useState<ContractStatusData[]>([]);
    const [salaryDistribution, setSalaryDistribution] = useState<SalaryData[]>([]);
    const [contractTimeline, setContractTimeline] = useState<any[]>([]);
    const [recentContracts, setRecentContracts] = useState<Contract[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [employees, contracts] = await Promise.all([
                employeeService.getAll(),
                contractService.getAll(),
            ]);

            calculateStats(employees, contracts);
            processContractData(contracts);
            processSalaryData(contracts);
            processContractTimeline(contracts);
            setRecentContracts(contracts.slice(0, 5));
        } catch (err) {
            notification.error("Error", "No se pudo cargar el dashboard");
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (employees: Employee[], contracts: Contract[]) => {
        const now = new Date();
        const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const expiringContracts = contracts.filter((c) => {
            if (!c.endDate) return false;
            const endDate = new Date(c.endDate);
            return endDate > now && endDate <= thirtyDaysLater && c.status === "ACTIVO";
        }).length;

        const startingSoonContracts = contracts.filter((c) => {
            const startDate = new Date(c.startDate);
            return startDate > now && startDate <= thirtyDaysLater && c.status === "APROBADO";
        }).length;

        setStats({
            totalEmployees: employees.length,
            totalContracts: contracts.length,
            activeContracts: contracts.filter((c) => c.status === "ACTIVO").length,
            pendingContracts: contracts.filter((c) => c.status === "PENDIENTE").length,
            approvedContracts: contracts.filter((c) => c.status === "APROBADO").length,
            rejectedContracts: contracts.filter((c) => c.status === "RECHAZADO").length,
            finalizedContracts: contracts.filter((c) => c.status === "FINALIZADO").length,
            expiringContracts,
            startingSoonContracts,
        });
    };

    const processContractData = (contracts: Contract[]) => {
        const statusCounts = {
            ACTIVO: contracts.filter((c) => c.status === "ACTIVO").length,
            PENDIENTE: contracts.filter((c) => c.status === "PENDIENTE").length,
            APROBADO: contracts.filter((c) => c.status === "APROBADO").length,
            RECHAZADO: contracts.filter((c) => c.status === "RECHAZADO").length,
            FINALIZADO: contracts.filter((c) => c.status === "FINALIZADO").length,
        };

        const data: ContractStatusData[] = [
            { name: "Activos", value: statusCounts.ACTIVO, color: "#0d6efd" },
            { name: "Pendientes", value: statusCounts.PENDIENTE, color: "#ffc107" },
            { name: "Aprobados", value: statusCounts.APROBADO, color: "#28a745" },
            { name: "Rechazados", value: statusCounts.RECHAZADO, color: "#dc3545" },
            { name: "Finalizados", value: statusCounts.FINALIZADO, color: "#6c757d" },
        ];

        setContractStatusData(data);
    };

    const processSalaryData = (contracts: Contract[]) => {
        const ranges = {
            "< 1000€": 0,
            "1000€ - 2000€": 0,
            "2000€ - 3000€": 0,
            "3000€ - 4000€": 0,
            "> 4000€": 0,
        };

        contracts.forEach((c) => {
            const salary = c.salaryAmount;
            if (salary < 1000) ranges["< 1000€"]++;
            else if (salary < 2000) ranges["1000€ - 2000€"]++;
            else if (salary < 3000) ranges["2000€ - 3000€"]++;
            else if (salary < 4000) ranges["3000€ - 4000€"]++;
            else ranges["> 4000€"]++;
        });

        const data = Object.entries(ranges).map(([range, count]) => ({
            range,
            count,
        }));

        setSalaryDistribution(data);
    };

    const processContractTimeline = (contracts: Contract[]) => {
        const months: { [key: string]: number } = {};

        contracts.forEach((c) => {
            const startDate = new Date(c.startDate);
            const monthKey = `${startDate.getMonth() + 1}/${startDate.getFullYear()}`;
            months[monthKey] = (months[monthKey] || 0) + 1;
        });

        const sortedMonths = Object.entries(months)
            .sort((a, b) => {
                const [aMonth, aYear] = a[0].split("/").map(Number);
                const [bMonth, bYear] = b[0].split("/").map(Number);
                if (aYear !== bYear) return aYear - bYear;
                return aMonth - bMonth;
            })
            .slice(-6);

        const data = sortedMonths.map(([month, count]) => ({
            month,
            contratos: count,
        }));

        setContractTimeline(data);
    };

    const StatCard = ({
        title,
        value,
        icon,
        color,
        onClick,
    }: {
        title: string;
        value: number;
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
                        <p className="text-muted small mb-1">{title}</p>
                        <h3 className="fw-bold mb-0">{value}</h3>
                    </div>
                    <span className="fs-2">{icon}</span>
                </div>
                <div className="mt-3">
                    <div className="progress" style={{ height: "4px" }}>
                        <div
                            className={`progress-bar bg-${color}`}
                            style={{ width: "100%" }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted mt-3">Cargando dashboard...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="fw-bold mb-2">📊 Dashboard</h1>
                    <p className="text-muted">
                        Bienvenido, {user?.name}! Aquí está el resumen de tu empresa.
                    </p>
                </div>

                {/* Estadísticas principales */}
                <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                        <StatCard
                            title="Total Empleados"
                            value={stats.totalEmployees}
                            icon="👥"
                            color="primary"
                            onClick={() => navigate("/employees")}
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <StatCard
                            title="Total Contratos"
                            value={stats.totalContracts}
                            icon="📋"
                            color="info"
                            onClick={() => navigate("/contracts")}
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <StatCard
                            title="Contratos Activos"
                            value={stats.activeContracts}
                            icon="✅"
                            color="success"
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <StatCard
                            title="Contratos Finalizados"
                            value={stats.finalizedContracts}
                            icon="🏁"
                            color="secondary"
                        />
                    </div>
                </div>

                {/* Alertas importantes */}
                {(stats.expiringContracts > 0 || stats.startingSoonContracts > 0) && (
                    <div className="row mb-4">
                        {stats.expiringContracts > 0 && (
                            <div className="col-md-6 mb-3">
                                <div className="alert alert-warning border-start border-4 border-warning">
                                    <h6 className="fw-bold mb-2">⏰ Contratos próximos a finalizar</h6>
                                    <p className="mb-0 small">
                                        {stats.expiringContracts} contrato(s) se vencerá(n) en los próximos 30 días.
                                    </p>
                                    <button
                                        className="btn btn-sm btn-warning mt-2"
                                        onClick={() => navigate("/contracts")}
                                    >
                                        Ver contratos
                                    </button>
                                </div>
                            </div>
                        )}
                        {stats.startingSoonContracts > 0 && (
                            <div className="col-md-6 mb-3">
                                <div className="alert alert-info border-start border-4 border-info">
                                    <h6 className="fw-bold mb-2">🚀 Contratos próximos a empezar</h6>
                                    <p className="mb-0 small">
                                        {stats.startingSoonContracts} contrato(s) empezará(n) en los próximos 30 días.
                                    </p>
                                    <button
                                        className="btn btn-sm btn-info mt-2"
                                        onClick={() => navigate("/contracts")}
                                    >
                                        Ver contratos
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Gráficos */}
                <div className="row mb-4">
                    {/* Estado de contratos */}
                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">Estado de Contratos</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={contractStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {contractStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Distribución de salarios */}
                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">Distribución de Salarios</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={salaryDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="range" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#0d6efd" name="Contratos" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline de contratos */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">Timeline de Nuevos Contratos (últimos 6 meses)</h5>
                                {contractTimeline.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={contractTimeline}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="contratos"
                                                stroke="#0d6efd"
                                                dot={{ fill: "#0d6efd", r: 5 }}
                                                activeDot={{ r: 7 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-muted text-center py-5">
                                        No hay datos disponibles
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas de estados de contrato */}
                <div className="row mb-4">
                    <div className="col-md-2 mb-3">
                        <div className="card border-0 shadow-sm bg-light">
                            <div className="card-body text-center">
                                <p className="text-muted small mb-1">Pendientes</p>
                                <h4 className="fw-bold text-warning mb-0">{stats.pendingContracts}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-3">
                        <div className="card border-0 shadow-sm bg-light">
                            <div className="card-body text-center">
                                <p className="text-muted small mb-1">Aprobados</p>
                                <h4 className="fw-bold text-success mb-0">{stats.approvedContracts}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-3">
                        <div className="card border-0 shadow-sm bg-light">
                            <div className="card-body text-center">
                                <p className="text-muted small mb-1">Activos</p>
                                <h4 className="fw-bold text-info mb-0">{stats.activeContracts}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-3">
                        <div className="card border-0 shadow-sm bg-light">
                            <div className="card-body text-center">
                                <p className="text-muted small mb-1">Rechazados</p>
                                <h4 className="fw-bold text-danger mb-0">{stats.rejectedContracts}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-3">
                        <div className="card border-0 shadow-sm bg-light">
                            <div className="card-body text-center">
                                <p className="text-muted small mb-1">Finalizados</p>
                                <h4 className="fw-bold text-secondary mb-0">{stats.finalizedContracts}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 mb-3">
                        <div className="card border-0 shadow-sm bg-light">
                            <div className="card-body text-center">
                                <p className="text-muted small mb-1">Vencimiento 30d</p>
                                <h4 className="fw-bold text-danger mb-0">{stats.expiringContracts}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contratos recientes */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-4">Contratos Recientes</h5>
                                {recentContracts.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0 small">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Puesto</th>
                                                    <th>Tipo</th>
                                                    <th>Departamento</th>
                                                    <th>Salario</th>
                                                    <th>Fecha Inicio</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentContracts.map((contract) => (
                                                    <tr key={contract.id}>
                                                        <td className="fw-semibold">{contract.position}</td>
                                                        <td>{contract.contractType}</td>
                                                        <td>{contract.department}</td>
                                                        <td>
                                                            <code>{contract.salaryAmount}€</code>
                                                        </td>
                                                        <td>
                                                            {new Date(contract.startDate).toLocaleDateString(
                                                                "es-ES"
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`badge bg-${
                                                                    contract.status === "ACTIVO"
                                                                        ? "info"
                                                                        : contract.status === "PENDIENTE"
                                                                        ? "warning"
                                                                        : contract.status === "APROBADO"
                                                                        ? "success"
                                                                        : contract.status === "RECHAZADO"
                                                                        ? "danger"
                                                                        : "secondary"
                                                                }`}
                                                            >
                                                                {contract.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-muted text-center py-5 mb-0">
                                        No hay contratos disponibles
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};