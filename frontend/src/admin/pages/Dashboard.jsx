import { Users, BookOpen, Briefcase, Trophy, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StudentForm from "../../components/StudentForm";
import Toast from "../../components/Toast";
import useToast from "../../hooks/useToast";
import { AnimatePresence, motion } from "framer-motion";
import {
  modalBackdropVariants,
  modalPanelVariants,
} from "../../utils/modalMotion";
import { addStudent, getStudentsUpdatedEventName } from "../../api/studentsApi";
import { getCoursesUpdatedEventName } from "../../api/coursesApi";
import { getInternshipsUpdatedEventName } from "../../api/internshipsApi";
import {
  fetchAdminDashboard,
  markAdminDashboardStale,
  selectAdminDashboardData,
  selectAdminDashboardStatus,
} from "../../store/slices/adminDashboardSlice";
function formatDashboardDate(value) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const initialForm = useMemo(
    () => ({
      name: "",
      email: "",
      phone: "",
      password: "",
      gender: "",
      DOB: "",
      education: "",
      college: "",
      domain: "",
    }),
    [],
  );

  const dashboardData = useSelector(selectAdminDashboardData);
  const dashboardStatus = useSelector(selectAdminDashboardStatus);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const { toast, showToast } = useToast();
  const dashboardLoading =
    dashboardStatus === "loading" || dashboardStatus === "idle";

  const stats = useMemo(
    () => [
      {
        label: "Total Students",
        value: String(dashboardData.stats.totalStudents || 0),
        icon: <Users className="text-blue-600" />,
        bgColor: "bg-blue-50",
      },
      {
        label: "Active Courses",
        value: String(dashboardData.stats.activeCourses || 0),
        icon: <BookOpen className="text-green-600" />,
        bgColor: "bg-green-50",
      },
      {
        label: "Internships",
        value: String(dashboardData.stats.internships || 0),
        icon: <Briefcase className="text-purple-600" />,
        bgColor: "bg-purple-50",
      },
      {
        label: "Placements",
        value: String(dashboardData.stats.placements || 0),
        icon: <Trophy className="text-yellow-600" />,
        bgColor: "bg-yellow-50",
      },
    ],
    [dashboardData],
  );

  useEffect(() => {
    if (dashboardStatus === "idle") {
      dispatch(fetchAdminDashboard());
    }
  }, [dashboardStatus, dispatch]);

  useEffect(() => {
    const studentsUpdatedEvent = getStudentsUpdatedEventName();
    const coursesUpdatedEvent = getCoursesUpdatedEventName();
    const internshipsUpdatedEvent = getInternshipsUpdatedEventName();

    const syncDashboard = () => {
      dispatch(markAdminDashboardStale());
    };

    window.addEventListener("storage", syncDashboard);
    window.addEventListener(studentsUpdatedEvent, syncDashboard);
    window.addEventListener(coursesUpdatedEvent, syncDashboard);
    window.addEventListener(internshipsUpdatedEvent, syncDashboard);

    return () => {
      window.removeEventListener("storage", syncDashboard);
      window.removeEventListener(studentsUpdatedEvent, syncDashboard);
      window.removeEventListener(coursesUpdatedEvent, syncDashboard);
      window.removeEventListener(internshipsUpdatedEvent, syncDashboard);
    };
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseStudentForm = () => {
    setShowStudentForm(false);
    setFormData(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalized = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      gender: formData.gender,
      DOB: formData.DOB || null,
      education: formData.education.trim(),
      college: formData.college.trim(),
      domain: formData.domain.trim(),
    };

    if (
      !normalized.name ||
      !normalized.email ||
      !normalized.phone ||
      !normalized.password
    ) {
      showToast("Name, email, phone and password are required.", "error");
      return;
    }

    await addStudent(normalized);
    dispatch(markAdminDashboardStale());
    showToast("Student added successfully.");
    handleCloseStudentForm();
  };

  return (
    <div className="space-y-8">
      <Toast toast={toast} />

      <AnimatePresence>
        {showStudentForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="fixed inset-0 bg-slate-900/40 z-40"
              variants={modalBackdropVariants}
              onClick={handleCloseStudentForm}
              aria-hidden="true"
            />
            <motion.div
              variants={modalPanelVariants}
              className="relative z-50 w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add Student
                </h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={handleCloseStudentForm}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center justify-center rounded-sm cursor-pointer"
                  aria-label="Close add student form"
                >
                  <X size={18} />
                </motion.button>
              </div>
              <div className="p-5">
                <StudentForm
                  formData={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onCancel={handleCloseStudentForm}
                  submitLabel="Save Student"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`${stat.bgColor} p-3 rounded-lg`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {dashboardLoading && (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl px-5 py-6 text-sm text-slate-500">
          Loading dashboard data...
        </div>
      )}

      {/* Recent Students */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-3">
          <h2 className="text-3xl font-bold text-gray-900 leading-none">
            Recent Students
          </h2>
          <motion.div className="flex items-center gap-3">
            <motion.div whileTap={{ scale: 0.92 }}>
              <Link
                to="/admin/students"
                className="bg-blue-600 rounded-sm hover:bg-blue-700 text-white px-5 py-2 text-sm font-semibold transition-colors cursor-pointer inline-flex items-center"
              >
                View All Students
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-red-100/60">
              <tr className="text-left">
                <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Student ID
                </th>
                <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Student Name
                </th>
                <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Email
                </th>
                <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Domain
                </th>
                <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Education
                </th>
                <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Institute
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {dashboardData.recentStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-900 font-semibold">
                    <Link
                      to={`/admin/students/${student.id}`}
                      className="hover:text-red-600 transition-colors"
                    >
                      NITS{String(student.id ?? "").padStart(3, "0")}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {student.name || "-"}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {student.email || "-"}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {student.domain || "-"}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {student.education || "-"}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {student.college || "-"}
                  </td>
                </tr>
              ))}

              {!dashboardLoading &&
                dashboardData.recentStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-6 text-center text-sm text-gray-500"
                    >
                      No recent students found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
