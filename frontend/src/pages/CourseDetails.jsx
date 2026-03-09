import { CheckCircle, PlayCircle, FileText, Infinity, Smartphone, Award } from 'lucide-react';

const CourseDetails = ({ course, onBack }) => {
    return (
        <div className="animate-fadeIn">
            <button onClick={onBack} className="mb-6 text-gray-500 hover:text-red-600 font-medium">← Back to Courses</button>

            {/* Hero Section */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8">
                <div className="h-64 bg-slate-900 relative">
                    <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" className="w-full h-full object-cover opacity-40" alt="banner" />
                </div>
                <div className="p-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Full Stack Development Masterclass</h1>
                        <div className="flex items-center space-x-4 mt-3 text-sm font-medium">
                            <span className="text-red-500 flex items-center">📊 Beginner</span>
                            <span className="text-gray-400">🕒 12 Weeks</span>
                            <span className="text-gray-400">⭐ 4.8 (2,450 Reviews)</span>
                        </div>
                    </div>
                    <button className="bg-[#FF0000] text-white px-10 py-3 rounded-xl font-bold text-lg hover:bg-red-700 shadow-lg shadow-red-200 transition-all">
                        Enroll Now
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Overview */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-2xl border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Course Overview</h2>
                        <p className="text-gray-500 leading-relaxed">This comprehensive course is designed to take you from a complete beginner to a confident Full Stack Developer. We focus on the MERN stack...</p>

                        <h3 className="text-lg font-bold mt-8 mb-4">What you'll learn</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["Master HTML5, CSS3 & JS", "React Hooks & UI", "Node.js & Express APIs", "MongoDB & SQL"].map(item => (
                                <div key={item} className="flex items-start space-x-3 text-gray-600">
                                    <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Features */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold mb-6 text-slate-800">This course includes:</h2>
                    <ul className="space-y-5">
                        {[
                            { icon: <PlayCircle size={20} />, text: "48 hours video content" },
                            { icon: <FileText size={20} />, text: "12 downloadable resources" },
                            { icon: <Infinity size={20} />, text: "Full lifetime access" },
                            { icon: <Smartphone size={20} />, text: "Access on mobile/laptop" },
                            { icon: <Award size={20} />, text: "Certificate of completion" }
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center space-x-4 text-gray-500 font-medium">
                                <span className="text-red-500">{item.icon}</span>
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
