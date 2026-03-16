import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Briefcase,
    BriefcaseBusiness,
    X,
} from "lucide-react";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
    const menuItems = [
        { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { to: "/admin/students", label: "Students", icon: <Users size={20} /> },
        { to: "/admin/courses", label: "Courses", icon: <BookOpen size={20} /> },
        { to: "/admin/internships", label: "Internships", icon: <Briefcase size={20} /> },
        { to: "/admin/jobs", label: "Jobs", icon: <BriefcaseBusiness size={20} /> },
    ];

    const navContent = (
        <>
            <div className="p-5 flex items-center gap-2 mb-8">
                <div className="bg-red-600 p-1.5 rounded-lg text-white">
                    <BookOpen size={24} />
                </div>
                <h1 className="font-bold text-xl tracking-tight">NETLEAP</h1>
            </div>

            <nav className="flex flex-col">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/admin"}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-6 py-4 transition-all duration-200 border-l-4 ${isActive
                                ? "bg-red-50 text-red-600 border-red-600 font-bold"
                                : "text-gray-400 border-transparent hover:bg-gray-50 hover:text-gray-600"
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </>
    );

    return (
        <>
            <aside className="hidden lg:flex w-64 bg-white border-r h-screen shadow-sm flex-col shrink-0">
                {navContent}
            </aside>

            <div
                className={`lg:hidden fixed inset-0 bg-slate-900/40 transition-opacity z-40 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            <aside
                className={`lg:hidden fixed top-0 left-0 h-screen w-[85vw] max-w-[320px] bg-white border-r shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                aria-hidden={!isOpen}
            >
                <div className="h-full flex flex-col">
                    <div className="flex justify-end p-3">
                        <motion.button whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center justify-center rounded-sm cursor-pointer"
                            aria-label="Close admin navigation"
                        >
                            <X size={18} />
                        </motion.button>
                    </div>
                    {navContent}
                </div>
            </aside>
        </>
    );
}

