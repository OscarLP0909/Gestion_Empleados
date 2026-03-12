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

    const handleLogin = async () => {
        console.log("🔐 Iniciando login");
        
        if (!email || !password) {
            setError("Email y contraseña son requeridos");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log("📤 Enviando:", { email, password });
            const response = await authService.login(email, password);
            console.log("✅ Response:", response);

            if (response.access_token) {
                localStorage.setItem("token", response.access_token);
                console.log("💾 Token guardado");
            }

            if (response.user) {
                setUser(response.user);
                console.log("👤 Usuario guardado:", response.user);
            }

            console.log("🚀 Navegando a dashboard");
            navigate("/dashboard");
        } catch (err: any) {
            console.error("❌ Error completo:", err);
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
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
        >
            <div className="card shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="card-body p-5">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1 className="fs-3 fw-bold mb-2">📊 Gestión de Empleados</h1>
                        <p className="text-muted">Inicia sesión para continuar</p>
                    </div>

                    {/* Errores */}
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

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Contraseña</label>
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleLogin}
                        className="btn btn-primary btn-lg w-100 fw-bold"
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
                            "🔐 Iniciar Sesión"
                        )}
                    </button>

                    {/* Footer */}
                    <hr className="my-4" />
                    <p className="text-muted text-center small mb-0">
                        Demo: Usa cualquier usuario creado en la base de datos
                    </p>
                </div>
            </div>
        </div>
    );
};