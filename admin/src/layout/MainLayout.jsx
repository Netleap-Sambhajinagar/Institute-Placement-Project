import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex h-screen bg-gray-100">

            <Sidebar />

            <div className="flex flex-col flex-1">
                <Navbar />

                <main className="p-6 overflow-y-auto">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}