import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  theme: string;
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  theme,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(otp);
    setLoading(false);
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
              <h2 className="text-2xl font-semibold mb-4">Enter OTP</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-1 ${
                    theme === "dark"
                      ? "bg-neutral-700 border-neutral-600 focus:ring-slate-500"
                      : "bg-neutral-50 border-neutral-300 focus:ring-slate-400"
                  }`}
                  placeholder="Your OTP"
                  required
                />
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
                  {loading ? "Submiting..." : "Submit"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OtpModal;
