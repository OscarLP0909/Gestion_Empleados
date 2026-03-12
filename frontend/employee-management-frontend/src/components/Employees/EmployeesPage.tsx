import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { employeeService } from "../../services/employeeService";
import { useNotification } from "../../hooks/useNotification";
import { Layout } from "../Layout/Layout";
import type { Employee } from "../../types/employee";

export const EmployeesPage = () => {
    const navigate = useNavigate();
    const notification = useNotification();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Estados de búsqueda y filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        province: "",
        country: "",
        sortBy: "name", // name, email, nif
        sortOrder: "asc", // asc, desc
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const data = await employeeService.getAll();
            setEmployees(data);
            applyFilters(data, searchTerm, filters);
        } catch (err) {
            notification.error("Error", "No se pudieron cargar los empleados");
        } finally {
            setLoading(false);
        }
    };

    // Aplicar filtros y búsqueda
    const applyFilters = useCallback(
        (data: Employee[], search: string, filtersData: typeof filters) => {
            let result = data;

            // Búsqueda por texto
            if (search.trim()) {
                const searchLower = search.toLowerCase();
                result = result.filter(
                    (emp) =>
                        emp.name.toLowerCase().includes(searchLower) ||
                        emp.surname.toLowerCase().includes(searchLower) ||
                        emp.email.toLowerCase().includes(searchLower) ||
                        emp.nif.toLowerCase().includes(searchLower) ||
                        emp.phone?.includes(search)
                );
            }

            // Filtro por provincia
            if (filtersData.province) {
                result = result.filter((emp) => emp.province === filtersData.province);
            }

            // Filtro por país
            if (filtersData.country) {
                result = result.filter((emp) => emp.country === filtersData.country);
            }

            // Ordenar
            result = result.sort((a, b) => {
                let compareA: any = a[filtersData.sortBy as keyof Employee];
                let compareB: any = b[filtersData.sortBy as keyof Employee];

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

            setFilteredEmployees(result);
        },
        []
    );

    // Manejar cambio en búsqueda
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        applyFilters(employees, value, filters);
    };

    // Manejar cambio en filtros
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        applyFilters(employees, searchTerm, newFilters);
    };

    // Limpiar filtros
    const resetFilters = () => {
        setSearchTerm("");
        setFilters({
            province: "",
            country: "",
            sortBy: "name",
            sortOrder: "asc",
        });
        applyFilters(employees, "", {
            province: "",
            country: "",
            sortBy: "name",
            sortOrder: "asc",
        });
    };

    // Obtener lista de provincias y países únicos
    const provinces = Array.from(new Set(employees.map((e) => e.province))).sort();
    const countries = Array.from(new Set(employees.map((e) => e.country))).sort();

    // Eliminar empleado
    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este empleado?")) {
            try {
                await employeeService.delete(id);
                notification.success("¡Éxito!", "Empleado eliminado correctamente");
                fetchEmployees();
            } catch (err) {
                notification.error("Error", "No se pudo eliminar el empleado");
            }
        }
    };

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="fw-bold mb-2">👥 Empleados</h1>
                        <p className="text-muted">
                            Total: {filteredEmployees.length} de {employees.length} empleados
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/employees/new")}
                        className="btn btn-primary"
                    >
                        ➕ Nuevo Empleado
                    </button>
                </div>

                {/* Búsqueda rápida */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                                🔍
                            </span>
                            <input
                                type="text"
                                className="form-control form-control-lg border-0"
                                placeholder="Buscar por nombre, email, NIF o teléfono..."
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

                {/* Filtros avanzados */}
                {showAdvancedFilters && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <h6 className="fw-bold mb-3">Filtros Avanzados</h6>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">
                                        Provincia
                                    </label>
                                    <select
                                        className="form-select form-select-sm"
                                        name="province"
                                        value={filters.province}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Todas las provincias</option>
                                        {provinces.map((prov) => (
                                            <option key={prov} value={prov}>
                                                {prov}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">País</label>
                                    <select
                                        className="form-select form-select-sm"
                                        name="country"
                                        value={filters.country}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Todos los países</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>
                                                {country}
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
                                        <option value="name">Nombre</option>
                                        <option value="email">Email</option>
                                        <option value="nif">NIF</option>
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">Orden</label>
                                    <select
                                        className="form-select form-select-sm"
                                        name="sortOrder"
                                        value={filters.sortOrder}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="asc">Ascendente ↑</option>
                                        <option value="desc">Descendente ↓</option>
                                    </select>
                                </div>

                                <div className="col-md-12">
                                    <button
                                        onClick={resetFilters}
                                        className="btn btn-outline-secondary btn-sm w-100"
                                    >
                                        Limpiar todos los filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabla */}
                <div className="card border-0 shadow-sm">
                    {loading ? (
                        <div className="card-body text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="card-body text-center py-5">
                            <p className="text-muted mb-0">No se encontraron empleados</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>NIF</th>
                                        <th>Teléfono</th>
                                        <th>Ubicación</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td className="fw-semibold">
                                                {employee.name} {employee.surname}
                                            </td>
                                            <td>{employee.email}</td>
                                            <td>{employee.nif}</td>
                                            <td>{employee.phone}</td>
                                            <td>
                                                <small>
                                                    {employee.city}, {employee.province}{" "}
                                                    ({employee.country})
                                                </small>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/employees/${employee.id}`
                                                        )
                                                    }
                                                    className="btn btn-sm btn-info me-2"
                                                >
                                                    👁️ Ver
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/employees/${employee.id}/edit`
                                                        )
                                                    }
                                                    className="btn btn-sm btn-warning me-2"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(employee.id)
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