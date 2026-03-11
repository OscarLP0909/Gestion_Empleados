import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { employeeService } from "../../services/employeeService";
import { Layout } from "../Layout/Layout";
import type { Employee } from "../../types/employee";

export const EmployeeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                if (id) {
                    console.log("Fetching employee with ID:", id);
                    const data = await employeeService.getById(id);
                    console.log("Employee data received:", data);
                    setEmployee(data);
                    console.log("Employee set successfully");
                }
            } catch (err: any) {
                console.error("Error fetching employee:", err);
                setError(err.response?.data?.message || "Error al cargar empleado");
            } finally {
                setLoading(false);  // ← AGREGAR ESTO
            }
        };

        fetchEmployee();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este empleado? Esta acción no se puede deshacer.")) {
            try {
                await employeeService.delete(id!);
                navigate("/employees");
            } catch (err: any) {
                setError(err.response?.data?.message || "Error al eliminar empleado");
            }
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !employee) {
        return (
            <Layout>
                <div className="alert alert-danger mb-3">
                    {error || "Empleado no encontrado"}
                </div>
                <button
                    onClick={() => navigate("/employees")}
                    className="btn btn-secondary"
                >
                    ← Volver
                </button>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid">
                <button
                    onClick={() => navigate("/employees")}
                    className="btn btn-outline-secondary btn-sm mb-3"
                >
                    ← Volver
                </button>

                <div className="d-flex justify-content-center">
                    <div style={{ width: "100%", maxWidth: "700px" }}>
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-5">
                                <h2 className="fw-bold mb-4">
                                    {employee.name} {employee.surname}
                                </h2>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">NIF</p>
                                        <p className="fw-semibold">{employee.nif}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">Email</p>
                                        <p className="fw-semibold">{employee.email}</p>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-12">
                                        <p className="text-muted small mb-1">Teléfono</p>
                                        <p className="fw-semibold">
                                            {employee.phone || "No especificado"}
                                        </p>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <p className="text-muted small mb-1">Ciudad</p>
                                        <p className="fw-semibold">
                                            {(employee as any).city || "No especificada"}
                                        </p>
                                    </div>
                                    <div className="col-md-4">
                                        <p className="text-muted small mb-1">Provincia</p>
                                        <p className="fw-semibold">
                                            {(employee as any).province || "No especificada"}
                                        </p>
                                    </div>
                                    <div className="col-md-4">
                                        <p className="text-muted small mb-1">País</p>
                                        <p className="fw-semibold">
                                            {(employee as any).country || "No especificada"}
                                        </p>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-12">
                                        <p className="text-muted small mb-1">Estado</p>
                                        <p>
                                            <span className="badge bg-success" style={{ fontSize: "13px", padding: "6px 12px" }}>
                                                Activo
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                <div className="d-flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => navigate(`/employees/${(employee as any).id}/edit`)}
                                        className="btn btn-warning flex-grow-1"
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="btn btn-danger flex-grow-1"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                    <button
                                        onClick={() => navigate("/employees")}
                                        className="btn btn-secondary flex-grow-1"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};