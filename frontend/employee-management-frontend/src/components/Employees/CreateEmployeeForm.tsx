import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeForm } from "../../hooks/useEmployeeForm";
import { useNotification } from "../../hooks/useNotification";
import { Layout } from "../Layout/Layout";
import type { CreateEmployeeInput } from "../../types/employee";

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
    name: keyof CreateEmployeeInput;
    type?: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
}) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold text-white mb-2">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
        </label>
        <input
            type={type}
            className={`form-control ${error ? "is-invalid" : ""}`}
            id={name as string}
            name={name as string}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                fontSize: "16px",
            }}
        />
        {error && (
            <div className="invalid-feedback d-block" style={{ color: "#ffcccc" }}>
                {error}
            </div>
        )}
    </div>
);

export const CreateEmployeeForm = () => {
    const navigate = useNavigate();
    const notification = useNotification();
    const { createEmployee, loading } = useEmployeeForm();

    const [formData, setFormData] = useState<CreateEmployeeInput>({
        name: "",
        surname: "",
        nif: "",
        email: "",
        phone: "",
        city: "",
        province: "",
        country: "",
    });

    const [validationErrors, setValidationErrors] = useState<{
        [key: string]: string;
    }>({});

    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setValidationErrors((prev) => {
            if (prev[name]) {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            }
            return prev;
        });
    }, []);

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.name || formData.name.trim() === "") {
            errors.name = "El nombre es requerido";
        }
        if (!formData.surname || formData.surname.trim() === "") {
            errors.surname = "El apellido es requerido";
        }
        if (!formData.nif || formData.nif.trim() === "") {
            errors.nif = "El NIF es requerido";
        }
        if (!formData.email || formData.email.trim() === "") {
            errors.email = "El email es requerido";
        } else if (!formData.email.includes("@")) {
            errors.email = "El email no es válido";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const dataToSend: CreateEmployeeInput = {
            name: formData.name,
            surname: formData.surname,
            nif: formData.nif,
            email: formData.email,
        };

        if (formData.phone?.trim()) {
            dataToSend.phone = formData.phone;
        }
        if (formData.city?.trim()) {
            dataToSend.city = formData.city;
        }
        if (formData.province?.trim()) {
            dataToSend.province = formData.province;
        }
        if (formData.country?.trim()) {
            dataToSend.country = formData.country;
        }

        const isSuccess = await createEmployee(dataToSend);
        if (isSuccess) {
            notification.success("¡Éxito!", "Empleado creado correctamente");
            setTimeout(() => {
                navigate("/employees");
            }, 1500);
        }
    };

    return (
        <Layout>
            <div className="container-fluid">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <button
                            onClick={() => navigate("/employees")}
                            className="btn btn-outline-secondary btn-sm"
                        >
                            ← Atrás
                        </button>
                        <h1 className="fw-bold mb-0">👤 Crear Nuevo Empleado</h1>
                    </div>
                    <p className="text-muted">Registra un nuevo empleado en el sistema</p>
                </div>

                {/* Formulario */}
                <div className="row justify-content-center">
                    <div className="col-lg-7 col-xl-6">
                        <div
                            className="card border-0 shadow-lg"
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: "15px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    background: "rgba(0,0,0,0.1)",
                                    padding: "20px",
                                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                <h5 className="text-white fw-bold mb-0">
                                    📋 Datos del Empleado
                                </h5>
                                <small className="text-white-50">Completa todos los campos requeridos</small>
                            </div>

                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    {/* Nombre y Apellido */}
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <InputField
                                                label="Nombre"
                                                name="name"
                                                placeholder="Juan"
                                                required={true}
                                                value={formData.name}
                                                onChange={handleChange}
                                                error={validationErrors.name}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <InputField
                                                label="Apellido/s"
                                                name="surname"
                                                placeholder="García López"
                                                required={true}
                                                value={formData.surname}
                                                onChange={handleChange}
                                                error={validationErrors.surname}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* NIF y Email */}
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <InputField
                                                label="NIF"
                                                name="nif"
                                                placeholder="12345678A"
                                                required={true}
                                                value={formData.nif}
                                                onChange={handleChange}
                                                error={validationErrors.nif}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <InputField
                                                label="Email"
                                                name="email"
                                                type="email"
                                                placeholder="juan@example.com"
                                                required={true}
                                                value={formData.email}
                                                onChange={handleChange}
                                                error={validationErrors.email}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Teléfono */}
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <InputField
                                                label="Teléfono"
                                                name="phone"
                                                type="tel"
                                                placeholder="+34 123 456 789"
                                                required={false}
                                                value={formData.phone || ""}
                                                onChange={handleChange}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Ciudad, Provincia, País */}
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <InputField
                                                label="Ciudad"
                                                name="city"
                                                placeholder="Madrid"
                                                required={false}
                                                value={formData.city || ""}
                                                onChange={handleChange}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <InputField
                                                label="Provincia"
                                                name="province"
                                                placeholder="Madrid"
                                                required={false}
                                                value={formData.province || ""}
                                                onChange={handleChange}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <InputField
                                                label="País"
                                                name="country"
                                                placeholder="España"
                                                required={false}
                                                value={formData.country || ""}
                                                onChange={handleChange}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="d-grid gap-2 pt-4">
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
                                                    Creando empleado...
                                                </>
                                            ) : (
                                                "✅ Crear Empleado"
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate("/employees")}
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

                            <div
                                style={{
                                    background: "rgba(0,0,0,0.1)",
                                    padding: "15px 20px",
                                    borderTop: "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                <small className="text-white-50">
                                    ℹ️ Los campos marcados con * son obligatorios
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};