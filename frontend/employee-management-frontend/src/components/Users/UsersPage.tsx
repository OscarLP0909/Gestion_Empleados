import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import { Layout } from "../Layout/Layout";
import type { User } from "../../types/user";

const InputField = ({
    label,
    name,
    type = "text",
    required = false,
    placeholder = "",
    value,
    onChange,
    error,
    disabled,
}: {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    error?: string;
    disabled?: boolean;
}) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
        </label>
        {type === "select" ? (
            <select
                className={`form-select ${error ? "is-invalid" : ""}`}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
            >
                <option value="">Selecciona {label.toLowerCase()}</option>
                <option value="ADMIN">Administrador</option>
                <option value="HR_MANAGER">Gerente de RRHH</option>
                <option value="MANAGER">Gerente</option>
                <option value="EMPLOYEE">Empleado</option>
            </select>
        ) : (
            <input
                type={type}
                className={`form-control ${error ? "is-invalid" : ""}`}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
            />
        )}
        {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
);

export const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        [key: string]: string;
    }>({});
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "EMPLOYEE",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.name?.trim()) errors.name = "El nombre es requerido";
        if (!formData.email?.trim()) errors.email = "El email es requerido";
        if (formData.email && !formData.email.includes("@")) errors.email = "Email inválido";
        if (!formData.password) errors.password = "La contraseña es requerida";
        if (formData.password && formData.password.length < 6)
            errors.password = "La contraseña debe tener al menos 6 caracteres";
        if (formData.password !== formData.confirmPassword)
            errors.confirmPassword = "Las contraseñas no coinciden";
        if (!formData.role) errors.role = "Selecciona un rol";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setCreating(true);
        setError(null);
        try {
            // Llamar al endpoint de registro (asumiendo que existe)
            await userService.createUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            setSuccess("✅ Usuario creado correctamente");
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "EMPLOYEE",
            });
            setShowCreateModal(false);
            fetchUsers();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al crear usuario");
        } finally {
            setCreating(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!window.confirm(`¿Cambiar rol a ${newRole}?`)) return;

        setError(null);
        try {
            const updatedUser = await userService.updateRole(userId, newRole);
            setUsers(users.map((u) => ((u._id || u.id) === userId ? updatedUser : u)));
            setSuccess("✅ Rol actualizado correctamente");
            setEditingId(null);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al actualizar rol");
        }
    };

    const handleDeactivate = async (userId: string) => {
        if (!window.confirm("¿Desactivar este usuario?")) return;

        setError(null);
        try {
            const updatedUser = await userService.deactivate(userId);
            setUsers(users.map((u) => ((u._id || u.id) === userId ? updatedUser : u)));
            setSuccess("✅ Usuario desactivado correctamente");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al desactivar usuario");
        }
    };

    const handleActivate = async (userId: string) => {
        if (!window.confirm("¿Activar este usuario?")) return;

        setError(null);
        try {
            const updatedUser = await userService.activate(userId);
            setUsers(users.map((u) => ((u._id || u.id) === userId ? updatedUser : u)));
            setSuccess("✅ Usuario activado correctamente");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al activar usuario");
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "danger";
            case "HR_MANAGER":
                return "primary";
            case "MANAGER":
                return "warning";
            case "EMPLOYEE":
                return "secondary";
            default:
                return "secondary";
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "Administrador";
            case "HR_MANAGER":
                return "Gerente de RRHH";
            case "MANAGER":
                return "Gerente";
            case "EMPLOYEE":
                return "Empleado";
            default:
                return role;
        }
    };

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="fw-bold mb-2">Gestión de Usuarios</h1>
                        <p className="text-muted">
                            Administra usuarios, roles y permisos del sistema
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary"
                    >
                        ➕ Crear Usuario
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

                {success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>{success}</strong>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setSuccess(null)}
                        ></button>
                    </div>
                )}

                {/* Tabla */}
                <div className="card border-0 shadow-sm">
                    {loading ? (
                        <div className="card-body text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="text-muted mt-3">Cargando usuarios...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="card-body text-center py-5">
                            <p className="text-muted mb-0">No hay usuarios registrados</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: "25%" }}>Nombre</th>
                                        <th style={{ width: "25%" }}>Email</th>
                                        <th style={{ width: "20%" }}>Rol</th>
                                        <th style={{ width: "15%" }}>Estado</th>
                                        <th style={{ width: "15%" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id || user.id}>
                                            <td className="fw-semibold">{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                {editingId === (user._id || user.id) ? (
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={selectedRole}
                                                        onChange={(e) => {
                                                            handleRoleChange(
                                                                user._id || user.id!,
                                                                e.target.value
                                                            );
                                                        }}
                                                    >
                                                        <option value="">Cambiar rol</option>
                                                        <option value="ADMIN">
                                                            Administrador
                                                        </option>
                                                        <option value="HR_MANAGER">
                                                            Gerente de RRHH
                                                        </option>
                                                        <option value="MANAGER">Gerente</option>
                                                        <option value="EMPLOYEE">Empleado</option>
                                                    </select>
                                                ) : (
                                                    <>
                                                        <span
                                                            className={`badge bg-${getRoleColor(
                                                                user.role
                                                            )}`}
                                                        >
                                                            {getRoleText(user.role)}
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(user._id || user.id!);
                                                                setSelectedRole(user.role);
                                                            }}
                                                            className="btn btn-link btn-sm ms-2"
                                                            title="Cambiar rol"
                                                        >
                                                            ✏️
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                            <td>
                                                {user.isActive ? (
                                                    <span className="badge bg-success">
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-danger">
                                                        Inactivo
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm" role="group">
                                                    {user.isActive ? (
                                                        <button
                                                            onClick={() =>
                                                                handleDeactivate(
                                                                    user._id || user.id!
                                                                )
                                                            }
                                                            className="btn btn-outline-danger"
                                                            title="Desactivar"
                                                        >
                                                            🔒
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleActivate(
                                                                    user._id || user.id!
                                                                )
                                                            }
                                                            className="btn btn-outline-success"
                                                            title="Activar"
                                                        >
                                                            🔓
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer */}
                    {!loading && users.length > 0 && (
                        <div className="card-footer bg-light text-muted small">
                            Total de usuarios: {users.length}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de crear usuario */}
            {showCreateModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    tabIndex={-1}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Crear Nuevo Usuario</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setFormData({
                                            name: "",
                                            email: "",
                                            password: "",
                                            confirmPassword: "",
                                            role: "EMPLOYEE",
                                        });
                                        setValidationErrors({});
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={handleCreateUser}>
                                <div className="modal-body">
                                    <InputField
                                        label="Nombre"
                                        name="name"
                                        required={true}
                                        placeholder="Juan Pérez"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        error={validationErrors.name}
                                        disabled={creating}
                                    />

                                    <InputField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        required={true}
                                        placeholder="usuario@ejemplo.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={validationErrors.email}
                                        disabled={creating}
                                    />

                                    <InputField
                                        label="Contraseña"
                                        name="password"
                                        type="password"
                                        required={true}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        error={validationErrors.password}
                                        disabled={creating}
                                    />

                                    <InputField
                                        label="Confirmar Contraseña"
                                        name="confirmPassword"
                                        type="password"
                                        required={true}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        error={validationErrors.confirmPassword}
                                        disabled={creating}
                                    />

                                    <div className="mb-3">
                                        <label htmlFor="role" className="form-label fw-semibold">
                                            Rol <span className="text-danger ms-1">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${validationErrors.role ? "is-invalid" : ""}`}
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            disabled={creating}
                                        >
                                            <option value="EMPLOYEE">Empleado</option>
                                            <option value="MANAGER">Gerente</option>
                                            <option value="HR_MANAGER">Gerente de RRHH</option>
                                            <option value="ADMIN">Administrador</option>
                                        </select>
                                        {validationErrors.role && (
                                            <div className="invalid-feedback d-block">
                                                {validationErrors.role}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setFormData({
                                                name: "",
                                                email: "",
                                                password: "",
                                                confirmPassword: "",
                                                role: "EMPLOYEE",
                                            });
                                            setValidationErrors({});
                                        }}
                                        disabled={creating}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={creating}
                                    >
                                        {creating ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Creando...
                                            </>
                                        ) : (
                                            "✅ Crear Usuario"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};