import {
    Users,
    BookOpen,
    Briefcase,
    Trophy
} from "lucide-react";

export default function Dashboard() {
    const stats = [
        { label: "Total Students", value: "245", icon: <Users className="text-blue-600" />, bgColor: "bg-blue-50" },
        { label: "Active Courses", value: "12", icon: <BookOpen className="text-green-600" />, bgColor: "bg-green-50" },
        { label: "Internships", value: "40", icon: <Briefcase className="text-purple-600" />, bgColor: "bg-purple-50" },
        { label: "Placements", value: "122", icon: <Trophy className="text-yellow-600" />, bgColor: "bg-yellow-50" },
    ];

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`${stat.bgColor} p-3 rounded-lg`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Students */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Recent Students</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left">
                                <th className="p-4 text-sm font-semibold text-gray-600">Student Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Course</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Enroll Date</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-sm text-gray-700 font-medium">Alex Johnson</td>
                                <td className="p-4 text-sm text-gray-600">alex@example.com</td>
                                <td className="p-4 text-sm text-gray-600">Full Stack</td>
                                <td className="p-4 text-sm text-gray-600">Feb 12 2026</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                        Enrolled
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
