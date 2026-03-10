import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            <Navbar />
            <div className="d-flex">
                <Sidebar />
                <div style={{ flex: 1 }} className="bg-light p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};