import { useState, useEffect } from "react";
import { contractService } from "../../services/contractService";
import { employeeService } from "../../services/employeeService";
import { useNotification } from "../../hooks/useNotification";
import { Layout } from "../Layout/Layout";
import type { Contract } from "../../types/contract";
import type { Employee } from "../../types/employee";

export const ContractApprovalsPage = () => {
    const notification = useNotification();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [employees, setEmployees] = useState<Map<string, Employee>>(new Map());
    const [loading, setLoading] = useState(false);
    const [approving, setApproving] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [contractsResponse, employeesResponse] = await Promise.all([
                contractService.getAll(),
                employeeService.getAll(),
            ]);

            const pending = contractsResponse.filter((c) => c.status === "PENDIENTE");
            setContracts(pending);

            // Crear mapa de empleados
            const employeeMap = new Map();
            employeesResponse.forEach((emp) => {
                employeeMap.set((emp as any).id, emp);
            });
            setEmployees(employeeMap);
        } catch (err: any) {
            notification.error(
                "Error",
                err.response?.data?.message || "Error al cargar contratos pendientes"
            );
        } finally {
            setLoading(false);
        }
    };

    const getEmployeeName = (employeeId: string) => {
        const emp = employees.get(employeeId);
        return emp ? `${emp.name} ${emp.surname}` : "Empleado no encontrado";
    };

    const handleApprove = async (contractId: string, startDate: Date) => {
        if (!window.confirm("¿Aprobar este contrato?")) return;

        setApproving(contractId);
        try {
            // Determinar si el contrato debe ser ACTIVO o APROBADO
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const contractStart = new Date(startDate);
            contractStart.setHours(0, 0, 0, 0);

            const newStatus = contractStart.getTime() === today.getTime() ? "ACTIVO" : "APROBADO";

            await contractService.updateStatus(contractId, newStatus as any);

            setContracts(contracts.filter((c) => (c as any).id !== contractId));

            notification.success("¡Éxito!", "Contrato aprobado correctamente");
        } catch (err: any) {
            notification.error(
                "Error",
                err.response?.data?.message || "Error al aprobar contrato"
            );
        } finally {
            setApproving(null);
        }
    };

    const handleReject = async (contractId: string) => {
        if (!window.confirm("¿Rechazar este contrato?")) return;

        setApproving(contractId);
        try {
            await contractService.updateStatus(contractId, "RECHAZADO");

            // Remover del listado
            setContracts(contracts.filter((c) => (c as any).id !== contractId));

            notification.success("¡Éxito!", "Contrato rechazado correctamente");
        } catch (err: any) {
            notification.error(
                "Error",
                err.response?.data?.message || "Error al rechazar contrato"
            );
        } finally {
            setApproving(null);
        }
    };

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="fw-bold mb-2">Aprobaciones de Contratos</h1>
                    <p className="text-muted">
                        Revisa y aprueba los contratos pendientes
                    </p>
                </div>

                {/* Contratos */}
                <div className="row g-4">
                    {loading ? (
                        <div className="col-12">
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                                <p className="text-muted mt-3">Cargando contratos pendientes...</p>
                            </div>
                        </div>
                    ) : contracts.length === 0 ? (
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body text-center py-5">
                                    <p className="text-muted mb-0">
                                        ✅ No hay contratos pendientes de aprobación
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        contracts.map((contract) => (
                            <div key={(contract as any).id} className="col-lg-6">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="fw-bold mb-1">
                                                    {getEmployeeName((contract as any).employeeId)}
                                                </h5>
                                                <p className="text-muted small mb-0">
                                                    {contract.position}
                                                </p>
                                            </div>
                                            <span className="badge bg-warning text-dark">Pendiente</span>
                                        </div>

                                        <hr />

                                        <div className="row g-3 small mb-4">
                                            <div className="col-md-6">
                                                <p className="text-muted mb-1">Departamento</p>
                                                <p className="fw-semibold">{contract.department}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="text-muted mb-1">Categoría</p>
                                                <p className="fw-semibold">{contract.category}</p>
                                            </div>
                                        </div>

                                        <div className="row g-3 small mb-4">
                                            <div className="col-md-6">
                                                <p className="text-muted mb-1">Tipo de Contrato</p>
                                                <p className="fw-semibold">{contract.contractType}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="text-muted mb-1">Jornada</p>
                                                <p className="fw-semibold">{contract.workdayType}</p>
                                            </div>
                                        </div>

                                        <div className="row g-3 small mb-4">
                                            <div className="col-md-6">
                                                <p className="text-muted mb-1">Salario ({contract.salaryType})</p>
                                                <p className="fw-semibold">{contract.salaryAmount.toFixed(2)} €</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="text-muted mb-1">Inicio</p>
                                                <p className="fw-semibold">
                                                    {new Date(contract.startDate).toLocaleDateString("es-ES")}
                                                </p>
                                            </div>
                                        </div>

                                        <hr />

                                        <div className="d-flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleApprove(
                                                        (contract as any).id,
                                                        contract.startDate
                                                    )
                                                }
                                                disabled={approving === (contract as any).id}
                                                className="btn btn-success flex-grow-1"
                                            >
                                                {approving === (contract as any).id ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            role="status"
                                                            aria-hidden="true"
                                                        ></span>
                                                        Aprobando...
                                                    </>
                                                ) : (
                                                    "✅ Aprobar"
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleReject((contract as any).id)}
                                                disabled={approving === (contract as any).id}
                                                className="btn btn-danger flex-grow-1"
                                            >
                                                {approving === (contract as any).id ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            role="status"
                                                            aria-hidden="true"
                                                        ></span>
                                                        Rechazando...
                                                    </>
                                                ) : (
                                                    "❌ Rechazar"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};