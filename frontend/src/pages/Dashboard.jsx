import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  markDashboardStale,
  selectDashboardStats,
  selectDashboardStatus,
} from "../store/slices/dashboardSlice";
import { selectStudentId } from "../store/slices/authSlice";

const StatCard = ({ label, value }) => (
  <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[160px] w-full">
    <p className="text-gray-500 font-medium text-sm">{label}</p>
    <h3 className="text-4xl font-bold text-slate-800 mt-4">{value}</h3>
  </div>
);

const formatStat = (value) => String(value).padStart(2, "0");

const Dashboard = () => {
  const dispatch = useDispatch();
  const studentId = useSelector(selectStudentId);
  const stats = useSelector(selectDashboardStats);
  const dashboardStatus = useSelector(selectDashboardStatus);

  // Fetch only when not already loaded — skips re-fetch on every re-mount
  useEffect(() => {
    if (studentId && dashboardStatus === "idle") {
      dispatch(fetchDashboardStats(studentId));
    }
  }, [studentId, dashboardStatus, dispatch]);

  // Cross-tab sync: another tab updated localStorage (job/internship applied)
  useEffect(() => {
    const handleStorageSync = () => {
      if (studentId) {
        dispatch(markDashboardStale());
      }
    };

    window.addEventListener("storage", handleStorageSync);
    return () => {
      window.removeEventListener("storage", handleStorageSync);
    };
  }, [studentId, dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
      <StatCard
        label="enrolled courses"
        value={formatStat(stats.enrolledCourses)}
      />
      <StatCard label="jobs applied" value={formatStat(stats.jobsApplied)} />
      <StatCard
        label="internships applied"
        value={formatStat(stats.internshipsApplied)}
      />
    </div>
  );
};

export default Dashboard;
