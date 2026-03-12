import { useState, useEffect } from "react";
import { auditService } from "../../services/auditService";
import { useNotification } from "../../hooks/useNotification";
import { Layout } from "../Layout/Layout";
import type { AuditLog } from "../../types/audit";

export const AuditPage = () => {
    const notification = useNotification();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    const [filters, setFilters] = useState({
        userId: "",
        action: "",
        entityType: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        fetchLogs();
    }, [page, filters]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const result = await auditService.getLogs(page, 20, filters);
            setLogs(result.logs);
            setTotal(result.total);
            setPages(result.pages);
        } catch (err) {
            notification.error("Error", "No se pudieron cargar los registros de auditoría");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPage(1);
    };

    const resetFilters = () => {
        setFilters({
            userId: "",
            action: "",
            entityType: "",
            startDate: "",
            endDate: "",
        });
        setPage(1);
    };

    const getActionBadgeColor = (action: string) => {
        switch (action) {
            case "CREATE":
                return "success";
            case "UPDATE":
                return "warning";
            case "DELETE":
                return "danger";
            case "STATUS_CHANGE":
                return "info";
            case "ROLE_CHANGE":
                return "primary";
            default:
                return "secondary";
        }
    };

    const getActionText = (action: string) => {
        switch (action) {
            case "CREATE":
                return "Crear";
            case "UPDATE":
                return "Editar";
            case "DELETE":
                return "Eliminar";
            case "STATUS_CHANGE":
                return "Cambio de Estado";
            case "ROLE_CHANGE":
                return "Cambio de Rol";
            default:
                return action;
        }
    };

    const getEntityText = (entityType: string) => {
        switch (entityType) {
            case "EMPLOYEE":
                return "Empleado";
            case "CONTRACT":
                return "Contrato";
            case "USER":
                return "Usuario";
            default:
                return entityType;
        }
    };

    // Comparar cambios - SOLO MUESTRA LO QUE CAMBIÓ
    const getDifferences = (before: any, after: any) => {
        const allKeys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
        const differences: { key: string; before: any; after: any }[] = [];

        allKeys.forEach((key) => {
            // Ignorar campos de metadata
            if (["_id", "id", "createdAt", "updatedAt", "__v"].includes(key)) {
                return;
            }

            const beforeValue = before?.[key];
            const afterValue = after?.[key];
            const changed = JSON.stringify(beforeValue) !== JSON.stringify(afterValue);

            // SOLO AGREGAR SI CAMBIÓ
            if (changed) {
                differences.push({
                    key,
                    before: beforeValue,
                    after: afterValue,
                });
            }
        });

        return differences;
    };

    // Formatear valores para mostrar
    const formatValue = (value: any) => {
        if (value === null || value === undefined) return "—";
        if (typeof value === "boolean") return value ? "Sí" : "No";
        if (typeof value === "object") return JSON.stringify(value);
        return String(value);
    };

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="fw-bold mb-2">📋 Auditoría del Sistema</h1>
                    <p className="text-muted">
                        Registro de todas las acciones realizadas en el sistema
                    </p>
                </div>

                {/* Filtros */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="card-title fw-bold mb-3">Filtros</h5>
                        <div className="row g-3">
                            <div className="col-md-2">
                                <label className="form-label small fw-semibold">Usuario</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    name="userId"
                                    placeholder="ID del usuario"
                                    value={filters.userId}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small fw-semibold">Acción</label>
                                <select
                                    className="form-select form-select-sm"
                                    name="action"
                                    value={filters.action}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Todas</option>
                                    <option value="CREATE">Crear</option>
                                    <option value="UPDATE">Editar</option>
                                    <option value="DELETE">Eliminar</option>
                                    <option value="STATUS_CHANGE">Cambio de Estado</option>
                                    <option value="ROLE_CHANGE">Cambio de Rol</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small fw-semibold">Entidad</label>
                                <select
                                    className="form-select form-select-sm"
                                    name="entityType"
                                    value={filters.entityType}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Todas</option>
                                    <option value="EMPLOYEE">Empleado</option>
                                    <option value="CONTRACT">Contrato</option>
                                    <option value="USER">Usuario</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small fw-semibold">Desde</label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small fw-semibold">Hasta</label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                                <button
                                    onClick={resetFilters}
                                    className="btn btn-outline-secondary btn-sm w-100"
                                >
                                    Limpiar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="card border-0 shadow-sm">
                    {loading ? (
                        <div className="card-body text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="card-body text-center py-5">
                            <p className="text-muted mb-0">No hay registros de auditoría</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 small">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: "15%" }}>Usuario</th>
                                        <th style={{ width: "10%" }}>Acción</th>
                                        <th style={{ width: "10%" }}>Entidad</th>
                                        <th style={{ width: "25%" }}>Descripción</th>
                                        <th style={{ width: "18%" }}>Fecha y Hora</th>
                                        <th style={{ width: "12%" }}>Cambios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log._id}>
                                            <td>
                                                <small>
                                                    <strong>{log.userId.name}</strong>
                                                    <br />
                                                    <span className="text-muted">
                                                        {log.userId.email}
                                                    </span>
                                                </small>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge bg-${getActionBadgeColor(
                                                        log.action
                                                    )}`}
                                                >
                                                    {getActionText(log.action)}
                                                </span>
                                            </td>
                                            <td>
                                                <small>{getEntityText(log.entityType)}</small>
                                            </td>
                                            <td>
                                                <small>{log.description}</small>
                                            </td>
                                            <td>
                                                <small>
                                                    {new Date(log.createdAt).toLocaleString(
                                                        "es-ES"
                                                    )}
                                                </small>
                                            </td>
                                            <td>
                                                {log.changes?.before || log.changes?.after ? (
                                                    <button
                                                        className="btn btn-sm btn-outline-info"
                                                        onClick={() => setSelectedLog(log)}
                                                    >
                                                        Ver
                                                    </button>
                                                ) : (
                                                    <span className="text-muted small">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Paginación */}
                    {pages > 1 && (
                        <div className="card-footer bg-light">
                            <nav aria-label="Page navigation">
                                <ul className="pagination mb-0 justify-content-center">
                                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                        >
                                            ← Anterior
                                        </button>
                                    </li>
                                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                                        <li
                                            key={p}
                                            className={`page-item ${page === p ? "active" : ""}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => setPage(p)}
                                            >
                                                {p}
                                            </button>
                                        </li>
                                    ))}
                                    <li
                                        className={`page-item ${page === pages ? "disabled" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === pages}
                                        >
                                            Siguiente →
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="card-footer bg-light text-muted small">
                        Total de registros: {total}
                    </div>
                </div>
            </div>

            {/* Modal de cambios - SOLO MUESTRA CAMBIOS */}
            {selectedLog && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    tabIndex={-1}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            {/* Header */}
                            <div
                                className="modal-header border-0"
                                style={{
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                }}
                            >
                                <div>
                                    <h5 className="modal-title fw-bold text-white mb-1">
                                        📝 Cambios Realizados
                                    </h5>
                                    <small className="text-white-50">
                                        {selectedLog.description}
                                    </small>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setSelectedLog(null)}
                                ></button>
                            </div>

                            {/* Body */}
                            <div className="modal-body p-4">
                                {/* Información del cambio */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-3 text-muted fw-semibold">
                                                    ℹ️ Información General
                                                </h6>
                                                <div className="mb-2">
                                                    <small className="text-muted d-block">Usuario</small>
                                                    <strong>{selectedLog.userId.name}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        {selectedLog.userId.email}
                                                    </small>
                                                </div>
                                                <div className="mb-2">
                                                    <small className="text-muted d-block">
                                                        Tipo de Acción
                                                    </small>
                                                    <span
                                                        className={`badge bg-${getActionBadgeColor(
                                                            selectedLog.action
                                                        )} fs-6`}
                                                    >
                                                        {getActionText(selectedLog.action)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card border-0 bg-light">
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-3 text-muted fw-semibold">
                                                    🎯 Entidad Afectada
                                                </h6>
                                                <div className="mb-2">
                                                    <small className="text-muted d-block">Tipo</small>
                                                    <strong>
                                                        {getEntityText(selectedLog.entityType)}
                                                    </strong>
                                                </div>
                                                <div className="mb-2">
                                                    <small className="text-muted d-block">
                                                        Nombre/Descripción
                                                    </small>
                                                    <strong>{selectedLog.entityName}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comparación de cambios */}
                                {getDifferences(
                                    selectedLog.changes?.before,
                                    selectedLog.changes?.after
                                ).length > 0 ? (
                                    <>
                                        <h6 className="fw-bold mb-3 border-bottom pb-2">
                                            🔄 Campos Modificados ({getDifferences(
                                                selectedLog.changes?.before,
                                                selectedLog.changes?.after
                                            ).length}{" "}
                                            cambios)
                                        </h6>
                                        <div className="row">
                                            {getDifferences(
                                                selectedLog.changes?.before,
                                                selectedLog.changes?.after
                                            ).map((diff) => (
                                                <div key={diff.key} className="col-md-12 mb-3">
                                                    <div className="card border-warning border-2">
                                                        <div className="card-body p-3">
                                                            <div className="row align-items-center">
                                                                <div className="col-md-3">
                                                                    <h6 className="fw-bold mb-0 text-capitalize">
                                                                        {diff.key}
                                                                    </h6>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <small className="text-muted d-block mb-1">
                                                                        Antes
                                                                    </small>
                                                                    <div className="bg-danger bg-opacity-10 p-2 rounded small border-start border-danger border-3">
                                                                        <code className="text-danger">
                                                                            {formatValue(
                                                                                diff.before
                                                                            )}
                                                                        </code>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-1 text-center">
                                                                    <span className="badge bg-warning text-dark">
                                                                        →
                                                                    </span>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <small className="text-muted d-block mb-1">
                                                                        Después
                                                                    </small>
                                                                    <div className="bg-success bg-opacity-10 p-2 rounded small border-start border-success border-3">
                                                                        <code className="text-success">
                                                                            {formatValue(
                                                                                diff.after
                                                                            )}
                                                                        </code>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="alert alert-info" role="alert">
                                        ℹ️ No hay cambios detallados disponibles para este
                                        registro
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="modal-footer bg-light border-top">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedLog(null)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};