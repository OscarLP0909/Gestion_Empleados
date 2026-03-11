import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeeService } from "../../services/employeeService";
import { Layout } from "../Layout/Layout";
import type { Employee } from "../../types/employee";
import { exportService } from "../../services/exportService";

export const EmployeesPage = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await employeeService.getAll();
            setEmployees(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar empleados");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id) {
            setError("Error: ID de empleado no encontrado");
            return;
        }
        if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
            try {
                await employeeService.delete(id);
                setEmployees(employees.filter((e) => (e as any).id !== id));
            } catch (err: any) {
                setError(err.response?.data?.message || "Error al eliminar empleado");
            }
        }
    };

    const filteredEmployees = employees.filter(
        (emp) =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.nif.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="fw-bold mb-2">Empleados</h1>
                        <p className="text-muted">Gestiona todos los empleados de tu empresa</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            onClick={() => exportService.exportEmployeesToPDF(filteredEmployees)}
                            className="btn btn-success"
                            title="Descargar PDF"
                        >
                            📥 Exportar PDF
                        </button>
                        <button
                            onClick={() => navigate("/employees/new")}
                            className="btn btn-primary"
                        >
                            ➕ Nuevo Empleado
                        </button>
                    </div>
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
                            placeholder="🔍 Buscar por nombre, apellido o NIF..."
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
                            <p className="text-muted mt-3">Cargando empleados...</p>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="card-body text-center py-5">
                            <p className="text-muted mb-0">
                                {searchTerm
                                    ? "No se encontraron empleados con esos criterios"
                                    : "No hay empleados registrados"}
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: "20%" }}>Nombre</th>
                                        <th style={{ width: "20%" }}>Apellido</th>
                                        <th style={{ width: "15%" }}>NIF</th>
                                        <th style={{ width: "20%" }}>Teléfono</th>
                                        <th style={{ width: "15%" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((emp, index) => (
                                        <tr key={emp.id || index}>
                                            <td className="fw-semibold">{emp.name}</td>
                                            <td>{emp.surname}</td>
                                            <td>
                                                <span className="badge bg-light text-dark">
                                                    {emp.nif}
                                                </span>
                                            </td>
                                            <td>
                                                {emp.phone ? (
                                                    <span>{emp.phone}</span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <button
                                                        onClick={() => {
                                                            const empId = (emp as any).id;
                                                            console.log("Employee ID:", empId);
                                                            navigate(`/employees/${empId}`);
                                                        }}
                                                        className="btn btn-outline-primary"
                                                        title="Ver detalles"
                                                    >
                                                        👁️
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/employees/${(emp as any).id}/edit`)}
                                                        className="btn btn-outline-warning"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete((emp as any).id)}
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
                    {!loading && filteredEmployees.length > 0 && (
                        <div className="card-footer bg-light text-muted small">
                            Mostrando {filteredEmployees.length} de {employees.length} empleados
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};