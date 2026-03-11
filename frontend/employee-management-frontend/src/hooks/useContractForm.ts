import { useState } from "react";
import { contractService } from "../services/contractService";
import type { CreateContractInput } from "../types/contract";

export const useContractForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createContract = async (data: CreateContractInput) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await contractService.create(data);
            setSuccess(true);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || "Error al crear contrato";
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { createContract, loading, error, success };
};
