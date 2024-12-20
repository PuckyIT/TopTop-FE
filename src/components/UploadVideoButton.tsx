import { useState } from "react";
import axiosInstance from "@/untils/axiosInstance";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTheme } from "@/app/context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const UploadVideoButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const user = useSelector((state: any) => state.user);
  const { theme } = useTheme();

  const handleUploadClick = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

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
    formData.append("videoFile", videoFile);
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
      toast.success("Upload video successfully!");
      setTitle("");
      setDesc("");
      setVideoFile(null);
      setIsModalOpen(false);
    } catch {
      toast.error("Error uploading video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleUploadClick}
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded font-semibold ${theme === "dark"
          ? "bg-rose-600"
          : "bg-rose-500"} text-white transition duration-300`}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <FontAwesomeIcon
              icon={faUpload}
              className="animate-spin w-4 h-4 text-white"
            />
            Uploading...
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faUpload}
              className={`w-4 h-4 ${theme === "light" ? "text-neutral-100" : "text-white"
                }`}
            />
            Upload
          </>
        )}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`w-11/12 max-w-lg p-6 rounded-lg shadow-lg ${theme === "dark"
              ? "bg-neutral-800 text-white"
              : "bg-white text-neutral-900"} transform transition-all duration-300`}
          >
            <h2
              className={`text-2xl font-bold mb-6 text-center ${theme === "dark"
                ? "text-white" : "text-neutral-900"
                }`}
            >
              Upload Video
            </h2>
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-1 ${theme === "dark"
                  ? "text-white" : "text-neutral-900"
                  }`}
              >
                Video Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className={`w-full p-3 rounded border focus:outline-none focus:ring-1 ${theme === "dark"
                  ? "bg-neutral-800 text-white"
                  : "bg-white text-neutral-900"} focus:ring-slate-400`}
              />
            </div>
            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-1 ${theme === "dark"
                  ? "text-white"
                  : "text-neutral-900"}`}
              >
                Video Description
              </label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Enter description"
                className={`w-full p-3 rounded border focus:outline-none focus:ring-1 ${theme === "dark"
                  ? "bg-neutral-800 text-white"
                  : "bg-white text-neutral-900"} focus:ring-slate-400`}
              />
            </div>
            <div className="mb-6">
              <label
                className={`block text-sm font-medium mb-1 ${theme === "dark"
                  ? "text-white"
                  : "text-neutral-900"}`}
              >
                Upload Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-neutral-500 file:py-2 file:px-4 file:rounded file:border-0 file:font-semibold file:bg-rose-100 file:text-red-700 hover:file:bg-rose-200 transition"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className={`py-2 px-4 rounded font-semibold border transition ${theme === "dark"
                  ? "border-neutral-600 text-white hover:bg-neutral-800"
                  : "border-neutral-400 text-neutral-900 hover:bg-neutral-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleVideoUpload}
                disabled={uploading}
                className={`py-2 px-4 rounded font-semibold text-white transition ${theme === "dark"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-rose-500 hover:bg-rose-600"}`}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div >
      )}
    </>
  );
};

export default UploadVideoButton;
