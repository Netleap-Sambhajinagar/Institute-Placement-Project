import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getStudentById } from "../api/studentsApi";
import { getInternApplications } from "../api/internsApi";
import { getInternships } from "../api/internshipsApi";
import { getPlacedStudents } from "../api/placedStudentsApi";
import { getCourseEnrollmentsByStudent } from "../api/courseEnrollmentsApi";
import { getCourses } from "../api/coursesApi";

function formatDisplayDate(value) {
  if (!value) return "NA";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "NA";

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calculateAge(dob) {
  if (!dob) return "NA";

  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return "NA";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return `${age} years`;
}


function formatPackage(value) {
  if (value === null || value === undefined || value === "") return "NA";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `Rs ${amount.toLocaleString()}`;
}

function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "NA";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `Rs ${amount.toLocaleString()}`;
}

function toTitle(value) {
  const text = String(value || "").trim();
  if (!text) return "NA";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export default function StudentProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profileData, setProfileData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const [
          studentData,
          internApplications,
          internships,
          coursesResponse,
          placedStudents,
        ] = await Promise.all([
          getStudentById(id),
          getInternApplications(),
          getInternships(),
          getCourses(),
          getPlacedStudents(),
        ]);

        if (!studentData) {
          setProfileData(null);
          return;
        }

        const studentId = Number(studentData.id);
        const courses = Array.isArray(coursesResponse?.data)
          ? coursesResponse.data
          : [];
        const enrollments = await getCourseEnrollmentsByStudent(studentId);

        const studentInternApplications = Array.isArray(internApplications)
          ? internApplications
              .filter((item) => Number(item.studentId) === studentId)
              .sort(
                (a, b) =>
                  new Date(b.createdAt || 0).getTime() -
                  new Date(a.createdAt || 0).getTime(),
              )
          : [];

        const internshipRecords = studentInternApplications.map(
          (application) => {
            const linkedInternship = Array.isArray(internships)
              ? internships.find(
                  (item) =>
                    Number(item.id) === Number(application?.internshipId || -1),
                )
              : null;

            const stipendValue =
              application?.stipend ?? linkedInternship?.stipend;

            return {
              title: linkedInternship?.title || "NA",
              category: toTitle(
                application?.category || linkedInternship?.category,
              ),
              duration: linkedInternship?.duration
                ? `${linkedInternship.duration} Months`
                : "NA",
              workType:
                linkedInternship?.work_type ||
                linkedInternship?.workType ||
                "NA",
              branch: linkedInternship?.branch || "NA",
              stipend: formatMoney(stipendValue),
              status: toTitle(application?.status),
              startDate: formatDisplayDate(application?.start_date),
              endDate: formatDisplayDate(application?.end_date),
            };
          },
        );

        const enrolledCourses = Array.isArray(enrollments)
          ? enrollments
              .map((enrollment) => {
                const course = courses.find(
                  (item) => Number(item.id) === Number(enrollment.courseId),
                );

                return {
                  title: course?.title || "NA",
                  instructor: course?.instructor || "NA",
                  level: course?.level || "NA",
                  duration: course?.duration || "NA",
                  fees: formatMoney(course?.fees),
                  courseStatus: toTitle(course?.status),
                  enrollmentStatus: toTitle(enrollment?.status),
                  enrolledAt: formatDisplayDate(enrollment?.enrolledAt),
                };
              })
              .sort((a, b) => String(a.title).localeCompare(String(b.title)))
          : [];

        const studentPlacedRecords = Array.isArray(placedStudents)
          ? placedStudents
              .filter((item) => Number(item.studentId) === studentId)
              .sort(
                (a, b) =>
                  new Date(b.placementDate || 0).getTime() -
                  new Date(a.placementDate || 0).getTime(),
              )
          : [];

        const placementRecords = studentPlacedRecords.map((placement) => ({
          companyName: placement?.company || "NA",
          jobRole: placement?.position || "NA",
          packageValue: formatPackage(placement?.salary),
          placementDate: formatDisplayDate(placement?.placementDate),
          placementType: "Full Time",
        }));

        setProfileData({
          student: {
            name: studentData.name || "Student",
            studentId: `NITS${String(studentData.id || id).padStart(3, "0")}`,
            age: calculateAge(studentData.DOB),
            gender: toTitle(studentData.gender),
            phone: studentData.phone || "NA",
            email: studentData.email || "NA",
            college: studentData.college || "NA",
            education: studentData.education || "NA",
            domain: studentData.domain || "NA",
            dob: formatDisplayDate(studentData.DOB),
            admissionDate: formatDisplayDate(studentData.createdAt),
          },
          internships: internshipRecords,
          courses: enrolledCourses,
          placements: placementRecords,
        });
      } catch (error) {
        console.error("Failed to fetch student profile:", error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <div className="bg-white p-6 rounded-lg border text-gray-600">
          Loading student...
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <div className="bg-white p-6 rounded-lg border text-gray-600">
          Student not found.
        </div>
        <div className="flex justify-end">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            ← Back
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-gray-500">
        Students &gt; Student List &gt;{" "}
        <span className="text-black font-semibold">
          {profileData.student.name}
        </span>
      </p>

      <h1 className="text-3xl font-bold">Student Profile</h1>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-5">Student Information</h2>

        <div className="border rounded-lg p-4 mb-4 bg-slate-50/70">
          <h3 className="text-2xl font-semibold text-gray-900">
            {profileData.student.name}
          </h3>
          <p className="text-gray-600 mt-1">
            Student ID: {profileData.student.studentId}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard title="Age" value={profileData.student.age} />
          <InfoCard title="Gender" value={profileData.student.gender} />
          <InfoCard title="Phone" value={profileData.student.phone} />
          <InfoCard title="Email" value={profileData.student.email} />
          <InfoCard title="College" value={profileData.student.college} />
          <InfoCard title="Education" value={profileData.student.education} />
          <InfoCard title="Domain" value={profileData.student.domain} />
          <InfoCard title="DOB" value={profileData.student.dob} />
          <InfoCard
            title="Admission Date"
            value={profileData.student.admissionDate}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-5">Internship Details</h2>

        {profileData.internships.length === 0 ? (
          <p className="text-sm text-gray-500">
            No internship applications found.
          </p>
        ) : (
          <div className="space-y-4">
            {profileData.internships.map((internship, index) => (
              <div
                key={`${internship.title}-${index}`}
                className="border rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-900 mb-3">
                  {internship.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard title="Category" value={internship.category} />
                  <InfoCard title="Duration" value={internship.duration} />
                  <InfoCard title="Work Type" value={internship.workType} />
                  <InfoCard title="Branch" value={internship.branch} />
                  <InfoCard title="Stipend" value={internship.stipend} />
                  <InfoCard title="Status" value={internship.status} />
                  <InfoCard title="Start Date" value={internship.startDate} />
                  <InfoCard title="End Date" value={internship.endDate} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-5">Courses Details</h2>

        {profileData.courses.length === 0 ? (
          <p className="text-sm text-gray-500">No enrolled courses found.</p>
        ) : (
          <div className="space-y-4">
            {profileData.courses.map((course, index) => (
              <div
                key={`${course.title}-${index}`}
                className="border rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-900 mb-3">
                  {course.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard title="Instructor" value={course.instructor} />
                  <InfoCard title="Level" value={course.level} />
                  <InfoCard title="Duration" value={String(course.duration)} />
                  <InfoCard title="Fees" value={course.fees} />
                  <InfoCard title="Course Status" value={course.courseStatus} />
                  <InfoCard
                    title="Enrollment Status"
                    value={course.enrollmentStatus}
                  />
                  <InfoCard title="Enrolled At" value={course.enrolledAt} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-5">Placement Details</h2>

        {profileData.placements.length === 0 ? (
          <p className="text-sm text-gray-500">No placement records found.</p>
        ) : (
          <div className="space-y-4">
            {profileData.placements.map((placement, index) => (
              <div
                key={`${placement.companyName}-${index}`}
                className="border rounded-lg p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard
                    title="Placement Date"
                    value={placement.placementDate}
                  />
                  <InfoCard
                    title="Company Name"
                    value={placement.companyName}
                  />
                  <InfoCard title="Job Role" value={placement.jobRole} />
                  <InfoCard title="Package" value={placement.packageValue} />
                  <InfoCard
                    title="Placement Type"
                    value={placement.placementType}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          ← Back
        </motion.button>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  const valueClassName =
    title === "Email"
      ? "font-medium break-all leading-snug"
      : "font-medium break-words leading-snug";

  return (
    <div className="border rounded-lg p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}
