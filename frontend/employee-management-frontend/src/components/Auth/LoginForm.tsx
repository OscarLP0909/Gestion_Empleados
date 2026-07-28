import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";

export const LoginForm = () => {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Email y contraseña son requeridos");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await authService.login(email, password);

            if (response.access_token) {
                localStorage.setItem("token", response.access_token);
            }

            if (response.user) {
                setUser(response.user);
            }

            navigate("/dashboard");
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Error al iniciar sesión";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                backgroundColor: "var(--bs-body-bg)",
            }}
        >
            {/* Panel de marca */}
            <div
                className="d-none d-lg-flex flex-column justify-content-between"
                style={{
                    width: "42%",
                    background:
                        "linear-gradient(160deg, var(--app-sidebar-bg) 0%, #1e3a5f 100%)",
                    color: "#e2e8f0",
                    padding: "56px",
                }}
            >
                <div className="d-flex align-items-center gap-2 fw-semibold fs-5" style={{ color: "#fff" }}>
                    <span
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.12)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                        }}
                    >
                        GE
                    </span>
                    Gestión de Empleados
                </div>

                <div>
                    <h1 className="fw-bold mb-3" style={{ fontSize: "2rem", color: "#fff" }}>
                        Recursos Humanos, en un solo lugar
                    </h1>
                    <p style={{ color: "#94a3b8", maxWidth: 420, lineHeight: 1.6 }}>
                        Gestiona empleados, contratos y equipos con un flujo de aprobación
                        claro, auditoría completa y control de acceso por roles.
                    </p>
                </div>

                <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                    © {new Date().getFullYear()} Gestión de Empleados
                </p>
            </div>

            {/* Panel de login */}
            <div
                className="d-flex flex-column justify-content-center flex-grow-1"
                style={{ padding: "24px" }}
            >
                <div style={{ width: "100%", maxWidth: 380, margin: "0 auto" }}>
                    <div className="mb-4">
                        <h2 className="fw-bold mb-1" style={{ color: "var(--app-ink)" }}>
                            Iniciar sesión
                        </h2>
                        <p className="mb-0" style={{ color: "var(--app-ink-soft)" }}>
                            Introduce tus credenciales para acceder a tu cuenta.
                        </p>
                    </div>

                    {error && (
                        <div
                            className="alert alert-danger d-flex align-items-start justify-content-between py-2 px-3 mb-3"
                            role="alert"
                        >
                            <span className="small">{error}</span>
                            <button
                                type="button"
                                className="btn-close"
                                style={{ fontSize: "0.7rem" }}
                                onClick={() => setError(null)}
                            ></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label small">Email</label>
                            <input
                                type="email"
                                className="form-control form-control-lg"
                                placeholder="tu@empresa.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                autoComplete="username"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label small">Contraseña</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 fw-semibold"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Iniciando sesión...
                                </>
                            ) : (
                                "Iniciar sesión"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
