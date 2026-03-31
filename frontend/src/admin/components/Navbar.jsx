import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  User,
  X,
  Settings,
  LogOut,
  ShieldCheck,
  Plus,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { logoutUser } from "../../api/authApi";
import { clearAuth, selectAdminInfo } from "../../store/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";

const searchableAdminRoutes = new Set([
  "/admin/students",
  "/admin/courses",
  "/admin/internships",
  "/admin/jobs",
]);

export default function Navbar({ onOpenSidebar = () => {} }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const adminInfo = useSelector(selectAdminInfo);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    setupKey: "",
  });
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showSetupKey, setShowSetupKey] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("q") || "");
  }, [location.search]);

  const initials =
    String(adminInfo.name || "A")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD";

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Continue logout locally even if request fails.
    }

    dispatch(clearAuth());
    setIsDrawerOpen(false);
    navigate("/login", { replace: true });
  };

  const updateSearchRoute = (value, replace = false) => {
    const trimmedValue = value.trim();
    const targetPath = searchableAdminRoutes.has(location.pathname)
      ? location.pathname
      : "/admin/students";
    const params = new URLSearchParams();

    if (trimmedValue) {
      params.set("q", trimmedValue);
    }

    navigate(
      {
        pathname: targetPath,
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace },
    );
  };

  const handleSearchChange = (event) => {
    const nextValue = event.target.value;
    setSearchValue(nextValue);

    if (searchableAdminRoutes.has(location.pathname)) {
      updateSearchRoute(nextValue, true);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateSearchRoute(searchValue);
  };

  const handleOpenAddAdminForm = () => {
    setShowAddAdminForm(true);
    setAdminForm({ name: "", email: "", password: "", setupKey: "" });
    setAdminError("");
    setShowAdminPassword(false);
    setShowSetupKey(false);
  };

  const handleCloseAddAdminForm = () => {
    setShowAddAdminForm(false);
    setAdminForm({ name: "", email: "", password: "", setupKey: "" });
    setAdminError("");
    setShowAdminPassword(false);
    setShowSetupKey(false);
  };

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAdminError("");

    if (!adminForm.name.trim()) {
      setAdminError("Name is required.");
      return;
    }

    if (!adminForm.email.trim()) {
      setAdminError("Email is required.");
      return;
    }

    if (!adminForm.password.trim()) {
      setAdminError("Password is required.");
      return;
    }

    if (!adminForm.setupKey.trim()) {
      setAdminError("Super key is required.");
      return;
    }

    try {
      setAdminLoading(true);
      const response = await fetch("/api/auth/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: adminForm.name.trim(),
          email: adminForm.email.trim(),
          password: adminForm.password.trim(),
          setupKey: adminForm.setupKey.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || error.error || "Failed to register admin",
        );
      }

      alert("Admin registered successfully!");
      handleCloseAddAdminForm();
      setShowSettingsMenu(false);
    } catch (error) {
      setAdminError(error.message || "Failed to add admin.");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border-b px-4 md:px-6 lg:px-8 py-4 flex justify-between items-center gap-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onOpenSidebar}
            className="lg:hidden w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center justify-center rounded-sm cursor-pointer"
            aria-label="Open admin navigation"
          >
            <Menu size={20} />
          </motion.button>
          <h2 className="font-bold text-lg md:text-xl text-gray-800 truncate">
            Admin Panel
          </h2>
        </div>

        <form
          className="relative hidden md:flex items-center flex-1 max-w-xs lg:max-w-md xl:max-w-lg"
          onSubmit={handleSearchSubmit}
        >
          <Search className="absolute left-3 text-gray-400" size={18} />
          <input
            className="border border-gray-300 rounded-none pl-10 pr-4 py-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all font-medium text-gray-700"
            placeholder="Search students, courses, or jobs..."
            value={searchValue}
            onChange={handleSearchChange}
            aria-label="Search admin records"
          />
        </form>

        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          {/* <motion.button whileTap={{ scale: 0.9 }} className="relative text-gray-600 hover:text-red-600 transition-colors rounded-sm cursor-pointer">
            <Bell size={20} />
            <span className="absolute -top-3 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.4 rounded-full border-2 border-white">
              3
            </span>
          </motion.button> */}

          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 md:gap-3 bg-gray-50 px-2.5 md:px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
          >
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-bold text-gray-800 leading-tight">
                {adminInfo.name}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                {adminInfo.subtitle}
              </span>
            </div>
          </motion.button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-slate-900/40 transition-opacity z-40 ${isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden={!isDrawerOpen}
      />

      <aside
        className={`fixed top-0 right-0 h-screen w-[85vw] sm:w-[25vw] sm:min-w-[300px] sm:max-w-[460px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!isDrawerOpen}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Admin Panel</h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center justify-center"
              aria-label="Close admin drawer"
            >
              <X size={18} />
            </motion.button>
          </div>

          <div className="mt-6 pb-6 border-b border-gray-200 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <User size={28} />
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {adminInfo.name}
            </p>
            <p className="text-sm text-gray-500">{adminInfo.subtitle}</p>
            <p className="mt-1 text-xs text-gray-400">{adminInfo.email}</p>
          </div>

          <nav className="mt-5 space-y-2">
            {!showAddAdminForm ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setShowSettingsMenu((prev) => !prev)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center justify-between gap-2 rounded-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Settings size={18} />
                    Settings
                  </span>
                  {showSettingsMenu ? (
                    <ChevronDown size={16} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                  )}
                </motion.button>

                <AnimatePresence initial={false}>
                  {showSettingsMenu ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-5 mt-1 border-l border-gray-200 pl-3 overflow-hidden"
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleOpenAddAdminForm}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 rounded-sm cursor-pointer"
                      >
                        <Plus size={16} />
                        Add Admin
                      </motion.button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 rounded-sm cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </motion.button>
              </>
            ) : null}
          </nav>
        </div>
      </aside>

      {/* Add Admin Modal Popup */}
      <AnimatePresence>
        {showAddAdminForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseAddAdminForm}
              className="fixed inset-0 bg-black/50 z-50"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Register Admin
                  </h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleCloseAddAdminForm}
                    className="text-gray-500 hover:text-gray-700 transition"
                    aria-label="Close form"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <form onSubmit={handleAddAdmin} className="space-y-4">
                  {adminError && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {adminError}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={adminForm.name}
                      onChange={handleAdminFormChange}
                      placeholder="Admin name"
                      className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={adminLoading}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={adminForm.email}
                      onChange={handleAdminFormChange}
                      placeholder="admin@example.com"
                      className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={adminLoading}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? "text" : "password"}
                        name="password"
                        value={adminForm.password}
                        onChange={handleAdminFormChange}
                        placeholder="Password"
                        className="w-full border border-gray-300 px-3 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={adminLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                        aria-label={showAdminPassword ? "Hide password" : "Show password"}
                        disabled={adminLoading}
                      >
                        {showAdminPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Super Key
                    </label>
                    <div className="relative">
                      <input
                        type={showSetupKey ? "text" : "password"}
                        name="setupKey"
                        value={adminForm.setupKey}
                        onChange={handleAdminFormChange}
                        placeholder="Enter super key"
                        className="w-full border border-gray-300 px-3 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={adminLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSetupKey((prev) => !prev)}
                        className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                        aria-label={showSetupKey ? "Hide super key" : "Show super key"}
                        disabled={adminLoading}
                      >
                        {showSetupKey ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleCloseAddAdminForm}
                      disabled={adminLoading}
                      className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={adminLoading}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                    >
                      {adminLoading ? "Adding..." : "Add Admin"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
