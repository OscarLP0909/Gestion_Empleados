import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import { Layout } from "../Layout/Layout";
import type { User } from "../../types/user";

export const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");

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
                <div className="mb-4">
                    <h1 className="fw-bold mb-2">Gestión de Usuarios</h1>
                    <p className="text-muted">
                        Administra usuarios, roles y permisos del sistema
                    </p>
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
        </Layout>
    );
};