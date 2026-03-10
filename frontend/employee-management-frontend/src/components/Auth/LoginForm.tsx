import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            // Error manejado en useAuth
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-5 rounded shadow-lg"
                style={{ width: '100%', maxWidth: '400px' }}
            >
                {/* Título */}
                <div className="text-center mb-5">
                    <h1 className="h3 fw-bold text-dark mb-2">
                        Gestión de Empleados
                    </h1>
                    <p className="text-muted small">Ingresa tus credenciales</p>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Campo Email */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="tu@email.com"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Campo Contraseña */}
                <div className="mb-4">
                    <label className="form-label fw-semibold">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="••••••••"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Botón Entrar */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100 fw-bold"
                >
                    {loading ? "Cargando..." : "Entrar"}
                </button>

                {/* Credenciales de prueba */}
                <hr />
                <p className="text-muted text-center small mb-0">
                    <strong>Credenciales de prueba:</strong><br/>
                    Email: algo@algo.com<br/>
                    Contraseña: 123123
                </p>
            </form>
        </div>
    );
};