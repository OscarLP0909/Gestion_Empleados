import { useState, useEffect } from "react";
import apiClient from "../services/api";

export const useEmployees = () => {
    const [employeeCount, setEmployeeCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/employee");
                setEmployeeCount(response.data.length);
            } catch (error) {
                console.error("Error fetching employees:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return { employeeCount, loading };
};