import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeForm } from "../../hooks/useEmployeeForm";
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
        <label htmlFor={name} className="form-label fw-semibold">
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
        />
        {error && (
            <div className="invalid-feedback d-block">
                {error}
            </div>
        )}
    </div>
);

export const CreateEmployeeForm = () => {
    const navigate = useNavigate();
    const { createEmployee, loading, error, success } = useEmployeeForm();

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

        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }, [validationErrors]);

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
                    <button
                        onClick={() => navigate("/employees")}
                        className="btn btn-outline-secondary btn-sm mb-3"
                    >
                        ← Volver
                    </button>
                    <h1 className="fw-bold mb-2">Crear Nuevo Empleado</h1>
                    <p className="text-muted">
                        Completa el formulario para agregar un nuevo empleado al sistema
                    </p>
                </div>

                {/* Mensajes */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>¡Éxito!</strong> Empleado creado correctamente. Redirigiendo...
                    </div>
                )}

                {/* Formulario */}
                <div className="d-flex justify-content-center">
                    <div style={{ width: "100%", maxWidth: "700px" }}>
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-5">
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
                                                label="Apellido"
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
                                    <div className="d-flex gap-2 pt-4 mt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-primary flex-grow-1"
                                        >
                                            {loading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                    Creando...
                                                </>
                                            ) : (
                                                "✅ Crear Empleado"
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate("/employees")}
                                            disabled={loading}
                                            className="btn btn-outline-secondary flex-grow-1"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};