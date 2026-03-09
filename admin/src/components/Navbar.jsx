import { Search, Bell, User } from "lucide-react";

export default function Navbar() {
    return (
        <div className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
            <h2 className="font-bold text-xl text-gray-800">
                Dashboard
            </h2>

            <div className="relative flex items-center">
                <Search className="absolute left-3 text-gray-400" size={18} />
                <input
                    className="border border-gray-300 rounded-none pl-10 pr-4 py-2 w-96 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium text-gray-700"
                    placeholder="Search students, courses, or jobs..."
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-gray-600 hover:text-red-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                        3
                    </span>
                </button>

                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:border-gray-200 cursor-pointer transition-all">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                        AD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800 leading-tight">Admin</span>
                        <span className="text-[10px] text-gray-500 font-medium">Super Admin</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
