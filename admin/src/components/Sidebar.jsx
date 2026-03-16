import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Briefcase,
    BriefcaseBusiness
} from "lucide-react";

export default function Sidebar() {
    const menuItems = [
        { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { to: "/students", label: "Students", icon: <Users size={20} /> },
        { to: "/courses", label: "Courses", icon: <BookOpen size={20} /> },
        { to: "/internships", label: "Internships", icon: <Briefcase size={20} /> },
        { to: "/jobs", label: "Jobs", icon: <BriefcaseBusiness size={20} /> },
    ];

    return (
        <div className="w-64 bg-white border-r h-screen shadow-sm flex flex-col">
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
        </div>
    );
}

