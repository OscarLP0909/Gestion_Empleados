import { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { contractService } from "../../services/contractService";
import { employeeService } from "../../services/employeeService";
import { Layout } from "../Layout/Layout";
import type { Contract } from "../../types/contract";
import type { Employee } from "../../types/employee";

export const ReportsPage = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [contractsData, employeesData] = await Promise.all([
                contractService.getAll(),
                employeeService.getAll(),
            ]);
            setContracts(contractsData);
            setEmployees(employeesData);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    // Datos para gráfico de estados de contratos
    const statusData = [
        {
            name: "Pendiente",
            value: contracts.filter((c) => c.status === "PENDIENTE").length,
        },
        {
            name: "Aprobado",
            value: contracts.filter((c) => c.status === "APROBADO").length,
        },
        {
            name: "Activo",
            value: contracts.filter((c) => c.status === "ACTIVO").length,
        },
        {
            name: "Rechazado",
            value: contracts.filter((c) => c.status === "RECHAZADO").length,
        },
        {
            name: "Finalizado",
            value: contracts.filter((c) => c.status === "FINALIZADO").length,
        },
    ].filter((d) => d.value > 0);

    // Datos para gráfico de contratos por departamento
    const departmentData = contracts.reduce(
        (acc: any[], contract) => {
            const existing = acc.find((d) => d.name === contract.department);
            if (existing) {
                existing.value += 1;
            } else {
                acc.push({ name: contract.department, value: 1 });
            }
            return acc;
        },
        []
    );

    // Datos para gráfico de contratos por tipo
    const typeData = contracts.reduce(
        (acc: any[], contract) => {
            const existing = acc.find((d) => d.name === contract.contractType);
            if (existing) {
                existing.value += 1;
            } else {
                acc.push({ name: contract.contractType, value: 1 });
            }
            return acc;
        },
        []
    );

    // Gasto total en nómina por departamento
    const salaryByDepartment = contracts.reduce(
        (acc: any[], contract) => {
            const existing = acc.find((d) => d.name === contract.department);
            if (existing) {
                existing.salary += contract.salaryAmount;
            } else {
                acc.push({ name: contract.department, salary: contract.salaryAmount });
            }
            return acc;
        },
        []
    );

    // Estadísticas generales
    const stats = {
        totalContracts: contracts.length,
        totalEmployees: employees.length,
        pendingContracts: contracts.filter((c) => c.status === "PENDIENTE").length,
        activeContracts: contracts.filter((c) => c.status === "ACTIVO").length,
        totalSalary: contracts.reduce((sum, c) => sum + c.salaryAmount, 0),
        approvalRate: contracts.length > 0
            ? Math.round(
                  ((contracts.filter((c) => c.status !== "PENDIENTE").length /
                      contracts.length) *
                      100)
              )
            : 0,
    };

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted mt-3">Cargando reportes...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="alert alert-danger">
                    <strong>Error:</strong> {error}
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="fw-bold mb-2">Reportes</h1>
                    <p className="text-muted">
                        Estadísticas y análisis de empleados y contratos
                    </p>
                </div>

                {/* Tarjetas de estadísticas */}
                <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <p className="text-muted small mb-1">Total de Contratos</p>
                                <h4 className="fw-bold mb-0">{stats.totalContracts}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <p className="text-muted small mb-1">Total de Empleados</p>
                                <h4 className="fw-bold mb-0">{stats.totalEmployees}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <p className="text-muted small mb-1">Contratos Activos</p>
                                <h4 className="fw-bold mb-0 text-success">
                                    {stats.activeContracts}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <p className="text-muted small mb-1">Tasa de Aprobación</p>
                                <h4 className="fw-bold mb-0">{stats.approvalRate}%</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="row mb-4">
                    {/* Gráfico de estados */}
                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">
                                    Estado de Contratos
                                </h5>
                                {statusData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, value }) =>
                                                    `${name}: ${value}`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-muted text-center py-5">
                                        Sin datos disponibles
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Gráfico de contratos por tipo */}
                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">
                                    Contratos por Tipo
                                </h5>
                                {typeData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={typeData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-muted text-center py-5">
                                        Sin datos disponibles
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    {/* Gráfico de contratos por departamento */}
                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">
                                    Contratos por Departamento
                                </h5>
                                {departmentData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={departmentData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={100} />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#00C49F" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-muted text-center py-5">
                                        Sin datos disponibles
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Gráfico de gasto en nómina */}
                    <div className="col-lg-6 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">
                                    Gasto en Nómina por Departamento
                                </h5>
                                {salaryByDepartment.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={salaryByDepartment}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value: any) =>
                                                    `${value.toFixed(2)} €`
                                                }
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="salary"
                                                stroke="#FF8042"
                                                name="Salario Total"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-muted text-center py-5">
                                        Sin datos disponibles
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de gasto total */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">
                                    Resumen de Gastos
                                </h5>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Concepto</th>
                                                <th className="text-end">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="fw-semibold">
                                                    Gasto Total en Nómina
                                                </td>
                                                <td className="text-end fw-bold">
                                                    {stats.totalSalary.toFixed(2)} €
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Promedio por Contrato</td>
                                                <td className="text-end">
                                                    {stats.totalContracts > 0
                                                        ? (
                                                            stats.totalSalary /
                                                            stats.totalContracts
                                                        ).toFixed(2)
                                                        : 0}{" "}
                                                    €
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Promedio por Empleado</td>
                                                <td className="text-end">
                                                    {stats.totalEmployees > 0
                                                        ? (
                                                            stats.totalSalary /
                                                            stats.totalEmployees
                                                        ).toFixed(2)
                                                        : 0}{" "}
                                                    €
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};