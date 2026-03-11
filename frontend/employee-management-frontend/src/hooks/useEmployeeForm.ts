import { useState } from "react";
import { employeeService } from "../services/employeeService";
import type { CreateEmployeeInput } from "../types/employee";

export const useEmployeeForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createEmployee = async (data: CreateEmployeeInput) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await employeeService.create(data);
            setSuccess(true);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || "Error al crear empleado";
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { createEmployee, loading, error, success };
};