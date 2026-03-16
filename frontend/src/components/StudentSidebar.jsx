import {
  X,
  UserCircle2,
  BriefcaseBusiness,
  Settings,
  LogOut,
  CircleUserRound,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi";
import { clearAuth } from "../store/slices/authSlice";
import { motion } from "framer-motion";

const StudentSidebar = ({ isOpen, onClose, studentInfo }) => {
  const details = [
    { label: "Domain", value: studentInfo?.domain },
    { label: "Education", value: studentInfo?.education },
    { label: "College", value: studentInfo?.college },
    { label: "Phone", value: studentInfo?.phone },
  ].filter((item) => Boolean(item.value));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Redirect anyway to clear protected UI even if API call fails.
    }

    dispatch(clearAuth());
    onClose();
    navigate("/login", { replace: true });
  };

  const profilePath = studentInfo?.id
    ? `/profile/${studentInfo.id}`
    : "/dashboard";

  return (
    <>
      <div
        className={`student-sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`student-sidebar ${isOpen ? "open" : ""}`}
        onClick={(event) => event.stopPropagation()}
        aria-hidden={!isOpen}
        aria-label="Student quick menu"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="student-sidebar-close rounded-sm cursor-pointer"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </motion.button>

        <div className="student-sidebar-profile">
          <div className="student-avatar-wrap">
            <CircleUserRound size={64} />
          </div>
          <h3>{studentInfo?.name || "Student"}</h3>
          <p>{studentInfo?.email || "student@example.com"}</p>
        </div>

        <nav className="student-sidebar-menu" aria-label="Student menu">
          <Link
            to={profilePath}
            className="student-menu-item"
            onClick={onClose}
          >
            <UserCircle2 size={18} />
            <span>My Profile</span>
          </Link>
          <a href="#" className="student-menu-item">
            <Settings size={18} />
            <span>Settings</span>
          </a>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            className="student-menu-item logout rounded-sm cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </motion.button>
        </nav>
      </aside>
    </>
  );
};

export default StudentSidebar;
