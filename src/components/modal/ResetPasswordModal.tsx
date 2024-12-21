import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast"; 

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string, confirmPassword: string) => Promise<void>; // Assume async behavior
  theme: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  theme,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6 || confirmPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(newPassword, confirmPassword);
      toast.success("Password reset successfully!"); // Show success toast
      setNewPassword("");
      setConfirmPassword("");
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error) {
      toast.error("Failed to reset password. Please try again."); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`relative w-full max-w-md p-8 rounded-2xl shadow-xl transform ${
              theme === "dark"
                ? "bg-neutral-800 text-white"
                : "bg-white text-neutral-900"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 ${
                theme === "dark" ? "text-neutral-400 hover:text-neutral-200" : ""
              }`}
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
            </div>
            {error && (
              <div
                className={`text-sm mb-4 ${
                  theme === "dark" ? "text-red-300" : "text-red-600"
                }`}
              >
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-1 ${
                      theme === "dark"
                        ? "bg-neutral-700 border-neutral-600 focus:ring-blue-500"
                        : "bg-neutral-50 border-neutral-300 focus:ring-blue-400"
                    }`}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showNewPassword ? faEyeSlash : faEye}
                      className={
                        theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                      }
                    />
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-1 ${
                      theme === "dark"
                        ? "bg-neutral-700 border-neutral-600 focus:ring-blue-500"
                        : "bg-neutral-50 border-neutral-300 focus:ring-blue-400"
                    }`}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                      className={
                        theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                      }
                    />
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm ${
                    theme === "dark"
                      ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                      : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white shadow-lg transform ${
                    loading
                      ? "bg-rose-300 cursor-not-allowed"
                      : "bg-rose-500 hover:bg-rose-600 hover:scale-105"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetPasswordModal;
