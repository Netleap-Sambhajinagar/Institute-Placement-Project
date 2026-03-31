import { AnimatePresence, motion } from "framer-motion";

const typeClasses = {
    success: "bg-blue-600 text-white border border-blue-500",
    error: "bg-red-600 text-white border border-red-700",
};

export default function Toast({ toast, position = "bottom-left" }) {
    const isVisible = Boolean(toast?.show);
    const isInline = position === "inline";

    const wrapperClass =
        isInline
            ? "mb-4"
            : "fixed left-4 bottom-2 sm:left-6 sm:bottom-4 z-[60]";

    const boxClass =
        isInline
            ? `inline-flex rounded-lg px-3 py-2 text-sm font-medium ${
                  toast.type === "error"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-red-50 text-red-700 border border-red-200"
              }`
            : `px-4 py-3 rounded-lg shadow-lg text-sm font-semibold ${typeClasses[toast.type] || typeClasses.success}`;

    return (
        <AnimatePresence>
            {isVisible ? (
                <motion.div
                    className={wrapperClass}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                >
                    <motion.div
                        className={boxClass}
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                        {toast.message}
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
