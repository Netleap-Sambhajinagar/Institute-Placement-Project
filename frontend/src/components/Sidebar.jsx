import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  MapPin,
  Info,
  MessageCircle,
  X,
} from "lucide-react";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";
import {
  closeStudentNav,
  selectIsStudentNavOpen,
} from "../store/slices/uiSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsStudentNavOpen);

  const handleClose = () => {
    dispatch(closeStudentNav());
  };

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { path: "/courses", label: "courses", icon: <GraduationCap size={20} /> },
    { path: "/jobs", label: "jobs", icon: <Briefcase size={20} /> },
    { path: "/internships", label: "internships", icon: <MapPin size={20} /> },
    { path: "/about", label: "about portal", icon: <Info size={20} /> },
  ];

  const navContent = (
    <>
      <div className="p-6 pt-0 flex justify-center border-b border-gray-50">
        <Link to="/">
          <img src={logo} alt="NITS" className="h-17" />
        </Link>
      </div>

      <nav className="flex-1 mt-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleClose}
            className={({ isActive }) =>
              `w-full flex items-center space-x-4 px-6 py-4 transition-all duration-200 border-r-4 ${
                isActive
                  ? "bg-red-50 text-red-600 border-red-600 font-bold"
                  : "text-gray-400 border-transparent hover:bg-gray-50 hover:text-gray-600"
              }`
            }
          >
            {item.icon}
            <span className="capitalize">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <motion.button whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => window.open(
              "https://wa.me/919876543210?text=Hello%20I%20want%20to%20join%20internship%20programs%20at%20NITS",
            )
          }
          className="w-full bg-[#FF0000] hover:bg-[#D90000] text-white rounded-full py-3 px-4 flex items-center justify-center space-x-2 shadow-lg hover:shadow-red-200 transition-all active:scale-95 cursor-pointer"
        >
          <MessageCircle size={18} fill="white" />
          <span className="text-sm font-bold uppercase tracking-wider">
            chat with us
          </span>
        </motion.button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-full shrink-0 shadow-sm">
        {navContent}
      </aside>

      <div
        className={`lg:hidden fixed inset-0 bg-slate-900/40 transition-opacity z-40 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={handleClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-[85vw] max-w-[320px] bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!isOpen}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-end p-3">
            <motion.button whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center justify-center rounded-sm cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X size={18} />
            </motion.button>
          </div>
          {navContent}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
