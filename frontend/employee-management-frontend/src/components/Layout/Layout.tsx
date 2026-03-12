import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
            {/* Navbar */}
            <Navbar onToggleSidebar={toggleSidebar} />

            {/* Contenedor principal */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} />

                {/* Contenido principal */}
                <main
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        padding: "20px",
                        backgroundColor: "var(--bs-body-bg)",
                        color: "var(--bs-body-color)",
                        transition: "background-color 0.2s ease",
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};