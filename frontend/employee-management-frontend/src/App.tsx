import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { LoginForm } from "./components/Auth/LoginForm";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { EmployeesPage } from "./components/Employees/EmployeesPage";
import { CreateEmployeeForm } from "./components/Employees/CreateEmployeeForm";
import { EmployeeDetail } from "./components/Employees/EmployeeDetail";
import { EditEmployeeForm } from "./components/Employees/EditEmployeeForm";
import { ContractsPage } from "./components/Contracts/ContractsPage";
import { ContractDetail } from "./components/Contracts/ContractDetail";
import { CreateContractForm } from "./components/Contracts/CreateContractForm";
import { EditContractForm } from "./components/Contracts/EditContractForm";
import { ContractApprovalsPage } from "./components/Contracts/ContractApprovalsPage";
import { ReportsPage } from "./components/Reports/ReportsPage";
import { UsersPage } from "./components/Users/UsersPage";

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
                            <ContractsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/contracts/new"
                    element={
                        <ProtectedRoute>
                            <CreateContractForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contracts/:id"
                    element={
                        <ProtectedRoute>
                            <ContractDetail />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contracts/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EditContractForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/contract-approvals"
                    element={
                        <ProtectedRoute>
                            <ContractApprovalsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <ReportsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <UsersPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}