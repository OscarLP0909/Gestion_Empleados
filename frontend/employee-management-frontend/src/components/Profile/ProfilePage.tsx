import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../../services/profileService";
import { useAuthStore } from "../../store/authStore";
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
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
}) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
        </label>
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
        {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
);

export const ProfilePage = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuthStore();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [formData, setFormData] = useState({ name: "", email: "" });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [validationErrors, setValidationErrors] = useState<{
        [key: string]: string;
    }>({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const profileData = await profileService.getProfile();
            setUser(profileData);
            setFormData({ name: profileData.name, email: profileData.email });
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateProfileForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.name?.trim()) errors.name = "El nombre es requerido";
        if (!formData.email?.trim()) errors.email = "El email es requerido";
        if (formData.email && !formData.email.includes("@"))
            errors.email = "Email inválido";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePasswordForm = () => {
        const errors: { [key: string]: string } = {};

        if (!passwordData.currentPassword)
            errors.currentPassword = "Ingresa tu contraseña actual";
        if (!passwordData.newPassword)
            errors.newPassword = "Ingresa una nueva contraseña";
        if (passwordData.newPassword?.length < 6)
            errors.newPassword = "La contraseña debe tener al menos 6 caracteres";
        if (passwordData.newPassword !== passwordData.confirmPassword)
            errors.confirmPassword = "Las contraseñas no coinciden";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateProfileForm()) return;

        setError(null);
        try {
            const updatedUser = await profileService.updateProfile({
                name: formData.name,
                email: formData.email,
            });

            setUser(updatedUser);
            setEditMode(false);
            setSuccess("✅ Perfil actualizado correctamente");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al actualizar perfil");
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePasswordForm()) return;

        setError(null);
        try {
            await profileService.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setShowPasswordModal(false);
            setSuccess("✅ Contraseña actualizada correctamente");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cambiar contraseña");
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

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted mt-3">Cargando perfil...</p>
                </div>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout>
                <div className="alert alert-danger">
                    <strong>Error:</strong> No se pudo cargar el perfil
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="btn btn-outline-secondary btn-sm mb-3"
                    >
                        ← Volver
                    </button>
                    <h1 className="fw-bold mb-2">Mi Perfil</h1>
                    <p className="text-muted">
                        Administra tu información personal y seguridad
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

                <div className="d-flex justify-content-center">
                    <div style={{ width: "100%", maxWidth: "600px" }}>
                        {/* Card de información de rol */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted small mb-1">Tu Rol</p>
                                        <h5 className="fw-bold mb-0">
                                            {getRoleText(user.role)}
                                        </h5>
                                    </div>
                                    <span className={`badge bg-${getRoleColor(user.role)} fs-6`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card de perfil */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-5">
                                {editMode ? (
                                    // Modo edición
                                    <form onSubmit={handleUpdateProfile}>
                                        <h5 className="fw-bold mb-4">Editar Información</h5>

                                        <InputField
                                            label="Nombre"
                                            name="name"
                                            required={true}
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            error={validationErrors.name}
                                        />

                                        <InputField
                                            label="Email"
                                            name="email"
                                            type="email"
                                            required={true}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            error={validationErrors.email}
                                        />

                                        <div className="d-flex gap-2 pt-3">
                                            <button
                                                type="submit"
                                                className="btn btn-primary flex-grow-1"
                                            >
                                                💾 Guardar Cambios
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setFormData({
                                                        name: user.name,
                                                        email: user.email,
                                                    });
                                                    setValidationErrors({});
                                                }}
                                                className="btn btn-outline-secondary flex-grow-1"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    // Modo vista
                                    <>
                                        <h5 className="fw-bold mb-4">Información Personal</h5>

                                        <div className="mb-4">
                                            <p className="text-muted small mb-1">Nombre</p>
                                            <p className="fw-semibold">{user.name}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-muted small mb-1">Email</p>
                                            <p className="fw-semibold">{user.email}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-muted small mb-1">Estado</p>
                                            <p>
                                                {user.isActive ? (
                                                    <span className="badge bg-success">
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-danger">
                                                        Inactivo
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        <hr />

                                        <div className="d-flex gap-2">
                                            <button
                                                onClick={() => setEditMode(true)}
                                                className="btn btn-warning flex-grow-1"
                                            >
                                                ✏️ Editar Información
                                            </button>
                                            <button
                                                onClick={() => setShowPasswordModal(true)}
                                                className="btn btn-info flex-grow-1"
                                            >
                                                🔑 Cambiar Contraseña
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de cambio de contraseña */}
            {showPasswordModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    tabIndex={-1}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Cambiar Contraseña</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                        });
                                        setValidationErrors({});
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={handleChangePassword}>
                                <div className="modal-body">
                                    <InputField
                                        label="Contraseña Actual"
                                        name="currentPassword"
                                        type="password"
                                        required={true}
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        error={validationErrors.currentPassword}
                                    />

                                    <InputField
                                        label="Nueva Contraseña"
                                        name="newPassword"
                                        type="password"
                                        required={true}
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        error={validationErrors.newPassword}
                                    />

                                    <InputField
                                        label="Confirmar Contraseña"
                                        name="confirmPassword"
                                        type="password"
                                        required={true}
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        error={validationErrors.confirmPassword}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setPasswordData({
                                                currentPassword: "",
                                                newPassword: "",
                                                confirmPassword: "",
                                            });
                                            setValidationErrors({});
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        🔑 Cambiar Contraseña
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