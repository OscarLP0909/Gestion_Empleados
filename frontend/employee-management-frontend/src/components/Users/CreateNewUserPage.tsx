import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import { Layout } from "../Layout/Layout";
import axios from "axios";

export const CreateUserPage = () => {
    const navigate = useNavigate();
    const notification = useNotification();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === "password") {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return "danger";
        if (passwordStrength <= 2) return "warning";
        if (passwordStrength <= 3) return "info";
        return "success";
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return "Muy débil";
        if (passwordStrength === 1) return "Débil";
        if (passwordStrength === 2) return "Regular";
        if (passwordStrength === 3) return "Buena";
        return "Muy fuerte";
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            notification.error("Error", "El nombre es requerido");
            return false;
        }

        if (!formData.email.trim()) {
            notification.error("Error", "El email es requerido");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            notification.error("Error", "El email no es válido");
            return false;
        }

        if (!formData.password.trim()) {
            notification.error("Error", "La contraseña es requerida");
            return false;
        }

        if (formData.password.length < 6) {
            notification.error("Error", "La contraseña debe tener al menos 6 caracteres");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:3000/user`,
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            notification.success("¡Éxito!", `Usuario ${formData.email} creado correctamente`);
            
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "EMPLOYEE",
            });
            setPasswordStrength(0);

            setTimeout(() => {
                navigate("/users");
            }, 2000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "No se pudo crear el usuario";
            notification.error("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-outline-secondary btn-sm"
                        >
                            ← Atrás
                        </button>
                        <h1 className="fw-bold mb-0">🆕 Crear Nuevo Usuario</h1>
                    </div>
                    <p className="text-muted">Añade un nuevo usuario al sistema con acceso a la aplicación</p>
                </div>

                {/* Contenedor Principal */}
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-xl-5">
                        {/* Card Vistosa */}
                        <div
                            className="card border-0 shadow-lg"
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: "15px",
                                overflow: "hidden",
                            }}
                        >
                            {/* Header Gradient */}
                            <div
                                style={{
                                    background: "rgba(0,0,0,0.1)",
                                    padding: "20px",
                                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                <h5 className="text-white fw-bold mb-0">
                                    👤 Datos del Nuevo Usuario
                                </h5>
                                <small className="text-white-50">Completa los campos para crear un nuevo usuario</small>
                            </div>

                            {/* Form */}
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    {/* Nombre */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-white mb-2">
                                            📝 Nombre
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="Juan Pérez"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            style={{
                                                backgroundColor: "rgba(255,255,255,0.95)",
                                                border: "2px solid rgba(255,255,255,0.3)",
                                                borderRadius: "10px",
                                                padding: "12px 16px",
                                                fontSize: "16px",
                                            }}
                                        />
                                        <small className="text-white-50 mt-2 d-block">
                                            Nombre completo del usuario
                                        </small>
                                    </div>

                                    {/* Email */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-white mb-2">
                                            📧 Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            placeholder="usuario@empresa.com"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            style={{
                                                backgroundColor: "rgba(255,255,255,0.95)",
                                                border: "2px solid rgba(255,255,255,0.3)",
                                                borderRadius: "10px",
                                                padding: "12px 16px",
                                                fontSize: "16px",
                                            }}
                                        />
                                        <small className="text-white-50 mt-2 d-block">
                                            Debe ser un email válido y único
                                        </small>
                                    </div>

                                    {/* Contraseña */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-white mb-2">
                                            🔐 Contraseña
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control form-control-lg"
                                                placeholder="Mínimo 6 caracteres"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                                style={{
                                                    backgroundColor: "rgba(255,255,255,0.95)",
                                                    border: "2px solid rgba(255,255,255,0.3)",
                                                    borderRadius: "10px 0px 0px 10px",
                                                    padding: "12px 16px",
                                                    fontSize: "16px",
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-light"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    borderRadius: "0px 10px 10px 0px",
                                                    border: "2px solid rgba(255,255,255,0.3)",
                                                    borderLeft: "none",
                                                }}
                                            >
                                                {showPassword ? "👁️" : "🚫"}
                                            </button>
                                        </div>

                                        {/* Indicador de Fortaleza */}
                                        {formData.password && (
                                            <div className="mt-2">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <small className="text-white-50">Fortaleza:</small>
                                                    <small
                                                        className={`fw-bold text-${getPasswordStrengthColor()}`}
                                                        style={{ color: "white" }}
                                                    >
                                                        {getPasswordStrengthText()}
                                                    </small>
                                                </div>
                                                <div className="progress" style={{ height: "6px", borderRadius: "3px" }}>
                                                    <div
                                                        className={`progress-bar bg-${getPasswordStrengthColor()}`}
                                                        style={{
                                                            width: `${(passwordStrength / 5) * 100}%`,
                                                            borderRadius: "3px",
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                        <small className="text-white-50 mt-2 d-block">
                                            ✓ Mínimo 6 caracteres
                                        </small>
                                    </div>

                                    {/* Rol */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-white mb-2">
                                            👨‍💼 Rol del Usuario
                                        </label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className="form-select form-select-lg"
                                            style={{
                                                backgroundColor: "rgba(255,255,255,0.95)",
                                                border: "2px solid rgba(255,255,255,0.3)",
                                                borderRadius: "10px",
                                                padding: "12px 16px",
                                                fontSize: "16px",
                                            }}
                                        >
                                            <option value="EMPLOYEE">👤 Empleado</option>
                                            <option value="MANAGER">📊 Gerente</option>
                                            <option value="HR_MANAGER">👥 Gestor RRHH</option>
                                            <option value="ADMIN">🔑 Administrador</option>
                                        </select>
                                        <small className="text-white-50 mt-2 d-block">
                                            Selecciona el nivel de permisos del usuario
                                        </small>
                                    </div>

                                    {/* Botones */}
                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-light btn-lg fw-bold"
                                            style={{
                                                borderRadius: "10px",
                                                padding: "12px 24px",
                                                fontSize: "16px",
                                                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                    Creando usuario...
                                                </>
                                            ) : (
                                                <>✅ Crear Usuario</>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate("/users")}
                                            disabled={loading}
                                            className="btn btn-outline-light btn-lg fw-bold"
                                            style={{
                                                borderRadius: "10px",
                                                padding: "12px 24px",
                                                fontSize: "16px",
                                            }}
                                        >
                                            ❌ Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Footer Info */}
                            <div
                                style={{
                                    background: "rgba(0,0,0,0.1)",
                                    padding: "15px 20px",
                                    borderTop: "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                <small className="text-white-50">
                                    ℹ️ El usuario será creado con estado activo (isActive = true)
                                </small>
                            </div>
                        </div>

                        {/* Tarjeta Info */}
                        <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: "10px" }}>
                            <div className="card-body">
                                <h6 className="fw-bold mb-3">📋 Información sobre Roles</h6>
                                <div className="small">
                                    <p className="mb-2">
                                        <strong>👤 Empleado:</strong> Acceso básico, solo lectura de sus datos
                                    </p>
                                    <p className="mb-2">
                                        <strong>📊 Gerente:</strong> Lectura de datos, gestión limitada
                                    </p>
                                    <p className="mb-2">
                                        <strong>👥 Gestor RRHH:</strong> Acceso completo a RRHH y contratos
                                    </p>
                                    <p className="mb-0">
                                        <strong>🔑 Administrador:</strong> Acceso total al sistema
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};