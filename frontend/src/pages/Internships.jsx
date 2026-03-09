import { MapPin, Calendar, DollarSign, Bookmark } from 'lucide-react';

const InternshipCard = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-xl font-bold text-slate-800">Frontend Developer Intern</h3>
        <p className="text-gray-400 mt-1 mb-6 text-sm">TechFlow Systems</p>

        <div className="space-y-3 mb-8">
            <div className="flex items-center text-gray-500 text-sm italic">
                <MapPin size={16} className="mr-3 text-gray-400" /> Remote
            </div>
            <div className="flex items-center text-gray-500 text-sm italic">
                <Calendar size={16} className="mr-3 text-gray-400" /> 6 months
            </div>
            <div className="flex items-center text-gray-500 text-sm italic">
                <DollarSign size={16} className="mr-3 text-gray-400" /> $1,200/mo
            </div>
        </div>

        <div className="flex items-center gap-3 mt-auto">
            <button className="flex-1 bg-[#FF0000] text-white font-bold py-2.5 rounded-lg hover:bg-red-700 transition-colors">
                Apply Now
            </button>
            <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Bookmark size={20} className="text-gray-400" />
            </button>
        </div>
    </div>
);

const Internships = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-900">Explore internshos opportunities</h1>
        <p className="text-gray-500 mt-1 mb-8">Discover the best opportunities from industry leaders.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <InternshipCard key={i} />)}
        </div>
    </div>
);

export default Internships;