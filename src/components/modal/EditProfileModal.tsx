/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/redux/userSlice";
import axiosInstance from "@/untils/axiosInstance";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  userAvatar: string;
  userId: string;
  userUsername: string;
  userBio: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  theme,
  userAvatar,
  userId,
  userUsername,
  userBio,
}) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState(userUsername || "");
  const [bio, setBio] = useState(userBio || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [tempAvatar, setTempAvatar] = useState<string | undefined>(
    userAvatar
  );
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setTempAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await axiosInstance.put(
        `/users/profile/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(setUser(response.data));
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 transition duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`w-full max-w-md p-6 rounded-lg shadow-lg 
            ${theme === "dark" ? "bg-neutral-800 text-white" : "bg-white text-neutral-800"}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Avatar</label>
              <div className="flex items-center justify-center">
                <div className="relative w-28 h-28">
                  {tempAvatar ? (
                    <Image
                      src={tempAvatar}
                      alt="User Avatar"
                      width={112}
                      height={112}
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-rose-500 flex items-center justify-center text-white text-3xl font-bold">
                      {tempAvatar}
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute -bottom-1 right-0 cursor-pointer flex items-center justify-center w-9 h-9 rounded-full
                    ${theme === "light" ? "bg-white border border-neutral-300" : "bg-neutral-700 border border-neutral-600"}`}
                  >
                    <FontAwesomeIcon
                      icon={faPencil}
                      className={`${theme === "light" ? "text-neutral-400" : "text-neutral-200"}`}
                    />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${theme === "dark"
                  ? "bg-neutral-700 border-neutral-600"
                  : "bg-neutral-50 border-neutral-300"
                  }`}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="bio" className="block text-sm font-medium mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={80}
                className={`w-full px-3 py-2 border rounded-md ${theme === "dark"
                  ? "bg-neutral-700 border-neutral-600"
                  : "bg-neutral-50 border-neutral-300"
                  }`}
              />
              <p className="text-sm text-neutral-500 mt-1">
                {bio.length}/80 characters
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${theme === "dark"
                  ? "bg-neutral-700 hover:bg-neutral-600"
                  : "bg-neutral-200 hover:bg-neutral-300"
                  }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md bg-rose-500 text-white transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-rose-400"
                  }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
