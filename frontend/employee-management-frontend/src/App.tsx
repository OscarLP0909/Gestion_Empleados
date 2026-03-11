import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { LoginForm } from "./components/Auth/LoginForm";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { EmployeesPage } from "./components/Employees/EmployeesPage";
import { CreateEmployeeForm } from "./components/Employees/CreateEmployeeForm";
import { EmployeeDetail } from "./components/Employees/EmployeeDetail";
import { EditEmployeeForm } from "./components/Employees/EditEmployeeForm";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute>
                            <EmployeesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees/new"
                    element={
                        <ProtectedRoute>
                            <CreateEmployeeForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employees/:id"
                    element={
                        <ProtectedRoute>
                            <EmployeeDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EditEmployeeForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contracts"
                    element={
                        <ProtectedRoute>
                            <div className="p-4">
                                <h2>Contratos (Próximamente)</h2>
                            </div>
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}