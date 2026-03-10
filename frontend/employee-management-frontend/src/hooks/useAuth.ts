import { useState } from "react";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
    const { user, isAuthenticated, setUser, logout: logoutStore } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(email, password);
            setUser(response);
            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || "Login failed";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        logoutStore();
    };

    return { user, isAuthenticated, loading, error, login, logout };
};