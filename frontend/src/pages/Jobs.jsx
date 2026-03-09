import React from 'react';
import { Bookmark, DollarSign, Clock } from 'lucide-react';

const JobRow = () => (
    <div className="bg-white p-4 mb-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
            {/* Icon Placeholder (Purple box in UI) */}
            <div className="w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-xl italic">
                A
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-lg">Senior Software Engineer</h3>
                <div className="flex items-center space-x-4 mt-1">
                    <span className="flex items-center text-gray-400 text-sm">
                        <DollarSign size={14} className="mr-1" /> $165k - $240k
                    </span>
                    <span className="flex items-center text-gray-400 text-sm">
                        <Clock size={14} className="mr-1" /> Full-time
                    </span>
                </div>
            </div>
        </div>

        <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-red-600">
                <Bookmark size={22} />
            </button>
            <button className="bg-[#FF0000] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors">
                Apply Now
            </button>
        </div>
    </div>
);

const Jobs = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Explore Job Openings</h1>
            <p className="text-gray-500 mt-2 mb-8 text-lg">
                Discover the best opportunities from industry leaders around the globe.
            </p>

            <div className="space-y-4">
                {[...Array(5)].map((_, i) => <JobRow key={i} />)}
            </div>
        </div>
    );
};

export default Jobs;