import { memo, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Pencil,
  Award,
  CheckCircle,
  FileText,
  Infinity,
  PlayCircle,
  Smartphone,
} from "lucide-react";
import {
  getCourseById,
  getCoursesUpdatedEventName,
  updateCourse,
} from "../../api/coursesApi";
import { getCourseEnrollments } from "../../api/courseEnrollmentsApi";
import {
  getStudents,
  getStudentsUpdatedEventName,
} from "../../api/studentsApi";
import {
  modalBackdropVariants,
  modalPanelVariants,
} from "../../utils/modalMotion";

function formatDate(value) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-GB");
}

const includeIconByText = (text) => {
  const lowerText = String(text).toLowerCase();

  if (lowerText.includes("video")) return <PlayCircle size={20} />;
  if (lowerText.includes("resource")) return <FileText size={20} />;
  if (lowerText.includes("lifetime")) return <Infinity size={20} />;
  if (lowerText.includes("mobile") || lowerText.includes("laptop"))
    return <Smartphone size={20} />;

  return <Award size={20} />;
};

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    level: "Beginner",
    domain: "General",
    status: "Active",
    duration: "",
    fees: "",
    imageUrl: "",
    overview: "",
    whatYouLearnText: "",
    includesText: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadDetails = async () => {
      setLoading(true);

      try {
        const [courseResponse, enrollments, students] = await Promise.all([
          getCourseById(id),
          getCourseEnrollments(),
          getStudents(),
        ]);

        if (!isMounted) return;

        const courseData = courseResponse?.data || null;
        const studentList = Array.isArray(students) ? students : [];
        const enrollmentList = Array.isArray(enrollments) ? enrollments : [];

        const studentsById = new Map(
          studentList.map((student) => [Number(student.id), student]),
        );

        const enrolledRows = enrollmentList
          .filter((enrollment) => Number(enrollment.courseId) === Number(id))
          .map((enrollment) => {
            const student = studentsById.get(Number(enrollment.studentId));

            return {
              enrollmentId: enrollment.id,
              studentId: enrollment.studentId,
              status: enrollment.status || "active",
              enrolledAt: enrollment.enrolledAt,
              name: student?.name || "-",
              email: student?.email || "-",
              phone: student?.phone || "-",
              domain: student?.domain || "-",
              education: student?.education || "-",
            };
          });

        setCourse(courseData);
        setEnrolledStudents(enrolledRows);
        setError("");
      } catch {
        if (!isMounted) return;

        setCourse(null);
        setEnrolledStudents([]);
        setError("Unable to load course details.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    const coursesUpdatedEvent = getCoursesUpdatedEventName();
    const studentsUpdatedEvent = getStudentsUpdatedEventName();

    window.addEventListener("storage", loadDetails);
    window.addEventListener(coursesUpdatedEvent, loadDetails);
    window.addEventListener(studentsUpdatedEvent, loadDetails);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", loadDetails);
      window.removeEventListener(coursesUpdatedEvent, loadDetails);
      window.removeEventListener(studentsUpdatedEvent, loadDetails);
    };
  }, [id]);

  const summary = useMemo(
    () => ({
      enrolledCount: enrolledStudents.length,
      activeCount: enrolledStudents.filter(
        (student) => String(student.status).toLowerCase() === "active",
      ).length,
    }),
    [enrolledStudents],
  );

  const filteredEnrolledStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return enrolledStudents;

    return enrolledStudents.filter((student) =>
      [
        student.studentId,
        student.name,
        student.phone,
        student.domain,
        student.education,
        student.status,
      ].some((field) => String(field || "").toLowerCase().includes(query)),
    );
  }, [enrolledStudents, studentSearch]);

  const handleOpenEditForm = () => {
    if (!course) return;

    setFormError("");
    setFormData({
      title: course.title || "",
      instructor: course.instructor || "",
      level: course.level || "Beginner",
      domain: course.domain || course.branch || "General",
      status: course.status || "Active",
      duration: course.duration ? String(course.duration) : "",
      fees: course.fees ?? "",
      imageUrl: course.imageUrl || course.img || "",
      overview: course.overview || "",
      whatYouLearnText: Array.isArray(course.whatYouLearn)
        ? course.whatYouLearn.join("\n")
        : "",
      includesText: Array.isArray(course.includes)
        ? course.includes.join("\n")
        : "",
    });
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    if (saving) return;
    setShowEditForm(false);
    setFormError("");
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEditForm = async (event) => {
    event.preventDefault();
    if (saving) return;

    const payload = {
      title: formData.title.trim(),
      instructor: formData.instructor.trim(),
      level: formData.level,
      domain: formData.domain.trim(),
      status: formData.status,
      duration: Number(formData.duration) || 0,
      fees: Number(formData.fees) || 0,
      imageUrl: formData.imageUrl.trim(),
      overview: formData.overview.trim(),
      whatYouLearn: formData.whatYouLearnText
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean),
      includes: formData.includesText
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (!payload.title || !payload.instructor || !payload.level) {
      setFormError("Title, instructor and level are required.");
      return;
    }

    if (!payload.duration) {
      setFormError("Duration is required.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const updatedResponse = await updateCourse(Number(id), payload);
      setCourse(updatedResponse?.data || null);
      setShowEditForm(false);
    } catch {
      setFormError("Failed to update course. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 text-sm text-gray-500">
        Loading course details...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </Link>
        <div className="bg-white border border-red-100 rounded-xl p-6 text-sm text-red-600">
          {error || "Course not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          to="/admin/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </Link>

        <button
          type="button"
          onClick={handleOpenEditForm}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm text-sm font-semibold transition-colors"
        >
          <Pencil size={16} />
          Edit Course
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {course.title || "Course"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Instructor: {course.instructor || "-"}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              course.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {course.status || "-"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Duration
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {course.duration || "-"}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Category
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {course.domain || course.branch || "-"}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Enrolled
              </p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {summary.enrolledCount}
              </p>
            </div>
            <BookOpen className="text-red-600" size={18} />
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Active Enrollments
              </p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {summary.activeCount}
              </p>
            </div>
            <Users className="text-red-600" size={18} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-1">
            <h2 className="text-lg font-bold text-gray-900">Course Overview</h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {course.overview || "No overview available."}
            </p>
          </div>

          <div className="lg:w-56 flex-shrink-0">
            <div className="rounded-lg overflow-hidden bg-slate-900">
              <img
                src={course.imageUrl}
                className="w-full h-48 object-cover opacity-50"
                alt={course.title}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                What you will learn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(course.whatYouLearn) && course.whatYouLearn.length > 0 ? (
                  course.whatYouLearn.map((item) => (
                    <div
                      key={item}
                      className="flex items-start space-x-3 text-gray-600"
                    >
                      <CheckCircle
                        size={18}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No learning outcomes added yet.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                This course includes:
              </h3>
              <ul className="space-y-4">
                {Array.isArray(course.includes) && course.includes.length > 0 ? (
                  course.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-center space-x-3 text-gray-600 text-sm"
                    >
                      <span className="text-red-500">
                        {includeIconByText(item)}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-sm">
                    No feature list available.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Enrolled Students</h2>
          <span className="text-sm text-gray-500">
            {filteredEnrolledStudents.length} / {summary.enrolledCount} total
          </span>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <input
            type="text"
            value={studentSearch}
            onChange={(event) => setStudentSearch(event.target.value)}
            placeholder="Search enrolled students"
            className="w-full md:w-96 border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px]">
            <thead className="bg-red-100/60 text-gray-700 text-sm">
              <tr>
                <th className="text-left p-4">Student ID</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Domain</th>
                <th className="text-left p-4">Education</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Enrolled On</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
              {filteredEnrolledStudents.map((student) => (
                <tr key={student.enrollmentId} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">
                    <Link
                      to={`/admin/students/${student.studentId}`}
                      className="text-red-600 hover:text-red-700 hover:underline"
                    >
                      NITS{String(student.studentId || "").padStart(3, "0")}
                    </Link>
                  </td>
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">{student.phone}</td>
                  <td className="p-4">{student.domain}</td>
                  <td className="p-4">{student.education}</td>
                  <td className="p-4 capitalize">{student.status}</td>
                  <td className="p-4">{formatDate(student.enrolledAt)}</td>
                </tr>
              ))}

              {filteredEnrolledStudents.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-6 text-center text-sm text-gray-500"
                  >
                    No students found for this search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showEditForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="fixed inset-0 bg-slate-900/45 z-40"
              variants={modalBackdropVariants}
              onClick={handleCloseEditForm}
              aria-hidden="true"
            />

            <motion.div
              variants={modalPanelVariants}
              className="relative z-50 w-full max-w-5xl bg-white rounded-xl border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit Course</h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={handleCloseEditForm}
                  className="text-sm px-3 py-1.5 border border-gray-300 hover:bg-gray-100 rounded-sm cursor-pointer"
                >
                  Close
                </motion.button>
              </div>

              <form
                onSubmit={handleSubmitEditForm}
                className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {formError ? (
                  <p className="md:col-span-2 lg:col-span-3 text-sm text-red-600">
                    {formError}
                  </p>
                ) : null}

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Instructor</label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="domain"
                    value={formData.domain}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Fees</label>
                  <input
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Overview</label>
                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    What You Will Learn (comma/newline separated)
                  </label>
                  <textarea
                    name="whatYouLearnText"
                    value={formData.whatYouLearnText}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Course Includes (comma/newline separated)
                  </label>
                  <textarea
                    name="includesText"
                    value={formData.includesText}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex gap-3 justify-end">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleCloseEditForm}
                    className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 text-sm font-semibold transition-colors rounded-sm cursor-pointer"
                    disabled={saving}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm font-bold transition-colors rounded-sm cursor-pointer disabled:opacity-70"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Course"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(CourseDetails);
