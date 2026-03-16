import React from "react";
import { BookOpen, MapPin, BriefcaseBusiness, Plus } from "lucide-react";

export default function Jobs() {
    const jobList = [
        { name: "Rahul Patil", role: "Software Developer", company: "Infosys", type: "Full Time", location: "Pune", date: "02-01-2026", status: "Placed" },
        { name: "Rahul Patil", role: "Software Developer", company: "Infosys", type: "Full Time", location: "Pune", date: "02-01-2026", status: "Placed" },
        { name: "Rahul Patil", role: "Software Developer", company: "Infosys", type: "Full Time", location: "Pune", date: "02-01-2026", status: "Placed" },
        { name: "Rahul Patil", role: "Software Developer", company: "Infosys", type: "Full Time", location: "Pune", date: "02-01-2026", status: "Placed" },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-gray-900">Jobs</h1>

                <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-none text-sm font-bold transition-colors">
                    + Add jobs
                </button>

            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-none shadow-sm border border-gray-100 flex gap-4 items-center">

                <input
                    type="text"
                    placeholder="Search Jobs"
                    className="border border-gray-300 rounded-none px-4 py-2 w-60 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                />

                <select className="border border-gray-300 rounded-none px-4 py-2 w-40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all cursor-pointer">
                    <option>Location</option>
                    <option>Mumbai</option>
                    <option>Pune</option>
                </select>

                <select className="border border-gray-300 rounded-none px-4 py-2 w-40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all cursor-pointer">
                    <option>Domain</option>
                    <option>Full Stack</option>
                    <option>Data Science</option>
                </select>

                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-none text-sm font-bold transition-colors">
                    Apply Filter
                </button>

            </div>

            {/* Job List section */}
            <div className="bg-white rounded-lg shadow">

                <h2 className="text-2xl font-semibold p-5">
                    Job List
                </h2>

                <table className="w-full">

                    {/* Table Head */}
                    <thead className="bg-red-100 text-gray-700 text-sm">
                        <tr>
                            <th className="text-left p-4">Student Name</th>
                            <th className="text-left p-4">Job Role</th>
                            <th className="text-left p-4">Company</th>
                            <th className="text-left p-4">Placement Type</th>
                            <th className="text-left p-4">Location</th>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Status</th>
                        </tr>
                    </thead>



                    {/* Table Body */}
                    <tbody className="text-gray-600">
                        {[1, 2, 3, 4].map((item) => (
                            <tr key={item} className="border-t">
                                <td className="p-4">Rahul Patil</td>
                                <td className="p-4">SDE</td>
                                <td className="p-4">Infosys</td>
                                <td className="p-4">Full time</td>
                                <td className="p-4">Pune</td>
                                <td className="p-4">03-05-2026</td>
                                <td className="p-4 text-green-600 font-semibold">
                                    Active
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
        </div>
    );
}
