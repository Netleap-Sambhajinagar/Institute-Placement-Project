import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const CourseCard = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" alt="Course" className="h-40 w-full object-cover" />
        <div className="p-5">
            <h3 className="font-bold text-slate-800 text-lg">Full Stack Development</h3>
            <p className="text-sm text-gray-500 mt-1">Sarah Jenkins • Lead Dev at TechFlow</p>

            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center text-gray-400 text-sm">
                    <Clock size={16} className="mr-1" />
                    <span>48 Hours</span>
                </div>
                <Link to="/courses/1" className="text-red-600 font-bold text-sm hover:underline">
                    View Details
                </Link>
            </div>
        </div>
    </div>
);

const Courses = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Explore Courses</h1>
            <p className="text-gray-500 mt-2 mb-8">Master new skills and prepare yourself for the upcoming placement season.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <CourseCard key={i} />)}
            </div>
        </div>
    );
};

export default Courses;