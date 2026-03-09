import { Search, Bell, User } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-xl font-bold text-slate-800">Welcome back, student name</h2>

            <div className="flex items-center space-x-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search jobs, events..."
                        className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <Bell className="text-gray-500 cursor-pointer hover:text-red-600" size={22} />

                <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-800 leading-none">student name</p>
                        <p className="text-xs text-gray-400">CS Senior, 2024</p>
                    </div>
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <User size={24} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;