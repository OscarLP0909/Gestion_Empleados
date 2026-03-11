import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { contractService } from "../../services/contractService";
import { employeeService } from "../../services/employeeService";
import { Layout } from "../Layout/Layout";
import type { Contract } from "../../types/contract";
import type { Employee } from "../../types/employee";

export const ContractsPage = () => {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [employees, setEmployees] = useState<Map<string, Employee>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

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

            // Crear un mapa de empleados por ID
            const employeeMap = new Map();
            employeesData.forEach((emp) => {
                employeeMap.set((emp as any).id, emp);
            });
            setEmployees(employeeMap);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar contratos");
        } finally {
            setLoading(false);
        }
    };

    const getEmployeeName = (employeeId: string) => {
        const emp = employees.get(employeeId);
        return emp ? `${emp.name} ${emp.surname}` : "Empleado no encontrado";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APROBADO":
                return "success";
            case "ACTIVO":
                return "info";
            case "PENDIENTE":
                return "warning";
            case "RECHAZADO":
                return "danger";
            case "FINALIZADO":
                return "secondary";
            default:
                return "secondary";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "APROBADO":
                return "Aprobado";
            case "ACTIVO":
                return "Activo";
            case "PENDIENTE":
                return "Pendiente";
            case "RECHAZADO":
                return "Rechazado";
            case "FINALIZADO":
                return "Finalizado";
            default:
                return status;
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este contrato?")) {
            try {
                await contractService.delete(id);
                setContracts(contracts.filter((c) => (c as any).id !== id));
            } catch (err: any) {
                setError(err.response?.data?.message || "Error al eliminar contrato");
            }
        }
    };

    const filteredContracts = contracts.filter((contract) => {
        const employeeName = getEmployeeName((contract as any).employeeId).toLowerCase();
        const term = searchTerm.toLowerCase();
        return (
            employeeName.includes(term) ||
            contract.position.toLowerCase().includes(term) ||
            contract.department.toLowerCase().includes(term)
        );
    });

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="fw-bold mb-2">Contratos</h1>
                        <p className="text-muted">
                            Gestiona todos los contratos de tu empresa
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/contracts/new")}
                        className="btn btn-primary"
                    >
                        ➕ Nuevo Contrato
                    </button>
                </div>

                {/* Mensajes */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError(null)}
                        ></button>
                    </div>
                )}

                {/* Búsqueda */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="🔍 Buscar por empleado, puesto o departamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabla */}
                <div className="card border-0 shadow-sm">
                    {loading ? (
                        <div className="card-body text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="text-muted mt-3">Cargando contratos...</p>
                        </div>
                    ) : filteredContracts.length === 0 ? (
                        <div className="card-body text-center py-5">
                            <p className="text-muted mb-0">
                                {searchTerm
                                    ? "No se encontraron contratos con esos criterios"
                                    : "No hay contratos registrados"}
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: "18%" }}>Empleado</th>
                                        <th style={{ width: "12%" }}>Departamento</th>
                                        <th style={{ width: "12%" }}>Puesto</th>
                                        <th style={{ width: "10%" }}>Tipo</th>
                                        <th style={{ width: "10%" }}>Estado</th>
                                        <th style={{ width: "10%" }}>Inicio</th>
                                        <th style={{ width: "10%" }}>Fin</th>
                                        <th style={{ width: "12%" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredContracts.map((contract) => (
                                        <tr key={(contract as any).id}>
                                            <td className="fw-semibold">
                                                {getEmployeeName((contract as any).employeeId)}
                                            </td>
                                            <td>{contract.department}</td>
                                            <td>{contract.position}</td>
                                            <td>
                                                <span className="badge bg-light text-dark">
                                                    {contract.contractType}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge bg-${getStatusColor(contract.status)}`}>
                                                    {getStatusText(contract.status)}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(contract.startDate).toLocaleDateString("es-ES")}
                                            </td>
                                            <td>
                                                {contract.endDate
                                                    ? new Date(contract.endDate).toLocaleDateString("es-ES")
                                                    : "-"}
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <button
                                                        onClick={() => navigate(`/contracts/${(contract as any).id}`)}
                                                        className="btn btn-outline-primary"
                                                        title="Ver detalles"
                                                    >
                                                        👁️
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/contracts/${(contract as any).id}/edit`)}
                                                        className="btn btn-outline-warning"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete((contract as any).id)}
                                                        className="btn btn-outline-danger"
                                                        title="Eliminar"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer con estadísticas */}
                    {!loading && filteredContracts.length > 0 && (
                        <div className="card-footer bg-light text-muted small">
                            Mostrando {filteredContracts.length} de {contracts.length} contratos
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};