import React from "react";
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {

    const navigate = useNavigate();

    return (
        <div className="space-y-8">

            {/* Breadcrumb */}
            <p className="text-gray-500">
                Students &gt; Student List &gt; <span className="text-black font-semibold">Student Name</span>
            </p>


            {/* Page Title */}
            <h1 className="text-3xl font-bold">Student Profile</h1>



            {/* Student Basic Info */}
            <div className="bg-white p-6 rounded-lg border">

                <div className="flex justify-between">

                    <div>
                        <h2 className="text-2xl font-semibold">Shreya Mehta</h2>
                        <p className="text-gray-500">student ID: NITSIN000001</p>
                    </div>

                    <div className="flex gap-10">

                        <div>
                            <p className="text-gray-500 text-sm">Age</p>
                            <p>25 years</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Branch</p>
                            <p>Nashik</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Domain</p>
                            <p>Web Development</p>
                        </div>

                    </div>

                </div>

            </div>



            {/* Internship Details */}
            <div className="bg-white p-6 rounded-lg border">

                <h2 className="text-xl font-semibold mb-5">
                    Internship Details
                </h2>

                <div className="grid grid-cols-4 gap-4">

                    <InfoCard title="Admission Date" value="12 Feb 2026" />
                    <InfoCard title="Internship Category" value="Paid" />
                    <InfoCard title="Internship Duration" value="3 Months" />
                    <InfoCard title="Internship Fees" value="NA" />
                    <InfoCard title="Mode of Payment" value="None" />

                </div>

            </div>



            {/* Placement Details */}
            <div className="bg-white p-6 rounded-lg border">

                <h2 className="text-xl font-semibold mb-5">
                    Placement Details
                </h2>

                <div className="grid grid-cols-4 gap-4">

                    <InfoCard title="Placement Status" value="Placed" />
                    <InfoCard title="Placement Date" value="15 Aug 2026" />
                    <InfoCard title="Company Name" value="Infosys" />
                    <InfoCard title="Job Role" value="Software Engineer" />
                    <InfoCard title="Package" value="6 LPA" />
                    <InfoCard title="Placement Type" value="Full Time" />
                    <InfoCard title="Location" value="Pune" />

                </div>

            </div>



            {/* Back Button */}
            <div className="flex justify-end">

                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                    ← Back
                </button>

            </div>

        </div>
    );
}



function InfoCard({ title, value }) {
    return (
        <div className="border rounded-lg p-4">
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="font-medium">{value}</p>
        </div>
    );
}