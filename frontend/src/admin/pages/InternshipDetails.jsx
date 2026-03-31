import { memo, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Users, Briefcase, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getInternships,
  getInternshipsUpdatedEventName,
  updateInternship,
} from "../../api/internshipsApi";
import { getInternApplications } from "../../api/internsApi";
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

function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "-";

  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);

  return `₹${amount.toLocaleString()}`;
}

function normalizeInternship(internship) {
  return {
    ...internship,
    titleValue: internship.title || internship.role || "-",
    durationValue: internship.duration || "-",
    categoryValue: internship.category || "-",
    workTypeValue:
      internship.work_type || internship.workType || internship.location || "-",
    stipendValue: internship.stipend,
    branchValue: internship.branch || internship.company || "-",
    statusValue: internship.status || "Open",
    startDateValue:
      internship.startDate ||
      (internship.createdAt
        ? new Date(internship.createdAt).toISOString().slice(0, 10)
        : ""),
  };
}

function InternshipDetails() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    category: "Paid",
    workType: "On-site",
    stipend: "",
    branch: "",
    startDate: "",
    status: "Open",
  });

  useEffect(() => {
    let isMounted = true;

    const loadDetails = async () => {
      setLoading(true);

      try {
        const [internships, internApplications, students] = await Promise.all([
          getInternships(),
          getInternApplications(),
          getStudents(),
        ]);

        if (!isMounted) return;

        const internshipList = Array.isArray(internships) ? internships : [];
        const applications = Array.isArray(internApplications)
          ? internApplications
          : [];
        const studentList = Array.isArray(students) ? students : [];

        const selectedInternship = internshipList.find(
          (item) => Number(item.id) === Number(id),
        );

        if (!selectedInternship) {
          setInternship(null);
          setEnrolledStudents([]);
          setError("Internship not found.");
          return;
        }

        const studentsById = new Map(
          studentList.map((student) => [Number(student.id), student]),
        );

        const enrolledRows = applications
          .filter(
            (application) => Number(application.internshipId) === Number(id),
          )
          .map((application) => {
            const student = studentsById.get(Number(application.studentId));

            return {
              applicationId: application.id,
              studentId: application.studentId,
              name: student?.name || "-",
              email: student?.email || "-",
              phone: student?.phone || "-",
              domain: student?.domain || "-",
              category: application.category || "-",
              status: application.status || "active",
              stipend: formatMoney(application.stipend),
              startDate: formatDate(application.start_date),
              endDate: formatDate(application.end_date),
              appliedAt: formatDate(application.createdAt),
            };
          })
          .sort((a, b) => String(a.name).localeCompare(String(b.name)));

        setInternship(normalizeInternship(selectedInternship));
        setEnrolledStudents(enrolledRows);
        setError("");
      } catch {
        if (!isMounted) return;

        setInternship(null);
        setEnrolledStudents([]);
        setError("Unable to load internship details.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    const internshipsUpdatedEvent = getInternshipsUpdatedEventName();
    const studentsUpdatedEvent = getStudentsUpdatedEventName();

    window.addEventListener("storage", loadDetails);
    window.addEventListener(internshipsUpdatedEvent, loadDetails);
    window.addEventListener(studentsUpdatedEvent, loadDetails);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", loadDetails);
      window.removeEventListener(internshipsUpdatedEvent, loadDetails);
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
        student.category,
        student.status,
      ].some((field) => String(field || "").toLowerCase().includes(query)),
    );
  }, [enrolledStudents, studentSearch]);

  const handleOpenEditForm = () => {
    if (!internship) return;

    setFormError("");
    setFormData({
      title: internship.titleValue === "-" ? "" : internship.titleValue,
      duration:
        internship.durationValue === "-" ? "" : String(internship.durationValue),
      category: internship.categoryValue || "Paid",
      workType: internship.workTypeValue || "On-site",
      stipend:
        internship.stipendValue === null || internship.stipendValue === undefined
          ? ""
          : String(internship.stipendValue),
      branch: internship.branchValue === "-" ? "" : internship.branchValue,
      startDate: internship.startDateValue || "",
      status: internship.statusValue || "Open",
    });
    setShowEditForm(true);
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseEditForm = () => {
    if (saving) return;
    setShowEditForm(false);
    setFormError("");
  };

  const handleSubmitEditForm = async (event) => {
    event.preventDefault();
    if (saving) return;

    const normalized = {
      title: formData.title.trim(),
      duration: Number(formData.duration) || 0,
      category: formData.category,
      work_type: formData.workType,
      stipend: formData.stipend ? Number(formData.stipend) : null,
      branch: formData.branch.trim(),
      status: formData.status,
      startDate: formData.startDate,
    };

    if (
      !normalized.title ||
      !normalized.duration ||
      !normalized.category ||
      !normalized.work_type ||
      !normalized.branch
    ) {
      setFormError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const updatedInternships = await updateInternship(Number(id), normalized);
      const list = Array.isArray(updatedInternships) ? updatedInternships : [];
      const updated = list.find((item) => Number(item.id) === Number(id));

      if (updated) {
        setInternship(normalizeInternship(updated));
      }

      setShowEditForm(false);
    } catch {
      setFormError("Failed to update internship. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 text-sm text-gray-500">
        Loading internship details...
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/internships"
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          <ArrowLeft size={16} />
          Back to Internships
        </Link>
        <div className="bg-white border border-red-100 rounded-xl p-6 text-sm text-red-600">
          {error || "Internship not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          to="/admin/internships"
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          <ArrowLeft size={16} />
          Back to Internships
        </Link>

        <Link
          to="#"
          onClick={(event) => {
            event.preventDefault();
            handleOpenEditForm();
          }}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm text-sm font-semibold transition-colors"
        >
          <Pencil size={16} />
          Edit Internship
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {internship.titleValue}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Branch: {internship.branchValue}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              String(internship.statusValue).toLowerCase() === "open"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {internship.statusValue}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Duration
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {internship.durationValue} month
              {Number(internship.durationValue) > 1 ? "s" : ""}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Category
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1 capitalize">
              {internship.categoryValue}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Work Type
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {internship.workTypeValue}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Stipend
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {String(internship.categoryValue).toLowerCase() === "paid"
                ? `${formatMoney(internship.stipendValue)}/month`
                : "Unpaid"}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Start Date
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {formatDate(internship.startDateValue)}
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
            <Briefcase className="text-red-600" size={18} />
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Active
              </p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {summary.activeCount}
              </p>
            </div>
            <Users className="text-red-600" size={18} />
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
          <table className="w-full min-w-[980px]">
            <thead className="bg-red-100/60 text-gray-700 text-sm">
              <tr>
                <th className="text-left p-4">Student ID</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Domain</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Stipend</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Start Date</th>
                <th className="text-left p-4">End Date</th>
                <th className="text-left p-4">Applied On</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
              {filteredEnrolledStudents.map((student) => (
                <tr key={student.applicationId} className="hover:bg-gray-50">
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
                  <td className="p-4 capitalize">{student.category}</td>
                  <td className="p-4">{student.stipend}</td>
                  <td className="p-4 capitalize">{student.status}</td>
                  <td className="p-4">{student.startDate}</td>
                  <td className="p-4">{student.endDate}</td>
                  <td className="p-4">{student.appliedAt}</td>
                </tr>
              ))}

              {filteredEnrolledStudents.length === 0 && (
                <tr>
                  <td
                    colSpan="10"
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
                <h3 className="text-xl font-bold text-gray-900">Edit Internship</h3>
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
                  <label className="text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleEditInputChange}
                    placeholder="Position"
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleEditInputChange}
                    placeholder="Duration (in months)"
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Work Type</label>
                  <select
                    name="workType"
                    value={formData.workType}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                    required
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Stipend</label>
                  <input
                    type="number"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleEditInputChange}
                    placeholder="Stipend"
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleEditInputChange}
                    placeholder="Branch"
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleEditInputChange}
                    className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
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
                    {saving ? "Updating..." : "Update Internship"}
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

export default memo(InternshipDetails);
