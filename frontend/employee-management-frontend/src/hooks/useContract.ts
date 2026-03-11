import { useEffect, useState } from "react";
import { contractService } from "../services/contractService";
import type { Contract } from "../types/contract";

export const useContracts = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await contractService.getAll();
            setContracts(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar contratos");
        } finally {
            setLoading(false);
        }
    };

    const contractCount = contracts.length;
    const approvedContractCount = contracts.filter(c => c.status === "APROBADO").length;
    const activeContractCount = contracts.filter(c => c.status === "ACTIVO").length;
    const pendingContractCount = contracts.filter(c => c.status === "PENDIENTE").length;
    const rejectedContractCount = contracts.filter(c => c.status === "RECHAZADO").length;
    const finalizedContractCount = contracts.filter(c => c.status === "FINALIZADO").length;

    return {
        contracts,
        contractCount,
        approvedContractCount,
        activeContractCount,
        pendingContractCount,
        rejectedContractCount,
        finalizedContractCount,
        loading,
        error,
        fetchContracts,
    };
};