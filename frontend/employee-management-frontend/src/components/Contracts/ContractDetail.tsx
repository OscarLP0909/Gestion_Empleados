import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { contractService } from "../../services/contractService";
import { employeeService } from "../../services/employeeService";
import { Layout } from "../Layout/Layout";
import type { Contract } from "../../types/contract";
import type { Employee } from "../../types/employee";

export const ContractDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [contract, setContract] = useState<Contract | null>(null);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const contractData = await contractService.getById(id);
                    setContract(contractData);

                    const employeeData = await employeeService.getById(
                        (contractData as any).employeeId
                    );
                    setEmployee(employeeData);
                }
            } catch (err: any) {
                console.error("Error:", err);
                setError(err.response?.data?.message || "Error al cargar contrato");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este contrato?")) {
            try {
                await contractService.delete(id!);
                navigate("/contracts");
            } catch (err: any) {
                setError(err.response?.data?.message || "Error al eliminar contrato");
            }
        }
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

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted mt-3">Cargando contrato...</p>
                </div>
            </Layout>
        );
    }

    if (error || !contract || !employee) {
        return (
            <Layout>
                <div className="alert alert-danger mb-3">
                    {error || "Contrato no encontrado"}
                </div>
                <button
                    onClick={() => navigate("/contracts")}
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
                    onClick={() => navigate("/contracts")}
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
                                        <p className="text-muted small mb-1">Puesto</p>
                                        <p className="fw-semibold">{contract.position}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">Departamento</p>
                                        <p className="fw-semibold">{contract.department}</p>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">Categoría</p>
                                        <p className="fw-semibold">{contract.category}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">Tipo de Contrato</p>
                                        <p>
                                            <span className="badge bg-light text-dark">
                                                {contract.contractType}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">Jornada</p>
                                        <p className="fw-semibold">{contract.workdayType}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">Estado</p>
                                        <p>
                                            <span className={`badge bg-${getStatusColor(contract.status)}`}>
                                                {getStatusText(contract.status)}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">Salario ({contract.salaryType})</p>
                                        <p className="fw-semibold">{contract.salaryAmount.toFixed(2)} €</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted small mb-1">Inicio del Contrato</p>
                                        <p className="fw-semibold">
                                            {new Date(contract.startDate).toLocaleDateString("es-ES")}
                                        </p>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-12">
                                        <p className="text-muted small mb-1">Fin del Contrato</p>
                                        <p className="fw-semibold">
                                            {contract.endDate
                                                ? new Date(contract.endDate).toLocaleDateString("es-ES")
                                                : "Sin fecha de fin"}
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                <div className="d-flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => navigate(`/contracts/${(contract as any).id}/edit`)}
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
                                        onClick={() => navigate("/contracts")}
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