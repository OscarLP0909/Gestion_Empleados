import { useEffect, useState } from "react";
import { contractService } from "../services/contractService";
import type { Contract } from "../types/contract";

export const useContractsAdvanced = () => {
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

    // Próximos contratos a finalizar (en los próximos 30 días)
    const getUpcomingExpiringContracts = () => {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        return contracts
            .filter((c) => {
                if (!c.endDate || c.status === "FINALIZADO") return false;
                const endDate = new Date(c.endDate);
                return endDate >= today && endDate <= thirtyDaysFromNow;
            })
            .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
            .slice(0, 5); // Top 5
    };

    // Contratos próximos a empezar
    const getUpcomingStartingContracts = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return contracts
        .filter((c) => {
            if (c.status === "PENDIENTE" || c.status === "RECHAZADO") return false;
            const startDate = new Date(c.startDate);
            return startDate >= today && startDate <= thirtyDaysFromNow;
        })
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 5); // Top 5
};

    // Contratos pendientes de aprobación
    const getPendingApprovalContracts = () => {
        return contracts
            .filter((c) => c.status === "PENDIENTE")
            .sort(
                (a, b) =>
                    new Date(b.createdAt || 0).getTime() -
                    new Date(a.createdAt || 0).getTime()
            )
            .slice(0, 5); // Top 5
    };

    // Contratos activos
    const getActiveContracts = () => {
        return contracts.filter((c) => c.status === "ACTIVO").length;
    };

    // Contratos por estado
    const getContractsByStatus = () => {
        return {
            pending: contracts.filter((c) => c.status === "PENDIENTE").length,
            approved: contracts.filter((c) => c.status === "APROBADO").length,
            active: contracts.filter((c) => c.status === "ACTIVO").length,
            rejected: contracts.filter((c) => c.status === "RECHAZADO").length,
            finalized: contracts.filter((c) => c.status === "FINALIZADO").length,
        };
    };

    return {
    contracts,
    loading,
    error,
    upcomingExpiringContracts: getUpcomingExpiringContracts(),
    upcomingStartingContracts: getUpcomingStartingContracts(), 
    pendingApprovalContracts: getPendingApprovalContracts(),
    activeContractCount: getActiveContracts(),
    contractsByStatus: getContractsByStatus(),
};
};