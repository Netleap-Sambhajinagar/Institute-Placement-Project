import { NavLink } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, Briefcase, MapPin, Info, MessageCircle } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/courses', label: 'courses', icon: <GraduationCap size={20} /> },
        { path: '/jobs', label: 'jobs', icon: <Briefcase size={20} /> },
        { path: '/internships', label: 'internships', icon: <MapPin size={20} /> },
        { path: '/about', label: 'about portal', icon: <Info size={20} /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0 shadow-sm">
            <div className="p-6 flex justify-center border-b border-gray-50">
                <img src="https://nitssoftwares.com/images/logo.png" alt="NITS" className="h-10" />
            </div>

            <nav className="flex-1 mt-4 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-full flex items-center space-x-4 px-6 py-4 transition-all duration-200 border-r-4 ${isActive
                                ? 'bg-red-50 text-red-600 border-red-600 font-bold'
                                : 'text-gray-400 border-transparent hover:bg-gray-50 hover:text-gray-600'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="capitalize">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6">
                <button className="w-full bg-[#FF0000] hover:bg-[#D90000] text-white rounded-full py-3 px-4 flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-200 transition-all active:scale-95">
                    <MessageCircle size={18} fill="white" />
                    <span className="text-sm font-bold uppercase tracking-wider">chat with us</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
