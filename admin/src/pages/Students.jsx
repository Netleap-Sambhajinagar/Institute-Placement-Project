import React from "react";
import { Link } from "react-router-dom";

export default function Students() {
    return (
        <div className="space-y-8">

            {/* Page Title */}
            <h1 className="text-3xl font-bold">Students</h1>


            {/* Filter Section */}
            <div className="bg-white p-5 rounded-none shadow-sm border border-gray-100 flex gap-4 items-center">

                <input
                    type="text"
                    placeholder="Search Student"
                    className="border border-gray-300 rounded-none px-4 py-2 w-60 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                />

                <select className="border border-gray-300 rounded-none px-4 py-2 w-40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all cursor-pointer">
                    <option>Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>

                <select className="border border-gray-300 rounded-none px-4 py-2 w-40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all cursor-pointer">
                    <option>Course</option>
                    <option>Full Stack</option>
                    <option>Data Science</option>
                </select>

                <select className="border border-gray-300 rounded-none px-4 py-2 w-40 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all cursor-pointer">
                    <option>Branch</option>
                    <option>Pune</option>
                    <option>Mumbai</option>
                </select>

                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-none text-sm font-bold transition-colors">
                    Apply Filter
                </button>

            </div>



            {/* Student List */}
            <div className="bg-white rounded-lg shadow">

                <h2 className="text-2xl font-semibold p-5">
                    Student List
                </h2>

                <table className="w-full">

                    {/* Table Head */}
                    <thead className="bg-red-100 text-gray-700 text-sm">

                        <tr>
                            <th className="text-left p-4">Student Name</th>
                            <th className="text-left p-4">Course</th>
                            <th className="text-left p-4">Company</th>
                            <th className="text-left p-4">Duration</th>
                            <th className="text-left p-4">Start Date</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Action</th>
                        </tr>

                    </thead>


                    {/* Table Body */}
                    <tbody className="text-gray-600">

                        {[1, 2, 3, 4].map((item) => (
                            <tr key={item} className="border-t">

                                <td className="p-4">Rahul Patil</td>
                                <td className="p-4 text-sm">6 Months</td>
                                <td className="p-4 text-sm">Infosys</td>
                                <td className="p-4 text-sm">3 Months</td>
                                <td className="p-4 text-sm">03-05-2026</td>

                                <td className="p-4 text-sm text-green-600 font-semibold">
                                    Active
                                </td>

                                <td className="p-4 text-sm">
                                    <Link to="/students/1" className="text-blue-600 font-medium hover:underline">
                                        View
                                    </Link>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}