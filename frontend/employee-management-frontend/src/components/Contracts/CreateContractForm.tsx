import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useContractForm } from "../../hooks/useContractForm";
import { useNotification } from "../../hooks/useNotification";
import { employeeService } from "../../services/employeeService";
import { Layout } from "../Layout/Layout";
import type { CreateContractInput } from "../../types/contract";
import type { Employee } from "../../types/employee";
import { useEffect } from "react";

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
        <label htmlFor={name} className="form-label fw-semibold text-white mb-2">
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
            style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                fontSize: "16px",
            }}
        />
        {error && <div className="invalid-feedback d-block" style={{ color: "#ffcccc" }}>{error}</div>}
    </div>
);

const SelectField = ({
    label,
    name,
    required = false,
    value,
    onChange,
    error,
    disabled,
    options,
}: {
    label: string;
    name: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    disabled?: boolean;
    options: { value: string; label: string }[];
}) => (
    <div className="mb-3">
        <label htmlFor={name} className="form-label fw-semibold text-white mb-2">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
        </label>
        <select
            className={`form-select ${error ? "is-invalid" : ""}`}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                fontSize: "16px",
            }}
        >
            <option value="">Selecciona {label.toLowerCase()}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        {error && <div className="invalid-feedback d-block" style={{ color: "#ffcccc" }}>{error}</div>}
    </div>
);

export const CreateContractForm = () => {
    const navigate = useNavigate();
    const notification = useNotification();
    const { createContract, loading } = useContractForm();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        [key: string]: string;
    }>({});

    const [formData, setFormData] = useState<CreateContractInput>({
        employeeId: "",
        contractType: "Indefinido",
        workdayType: "Completa",
        salaryType: "Bruto",
        salaryAmount: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        department: "",
        category: "",
        position: "",
        status: "" as any
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoadingEmployees(true);
        try {
            const data = await employeeService.getAll();
            setEmployees(data);
        } catch (err) {
            notification.error("Error", "No se pudieron cargar los empleados");
        } finally {
            setLoadingEmployees(false);
        }
    };

    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "salaryAmount" ? parseFloat(value) || 0 : value,
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

        if (!formData.employeeId) errors.employeeId = "Selecciona un empleado";
        if (!formData.contractType) errors.contractType = "Selecciona tipo de contrato";
        if (!formData.workdayType) errors.workdayType = "Selecciona tipo de jornada";
        if (!formData.salaryType) errors.salaryType = "Selecciona tipo de salario";
        if (!formData.salaryAmount || formData.salaryAmount <= 0)
            errors.salaryAmount = "Ingresa un salario válido";
        if (!formData.startDate) errors.startDate = "Selecciona fecha de inicio";
        if (!formData.department?.trim()) errors.department = "Ingresa departamento";
        if (!formData.category?.trim()) errors.category = "Ingresa categoría";
        if (!formData.position?.trim()) errors.position = "Ingresa puesto";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const dataToSend: any = {
            employeeId: formData.employeeId,
            contractType: formData.contractType,
            workdayType: formData.workdayType,
            salaryType: formData.salaryType,
            salaryAmount: formData.salaryAmount,
            startDate: formData.startDate,
            department: formData.department,
            category: formData.category,
            position: formData.position,
            status: "PENDIENTE",
        };

        if (formData.endDate?.trim()) {
            dataToSend.endDate = formData.endDate;
        }

        const isSuccess = await createContract(dataToSend);
        if (isSuccess) {
            notification.success("¡Éxito!", "Contrato creado correctamente");
            setTimeout(() => {
                navigate("/contracts");
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
                            onClick={() => navigate("/contracts")}
                            className="btn btn-outline-secondary btn-sm"
                        >
                            ← Atrás
                        </button>
                        <h1 className="fw-bold mb-0">📋 Crear Nuevo Contrato</h1>
                    </div>
                    <p className="text-muted">Registra un nuevo contrato de trabajo</p>
                </div>

                {/* Formulario */}
                <div className="row justify-content-center">
                    <div className="col-lg-7 col-xl-6">
                        <div
                            className="card border-0 shadow-lg"
                            style={{
                                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
                                    📝 Datos del Contrato
                                </h5>
                                <small className="text-white-50">Completa todos los campos requeridos</small>
                            </div>

                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    {/* Empleado */}
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <SelectField
                                                label="👤 Empleado"
                                                name="employeeId"
                                                required={true}
                                                value={formData.employeeId}
                                                onChange={handleChange}
                                                error={validationErrors.employeeId}
                                                disabled={loading || loadingEmployees}
                                                options={employees.map((emp) => ({
                                                    value: (emp as any).id,
                                                    label: `${emp.name} ${emp.surname}`,
                                                }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Departamento, Categoría, Puesto */}
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <InputField
                                                label="🏢 Departamento"
                                                name="department"
                                                placeholder="IT"
                                                required={true}
                                                value={formData.department}
                                                onChange={handleChange}
                                                error={validationErrors.department}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <InputField
                                                label="🏷️ Categoría"
                                                name="category"
                                                placeholder="Senior"
                                                required={true}
                                                value={formData.category}
                                                onChange={handleChange}
                                                error={validationErrors.category}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <InputField
                                                label="💼 Puesto"
                                                name="position"
                                                placeholder="Desarrollador"
                                                required={true}
                                                value={formData.position}
                                                onChange={handleChange}
                                                error={validationErrors.position}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Tipo de Contrato, Jornada, Salario */}
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <SelectField
                                                label="📄 Tipo"
                                                name="contractType"
                                                required={true}
                                                value={formData.contractType}
                                                onChange={handleChange}
                                                error={validationErrors.contractType}
                                                disabled={loading}
                                                options={[
                                                    { value: "Indefinido", label: "Indefinido" },
                                                    { value: "Prácticas", label: "Prácticas" },
                                                    { value: "Formación", label: "Formación" },
                                                    { value: "Eventual", label: "Eventual" },
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <SelectField
                                                label="⏰ Jornada"
                                                name="workdayType"
                                                required={true}
                                                value={formData.workdayType}
                                                onChange={handleChange}
                                                error={validationErrors.workdayType}
                                                disabled={loading}
                                                options={[
                                                    { value: "Completa", label: "Completa" },
                                                    { value: "Parcial", label: "Parcial" },
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <SelectField
                                                label="💰 Salario"
                                                name="salaryType"
                                                required={true}
                                                value={formData.salaryType}
                                                onChange={handleChange}
                                                error={validationErrors.salaryType}
                                                disabled={loading}
                                                options={[
                                                    { value: "Bruto", label: "Bruto" },
                                                    { value: "Neto", label: "Neto" },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    {/* Monto Salario, Fecha Inicio */}
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <InputField
                                                label="💵 Monto Salario (€)"
                                                name="salaryAmount"
                                                type="number"
                                                placeholder="1500"
                                                required={true}
                                                value={formData.salaryAmount.toString()}
                                                onChange={handleChange}
                                                error={validationErrors.salaryAmount}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <InputField
                                                label="📅 Inicio"
                                                name="startDate"
                                                type="date"
                                                required={true}
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                error={validationErrors.startDate}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Fin del Contrato */}
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <InputField
                                                label="📅 Fin (Opcional)"
                                                name="endDate"
                                                type="date"
                                                required={false}
                                                value={formData.endDate || ""}
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
                                                    Creando contrato...
                                                </>
                                            ) : (
                                                "✅ Crear Contrato"
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate("/contracts")}
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
                                    ℹ️ El contrato será creado con estado PENDIENTE
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};