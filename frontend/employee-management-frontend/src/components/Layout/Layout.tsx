import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div>
            <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
            <div className="d-flex">
                <Sidebar isOpen={sidebarOpen} />
                <div
                    style={{
                        flex: 1,
                        transition: "all 0.3s ease",
                    }}
                    className="bg-light p-4"
                >
                    {children}
                </div>
            </div>
        </div>
    );
};