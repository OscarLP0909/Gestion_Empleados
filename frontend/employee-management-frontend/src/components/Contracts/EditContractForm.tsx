import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contractService } from "../../services/contractService";
import { employeeService } from "../../services/employeeService";
import { useNotification } from "../../hooks/useNotification";
import { Layout } from "../Layout/Layout";
import type { CreateContractInput } from "../../types/contract";
import type { Employee } from "../../types/employee";

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
        <label htmlFor={name} className="form-label fw-semibold">
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
        >
            <option value="">Selecciona {label.toLowerCase()}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
);

export const EditContractForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const notification = useNotification();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        [key: string]: string;
    }>({});

    const [formData, setFormData] = useState<CreateContractInput & { endDate?: string }>({
        employeeId: "",
        contractType: "" as any,
        workdayType: "" as any,
        salaryType: "" as any,
        salaryAmount: 0,
        startDate: "",
        endDate: "",
        department: "",
        category: "",
        position: "",
        status: "PENDIENTE" as any
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const [contractData, employeesData] = await Promise.all([
                        contractService.getById(id),
                        employeeService.getAll(),
                    ]);

                    setEmployees(employeesData);
                    setFormData({
                        employeeId: (contractData as any).employeeId,
                        contractType: contractData.contractType,
                        workdayType: contractData.workdayType,
                        salaryType: contractData.salaryType,
                        salaryAmount: contractData.salaryAmount,
                        startDate: new Date(contractData.startDate).toISOString().split("T")[0],
                        endDate: contractData.endDate
                            ? new Date(contractData.endDate).toISOString().split("T")[0]
                            : "",
                        department: contractData.department,
                        category: contractData.category,
                        position: contractData.position,
                        status: contractData.status
                    });
                }
            } catch (err: any) {
                notification.error("Error", err.response?.data?.message || "Error al cargar contrato");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "salaryAmount" ? parseFloat(value) || 0 : value,
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

        setSaving(true);

        try {
            const dataToSend: CreateContractInput = {
                ...formData,
            };

            if (formData.endDate?.trim()) {
                dataToSend.endDate = formData.endDate;
            }

            if (id) {
                await contractService.update(id, dataToSend);
                notification.success("¡Éxito!", "Contrato actualizado correctamente");
                setTimeout(() => {
                    navigate(`/contracts/${id}`);
                }, 1500);
            }
        } catch (err: any) {
            notification.error("Error", err.response?.data?.message || "Error al actualizar contrato");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted mt-3">Cargando contrato...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid">
                <div className="mb-4">
                    <button
                        onClick={() => navigate(`/contracts/${id}`)}
                        className="btn btn-outline-secondary btn-sm mb-3"
                    >
                        ← Volver
                    </button>
                    <h1 className="fw-bold mb-2">Editar Contrato</h1>
                    <p className="text-muted">
                        Actualiza la información del contrato
                    </p>
                </div>

                <div className="d-flex justify-content-center">
                    <div style={{ width: "100%", maxWidth: "700px" }}>
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-5">
                                <form onSubmit={handleSubmit}>
                                    {/* Empleado y Estado */}
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <SelectField
                                                label="Empleado"
                                                name="employeeId"
                                                required={true}
                                                value={formData.employeeId}
                                                onChange={handleChange}
                                                error={validationErrors.employeeId}
                                                disabled={saving}
                                                options={employees.map((emp) => ({
                                                    value: (emp as any).id,
                                                    label: `${emp.name} ${emp.surname}`,
                                                }))}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <SelectField
                                                label="Estado"
                                                name="status"
                                                required={true}
                                                value={formData.status}
                                                onChange={handleChange}
                                                disabled={saving}
                                                options={[
                                                    { value: "PENDIENTE", label: "Pendiente" },
                                                    { value: "APROBADO", label: "Aprobado" },
                                                    { value: "RECHAZADO", label: "Rechazado" },
                                                    { value: "ACTIVO", label: "Activo" },
                                                    { value: "FINALIZADO", label: "Finalizado" },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    {/* Departamento, Categoría, Puesto */}
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <InputField
                                                label="Departamento"
                                                name="department"
                                                placeholder="IT"
                                                required={true}
                                                value={formData.department}
                                                onChange={handleChange}
                                                error={validationErrors.department}
                                                disabled={saving}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <InputField
                                                label="Categoría"
                                                name="category"
                                                placeholder="Senior"
                                                required={true}
                                                value={formData.category}
                                                onChange={handleChange}
                                                error={validationErrors.category}
                                                disabled={saving}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <InputField
                                                label="Puesto"
                                                name="position"
                                                placeholder="Desarrollador"
                                                required={true}
                                                value={formData.position}
                                                onChange={handleChange}
                                                error={validationErrors.position}
                                                disabled={saving}
                                            />
                                        </div>
                                    </div>

                                    {/* Tipo de Contrato, Jornada, Salario */}
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <SelectField
                                                label="Tipo de Contrato"
                                                name="contractType"
                                                required={true}
                                                value={formData.contractType}
                                                onChange={handleChange}
                                                error={validationErrors.contractType}
                                                disabled={saving}
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
                                                label="Jornada"
                                                name="workdayType"
                                                required={true}
                                                value={formData.workdayType}
                                                onChange={handleChange}
                                                error={validationErrors.workdayType}
                                                disabled={saving}
                                                options={[
                                                    { value: "Completa", label: "Completa" },
                                                    { value: "Parcial", label: "Parcial" },
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <SelectField
                                                label="Tipo de Salario"
                                                name="salaryType"
                                                required={true}
                                                value={formData.salaryType}
                                                onChange={handleChange}
                                                error={validationErrors.salaryType}
                                                disabled={saving}
                                                options={[
                                                    { value: "Bruto", label: "Bruto" },
                                                    { value: "Neto", label: "Neto" },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    {/* Salario, Fechas */}
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <InputField
                                                label="Salario"
                                                name="salaryAmount"
                                                type="number"
                                                placeholder="1500"
                                                required={true}
                                                value={formData.salaryAmount.toString()}
                                                onChange={handleChange}
                                                error={validationErrors.salaryAmount}
                                                disabled={saving}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <InputField
                                                label="Inicio del Contrato"
                                                name="startDate"
                                                type="date"
                                                required={true}
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                error={validationErrors.startDate}
                                                disabled={saving}
                                            />
                                        </div>
                                    </div>

                                    {/* Fin del Contrato */}
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <InputField
                                                label="Fin del Contrato"
                                                name="endDate"
                                                type="date"
                                                required={false}
                                                value={formData.endDate || ""}
                                                onChange={handleChange}
                                                disabled={saving}
                                            />
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="d-flex gap-2 pt-4 mt-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="btn btn-primary flex-grow-1"
                                        >
                                            {saving ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                    Guardando...
                                                </>
                                            ) : (
                                                "💾 Guardar Cambios"
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/contracts/${id}`)}
                                            disabled={saving}
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