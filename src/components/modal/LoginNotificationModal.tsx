"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginNotificationModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { theme } = useTheme();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(isOpen);
    }, [isOpen]);

    const confirmLogin = () => {
        setIsModalOpen(false);
        onClose();
        router.push("/login");
    };

    const handleClose = () => {
        setIsModalOpen(false);
        onClose();
    };

    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            handleClose();
        }
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    className={`fixed inset-0 z-50 flex items-center justify-center
                         ${theme === "light"
                            ? "bg-black bg-opacity-50"
                            : "bg-gray-700 bg-opacity-50"
                        }`}
                    onClick={handleOutsideClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`relative rounded-lg shadow-lg p-6 w-5/6 max-w-md
                             ${theme === "light" ? "bg-white" : "bg-black"
                            }`}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button
                            className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
                            onClick={handleClose}
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-bold mb-4">Log in to TopTop</h2>
                        <p
                            className={`mb-6 ${theme === "light"
                                ? "text-neutral-600"
                                : "text-neutral-400"
                                }`}
                        >
                            You need to log in to perform this action.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleClose}
                                className={`px-4 py-2 rounded ${theme === "light"
                                    ? "bg-neutral-200 text-black hover:bg-neutral-300"
                                    : "bg-neutral-600 text-white hover:bg-neutral-500"
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogin}
                                className={`px-4 py-2 rounded ${theme === "light"
                                    ? "bg-rose-500 text-white hover:bg-rose-600"
                                    : "bg-rose-600 text-white hover:bg-rose-700"
                                    }`}
                            >
                                Log in
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}