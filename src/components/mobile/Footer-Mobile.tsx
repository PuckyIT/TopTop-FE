import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/app/context/ThemeContext';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import axiosInstance from '@/untils/axiosInstance';
import { useRouter } from "next/navigation";
import LoginNotificationModal from '../modal/LoginNotificationModal';

const MobileFooter: React.FC = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string>("1");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const user = useSelector((state: any) => state.user);

    const themeClasses = {
        background: theme === "dark" ? "bg-neutral-800" : "bg-white",
        color: theme === "dark" ? "text-neutral-200" : "text-neutral-900",
        borderColor: theme === "dark" ? "border-neutral-600" : "border-neutral-300",
        button:
            theme === "dark"
                ? "bg-rose-600"
                : "bg-rose-500",
    };

    const handleUploadClick = () => setIsModalOpen(true);
    const handleCancel = () => {
        setIsModalOpen(false);
        setTitle("");
        setDesc("");
        setVideoFile(null);
    };

    const handleVideoUpload = async () => {
        if (!title || !videoFile) {
            toast.error("Enter a title and select a video.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You need to log in to upload a video.");
            return;
        }

        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("title", title);
        formData.append("desc", desc);
        formData.append("userId", user.id);
        formData.append("username", user.username);

        try {
            setUploading(true);
            await axiosInstance.post("/users/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Video uploaded successfully!");
            setTitle("");
            setDesc("");
            setVideoFile(null);
            setIsModalOpen(false);
        } catch {
            toast.error("An error occurred while uploading the video.");
        } finally {
            setUploading(false);
        }
    };

    const handleMenuClick = (key: string) => {
        setSelectedKey(key);
        if (key === "2") {
            if (user?.isActive) {
                router.push("/profile");
            } else {
                setIsLoginModalOpen(true);
            }
        } else if (key === "1") {
            router.push("/home-mobile");
        }
    };

    const tabs = [
        { key: "1", label: "Home", icon: faHome },
        { key: "2", label: "Profile", icon: faUser },
    ]

    return (
        <>
            <div className="fixed h-screen w-screen z-40">
                <div
                    className={`fixed w-full max-h-12 bottom-0 py-4 flex gap-x-10 justify-around items-center 
                    ${theme === "dark" ? "bg-black" : "bg-black"}`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => handleMenuClick(tab.key)}
                            className={`flex flex-col justify-center items-center px-4 py-2 text-xs gap-1
                             ${selectedKey === tab.key
                                    ? `${theme === "light" ? "text-neutral-200" : " text-neutral-200 "}`
                                    : `${theme === "light" ? "text-neutral-600 " : "text-neutral-600 "}`
                                }`}
                        >
                            <FontAwesomeIcon icon={tab.icon} className='text-xl' />
                            <span>{tab.label}</span>
                        </button>
                    ))}

                    <button
                        onClick={handleUploadClick}
                        className="absolute flex justify-center items-center bottom-3"
                        disabled={uploading}
                    >
                        <div className="relative w-12 h-8 rounded-lg bg-gradient-to-r from-cyan-300 to-rose-600">
                            <div className="absolute inset-0 mx-1 flex justify-center items-center bg-white rounded-md
                         text-neutral-800 text-lg">
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        className={`w-11/12 max-w-lg p-6 rounded-lg shadow-lg ${themeClasses.background} transform transition-all duration-300`}
                    >
                        <h2
                            className={`text-2xl font-bold mb-6 text-center ${themeClasses.color}`}
                        >
                            Upload Video
                        </h2>
                        <div className="mb-4">
                            <label
                                className={`block text-sm font-medium mb-1 ${themeClasses.color}`}
                            >
                                Video Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter title"
                                className={`w-full p-3 rounded border focus:outline-none focus:ring-1 ${themeClasses.borderColor} text-neutral-800 focus:ring-slate-400`}
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className={`block text-sm font-medium mb-1 ${themeClasses.color}`}
                            >
                                Video Description
                            </label>
                            <input
                                type="text"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Enter description"
                                className={`w-full p-3 rounded border focus:outline-none focus:ring-1 ${themeClasses.borderColor} text-neutral-800 focus:ring-slate-400`}
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                className={`block text-sm font-medium mb-1 ${themeClasses.color}`}
                            >
                                Upload Video
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                className="block w-full text-sm text-neutral-500 file:py-2 file:px-4 file:rounded 
                                file:border-0 file:font-semibold file:bg-rose-100 file:text-red-700 transition"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCancel}
                                className={`py-2 px-4 rounded font-semibold border ${themeClasses.borderColor} ${themeClasses.color} transition`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVideoUpload}
                                disabled={uploading}
                                className={`py-2 px-4 rounded font-semibold ${themeClasses.button} text-white transition`}
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isLoginModalOpen && (
                <LoginNotificationModal
                    isOpen={isLoginModalOpen}
                    onClose={() => setIsLoginModalOpen(false)}
                />
            )}
        </>
    );
};

export default MobileFooter;