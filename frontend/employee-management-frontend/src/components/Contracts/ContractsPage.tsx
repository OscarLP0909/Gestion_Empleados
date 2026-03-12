import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { contractService } from "../../services/contractService";
import { useNotification } from "../../hooks/useNotification";
import { Layout } from "../Layout/Layout";
import type { Contract } from "../../types/contract";

export const ContractsPage = () => {
    const navigate = useNavigate();
    const notification = useNotification();

    const [contracts, setContracts] = useState<Contract[]>([]);
    const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Estados de búsqueda y filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "",
        contractType: "",
        department: "",
        sortBy: "startDate",
        sortOrder: "desc",
    });

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            const data = await contractService.getAll();
            setContracts(data);
            applyFilters(data, searchTerm, filters);
        } catch (err) {
            notification.error("Error", "No se pudieron cargar los contratos");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = useCallback(
        (data: Contract[], search: string, filtersData: typeof filters) => {
            let result = data;

            if (search.trim()) {
                const searchLower = search.toLowerCase();
                result = result.filter(
                    (contract) =>
                        contract.position.toLowerCase().includes(searchLower) ||
                        contract.category.toLowerCase().includes(searchLower) ||
                        contract.department.toLowerCase().includes(searchLower)
                );
            }

            if (filtersData.status) {
                result = result.filter((contract) => contract.status === filtersData.status);
            }

            if (filtersData.contractType) {
                result = result.filter(
                    (contract) => contract.contractType === filtersData.contractType
                );
            }

            if (filtersData.department) {
                result = result.filter(
                    (contract) => contract.department === filtersData.department
                );
            }

            result = result.sort((a, b) => {
                let compareA: any = a[filtersData.sortBy as keyof Contract];
                let compareB: any = b[filtersData.sortBy as keyof Contract];

                if (typeof compareA === "string") {
                    compareA = compareA.toLowerCase();
                    compareB = (compareB as string).toLowerCase();
                }

                if (filtersData.sortOrder === "asc") {
                    return compareA > compareB ? 1 : -1;
                } else {
                    return compareA < compareB ? 1 : -1;
                }
            });

            setFilteredContracts(result);
        },
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        applyFilters(contracts, value, filters);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        applyFilters(contracts, searchTerm, newFilters);
    };

    const resetFilters = () => {
        setSearchTerm("");
        setFilters({
            status: "",
            contractType: "",
            department: "",
            sortBy: "startDate",
            sortOrder: "desc",
        });
        applyFilters(contracts, "", {
            status: "",
            contractType: "",
            department: "",
            sortBy: "startDate",
            sortOrder: "desc",
        });
    };

    const departments = Array.from(new Set(contracts.map((c) => c.department))).sort();
    const contractTypes = Array.from(new Set(contracts.map((c) => c.contractType))).sort();

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este contrato?")) {
            try {
                await contractService.delete(id);
                notification.success("¡Éxito!", "Contrato eliminado correctamente");
                fetchContracts();
            } catch (err) {
                notification.error("Error", "No se pudo eliminar el contrato");
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

    return (
        <Layout>
            <div className="container-fluid">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="fw-bold mb-2">📋 Contratos</h1>
                        <p className="text-muted">
                            Total: {filteredContracts.length} de {contracts.length} contratos
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/contracts/new")}
                        className="btn btn-primary"
                    >
                        ➕ Nuevo Contrato
                    </button>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                                🔍
                            </span>
                            <input
                                type="text"
                                className="form-control form-control-lg border-0"
                                placeholder="Buscar por puesto, categoría o departamento..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            >
                                ⚙️ Filtros {showAdvancedFilters ? "▼" : "▶"}
                            </button>
                        </div>
                    </div>
                </div>

                {showAdvancedFilters && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <h6 className="fw-bold mb-3">Filtros Avanzados</h6>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">Estado</label>
                                    <select
                                        className="form-select form-select-sm"
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="PENDIENTE">Pendiente</option>
                                        <option value="APROBADO">Aprobado</option>
                                        <option value="ACTIVO">Activo</option>
                                        <option value="RECHAZADO">Rechazado</option>
                                        <option value="FINALIZADO">Finalizado</option>
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">
                                        Tipo de Contrato
                                    </label>
                                    <select
                                        className="form-select form-select-sm"
                                        name="contractType"
                                        value={filters.contractType}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Todos los tipos</option>
                                        {contractTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">
                                        Departamento
                                    </label>
                                    <select
                                        className="form-select form-select-sm"
                                        name="department"
                                        value={filters.department}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Todos los departamentos</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">
                                        Ordenar por
                                    </label>
                                    <select
                                        className="form-select form-select-sm"
                                        name="sortBy"
                                        value={filters.sortBy}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="startDate">Fecha inicio</option>
                                        <option value="position">Puesto</option>
                                        <option value="salaryAmount">Salario</option>
                                    </select>
                                </div>

                                <div className="col-md-12 d-flex gap-2">
                                    <select
                                        className="form-select form-select-sm"
                                        name="sortOrder"
                                        value={filters.sortOrder}
                                        onChange={handleFilterChange}
                                        style={{ maxWidth: "150px" }}
                                    >
                                        <option value="asc">Ascendente ↑</option>
                                        <option value="desc">Descendente ↓</option>
                                    </select>
                                    <button
                                        onClick={resetFilters}
                                        className="btn btn-outline-secondary btn-sm flex-grow-1"
                                    >
                                        Limpiar todos los filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card border-0 shadow-sm">
                    {loading ? (
                        <div className="card-body text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : filteredContracts.length === 0 ? (
                        <div className="card-body text-center py-5">
                            <p className="text-muted mb-0">No se encontraron contratos</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 small">
                                <thead className="table-light">
                                    <tr>
                                        <th>Puesto</th>
                                        <th>Tipo</th>
                                        <th>Categoría</th>
                                        <th>Departamento</th>
                                        <th>Salario</th>
                                        <th>Fecha Inicio</th>
                                        <th>Fecha Fin</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredContracts.map((contract) => (
                                        <tr key={contract.id}>
                                            <td className="fw-semibold">{contract.position}</td>
                                            <td>{contract.contractType}</td>
                                            <td>{contract.category}</td>
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
                                                {contract.endDate ? (
                                                    new Date(contract.endDate).toLocaleDateString("es-ES")
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge bg-${getStatusColor(
                                                        contract.status
                                                    )}`}
                                                >
                                                    {getStatusText(contract.status)}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/contracts/${contract.id}`
                                                        )
                                                    }
                                                    className="btn btn-sm btn-info me-2"
                                                >
                                                    👁️ Ver
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/contracts/${contract.id}/edit`
                                                        )
                                                    }
                                                    className="btn btn-sm btn-warning me-2"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(contract.id)
                                                    }
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};