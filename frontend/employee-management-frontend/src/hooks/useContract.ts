import { useState, useEffect } from "react";
import apiClient from "../services/api";

export const useContracts = () => {
    const [contractCount, setContractCount] = useState(0);
    const [activeContractCount, setActiveContractCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/contract");
                setContractCount(response.data.length);
                
                const activeCount = response.data.filter(
                    (c: any) => c.status === "ACTIVO"
                ).length;
                setActiveContractCount(activeCount);
            } catch (error) {
                console.error("Error fetching contracts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, []);

    return { contractCount, activeContractCount, loading };
};