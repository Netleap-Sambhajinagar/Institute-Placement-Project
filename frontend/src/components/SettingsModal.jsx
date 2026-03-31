import { X, Sun, Moon, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleTheme,
  closeSettings,
  selectTheme,
  selectIsSettingsOpen,
} from "../store/slices/uiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const SettingsModal = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isOpen = useSelector(selectIsSettingsOpen);
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  const handleClose = () => {
    dispatch(closeSettings());
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleOpenAddAdminForm = () => {
    setShowAddAdminForm(true);
    setAdminForm({ name: "", email: "", password: "" });
    setAdminError("");
  };

  const handleCloseAddAdminForm = () => {
    setShowAddAdminForm(false);
    setAdminForm({ name: "", email: "", password: "" });
    setAdminError("");
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
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to register admin");
      }

      alert("Admin registered successfully!");
      handleCloseAddAdminForm();
    } catch (error) {
      setAdminError(error.message || "Failed to add admin.");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {showAddAdminForm ? "Register Admin" : "Settings"}
                </h2>
                <button
                  onClick={showAddAdminForm ? handleCloseAddAdminForm : handleClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                  aria-label="Close settings"
                >
                  <X size={24} />
                </button>
              </div>

              {!showAddAdminForm ? (
                <>
                  <div className="space-y-4">
                    {/* Add Admin Button */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpenAddAdminForm}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                    >
                      <Plus size={20} />
                      Add Admin
                    </motion.button>

                    {/* Theme Switcher */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-slate-700">
                      <div className="flex items-center space-x-3">
                        {theme === "light" ? (
                          <Sun size={20} className="text-yellow-500" />
                        ) : (
                          <Moon size={20} className="text-indigo-400" />
                        )}
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {theme === "light" ? "Light Mode" : "Dark Mode"}
                        </span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleThemeToggle}
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                          theme === "dark" ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                      >
                        <motion.span
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-colors ${
                            theme === "dark" ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </motion.button>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-800 dark:text-white rounded-lg font-medium transition"
                    >
                      Close
                    </motion.button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  {adminError && (
                    <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
                      {adminError}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={adminForm.name}
                      onChange={handleAdminFormChange}
                      placeholder="Admin name"
                      className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-700 dark:text-white"
                      disabled={adminLoading}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={adminForm.email}
                      onChange={handleAdminFormChange}
                      placeholder="admin@example.com"
                      className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-700 dark:text-white"
                      disabled={adminLoading}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={adminForm.password}
                      onChange={handleAdminFormChange}
                      placeholder="Password"
                      className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-700 dark:text-white"
                      disabled={adminLoading}
                    />
                  </div>

                  <div className="mt-6 flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleCloseAddAdminForm}
                      disabled={adminLoading}
                      className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-800 dark:text-white rounded-lg font-medium transition disabled:opacity-50"
                    >
                      Back
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
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
