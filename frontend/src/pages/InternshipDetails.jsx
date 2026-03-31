import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Banknote,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { motion } from "framer-motion";
import { selectStudentId } from "../store/slices/authSlice";
import {
  fetchInternshipDetailsQuery,
} from "../api/queryFns";
import { queryKeys } from "../api/queryKeys";
import { createInternApplication } from "../api/internsApi";
import {
  addInternshipApplication,
  getAppliedInternshipIds,
} from "../utils/studentActivity";

const getTodayInputDate = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
};

const addMonthsToDate = (dateString, months) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const normalizedMonths = Math.max(1, Number(months) || 1);
  date.setMonth(date.getMonth() + normalizedMonths);
  return date.toISOString().slice(0, 10);
};

const normalizeInternCategory = (value) => {
  const category = String(value || "")
    .trim()
    .toLowerCase();
  if (category === "paid") return "paid";
  if (category === "unpaid" || category === "free") return "free";
  return "free";
};

const isInternshipClosed = (internship) =>
  String(internship?.status || "")
    .trim()
    .toLowerCase() === "closed";

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const studentId = useSelector(selectStudentId);
  const { toast, showToast } = useToast();

  const [applying, setApplying] = useState(false);
  const [appliedInternshipIds, setAppliedInternshipIds] = useState([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    category: "paid",
    stipend: "",
    startDate: "",
    endDate: "",
  });

  const {
    data: internship,
    isLoading: loading,
    error: internshipError,
  } = useQuery({
    queryKey: queryKeys.internshipDetails(id),
    queryFn: () => fetchInternshipDetailsQuery(id),
    enabled: Boolean(id),
  });

  const error = internshipError ? "Internship details could not be loaded." : "";

  useEffect(() => {
    setAppliedInternshipIds(getAppliedInternshipIds(studentId));
  }, [studentId]);

  const isApplied = useMemo(
    () => appliedInternshipIds.includes(Number(id)),
    [appliedInternshipIds, id],
  );

  const handleApplyInternship = () => {
    if (!studentId) {
      showToast("Please login as student to apply.", "error");
      navigate("/login");
      return;
    }

    if (isApplied) {
      showToast("You already applied for this internship.", "success");
      return;
    }

    if (isInternshipClosed(internship)) {
      showToast("This internship is closed for applications.", "error");
      return;
    }

    const defaultStartDate = getTodayInputDate();
    setApplicationForm({
      category: normalizeInternCategory(internship.category),
      stipend: internship.stipend ? String(internship.stipend) : "",
      startDate: defaultStartDate,
      endDate: addMonthsToDate(defaultStartDate, internship.duration),
    });
    setShowApplicationModal(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setApplicationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (event) => {
    event.preventDefault();
    if (applying) return;

    try {
      setApplying(true);
      await createInternApplication({
        studentId,
        internshipId: Number(id),
        ...applicationForm,
      });

      addInternshipApplication(studentId, Number(id));
      setAppliedInternshipIds((prev) => [...prev, Number(id)]);
      setShowApplicationModal(false);
      showToast("Applied successfully.", "success");
    } catch (err) {
      const message = String(
        err?.response?.data?.message || "",
      ).toLowerCase();

      if (message.includes("already")) {
        addInternshipApplication(studentId, Number(id));
        setAppliedInternshipIds((prev) => [...prev, Number(id)]);
        setShowApplicationModal(false);
        showToast("You already applied for this internship.", "success");
        return;
      }

      showToast(
        err?.response?.data?.message || "Failed to apply. Please try again.",
        "error",
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading internship details...</p>;
  }

  if (error || !internship) {
    return (
      <div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/internships")}
          className="mb-6 text-red-500 cursor-pointer hover:text-red-600 font-medium flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Internships
        </motion.button>
        <p className="text-red-600">{error || "Internship not found."}</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <Toast toast={toast} position="inline" />

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/internships")}
        className="mb-6 text-red-500 cursor-pointer hover:text-red-600 font-medium flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back to Internships
      </motion.button>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8">
        <div className="p-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">
              {internship.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <MapPin size={16} />
                {internship.location || internship.branch || "-"}
              </span>
              <span className="text-gray-500 flex items-center gap-1">
                <Calendar size={16} />
                {internship.duration || "-"}{" "}
                {internship.duration === 1 ? "month" : "months"}
              </span>
              {normalizeInternCategory(internship.category) === "paid" &&
              internship.stipend ? (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <Banknote size={16} />₹{internship.stipend.toLocaleString()}/month
                </span>
              ) : (
                <span className="text-gray-400 flex items-center gap-1">
                  <Banknote size={16} />
                  Unpaid
                </span>
              )}
            </div>
            {internship.work_type && (
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Briefcase size={16} className="text-red-500" />
                {internship.work_type}
              </p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleApplyInternship}
            disabled={applying || isApplied || isInternshipClosed(internship)}
            className={`px-10 py-3 cursor-pointer rounded-xl font-bold text-lg transition-all whitespace-nowrap ${
              isApplied
                ? "bg-emerald-600 text-white cursor-not-allowed"
                : isInternshipClosed(internship)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : applying
                    ? "bg-red-400 text-white cursor-not-allowed"
                    : "bg-[#FF0000] text-white hover:bg-red-700"
            }`}
          >
            {isApplied
              ? "Applied"
              : isInternshipClosed(internship)
                ? "Closed"
                : applying
                  ? "Applying..."
                  : "Apply Now"}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="bg-white p-8 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-slate-800">
              About This Internship
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {internship.description || "No description available."}
            </p>

            <div className="my-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Key Details
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500 shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Duration:</span>{" "}
                    {internship.duration} months
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500 shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Work Type:</span>{" "}
                    {internship.work_type || "-"}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500 shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Category:</span>{" "}
                    {normalizeInternCategory(internship.category) === "paid"
                      ? "Paid"
                      : "Unpaid"}
                  </span>
                </li>
                {internship.stipend && (
                  <li className="flex items-center gap-3">
                    <CheckCircle
                      size={18}
                      className="text-green-500 shrink-0"
                    />
                    <span className="text-gray-700">
                      <span className="font-semibold">Stipend:</span> ₹
                      {internship.stipend.toLocaleString()}/month
                    </span>
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <CheckCircle
                    size={18}
                    className="text-green-500 shrink-0"
                  />
                  <span className="text-gray-700">
                    <span className="font-semibold">Status:</span>{" "}
                    {internship.status || "Open"}
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-6 text-slate-800">
            Application Info
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Status:</span>{" "}
                {isInternshipClosed(internship) ? (
                  <span className="text-red-600 font-medium">Closed</span>
                ) : isApplied ? (
                  <span className="text-green-600 font-medium">Applied</span>
                ) : (
                  <span className="text-blue-600 font-medium">Open</span>
                )}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Apply now to get started with this internship opportunity.
              Fill in your preferred start date in the application form.
            </p>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !applying && setShowApplicationModal(false)}
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-50 bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Apply for Internship
              </h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => !applying && setShowApplicationModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
                disabled={applying}
              >
                ×
              </motion.button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={applicationForm.startDate}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={applying}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={applicationForm.endDate}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={applying}
                />
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  disabled={applying}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={applying}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition disabled:opacity-50"
                >
                  {applying ? "Applying..." : "Apply"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InternshipDetails;
