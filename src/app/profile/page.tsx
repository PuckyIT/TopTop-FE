/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTheme } from "@/app/context/ThemeContext"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "@/app/redux/userSlice"
import axiosInstance from "@/untils/axiosInstance"
import { toast } from 'react-hot-toast'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTable, faBook, faHeart, faShare, faCog } from "@fortawesome/free-solid-svg-icons"
import { User } from "../types/user.types"
import EditProfileModal from "@/components/modal/EditProfileModal"
import Spinner from "@/components/Spinner"

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user) as User
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState("1")
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      // Fetch user profile
      axiosInstance
        .get(`/users/profile`)
        .then((response) => {
          dispatch(setUser(response.data))
          setLoading(false)
        })
        .catch(() => {
          toast.error("Failed to load profile")
          setLoading(false)
        })
    } else {
      setLoading(true)
    }
  }, [dispatch])

  const userInitials = user?.email
    ? user.email
      .split("@")[0]
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
    : "U"

  const tabs = [
    { key: "1", label: "Videos", icon: faTable },
    { key: "2", label: "Favorites", icon: faBook },
    { key: "3", label: "Liked", icon: faHeart },
  ]

  return (
    <div className={`min-h-screen transition ease-in-out duration-300 
      ${theme === "light"
        ? "bg-white text-neutral-800 border-b"
        : "bg-black text-neutral-100 border-b"
      }`}>
      <Spinner visible={loading} />
      <div className="relative container mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative w-52 h-52">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="User Avatar"
                width={208}
                height={208}
                className="rounded-full w-full h-full object-cover cursor-pointer"
                onClick={() => setIsModalVisible(true)}
              />
            ) : (
              <div
                className="w-52 h-52 rounded-full bg-rose-500 flex items-center justify-center text-white text-6xl font-bold cursor-pointer"
                onClick={() => setIsModalVisible(true)}
              >
                {userInitials}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-bold">{user?.username}</h1>
            <div className="flex space-x-6">
              <span className="text-sm"><strong>{user?.followingCount}</strong> Following</span>
              <span className="text-sm"><strong>{user?.followersCount}</strong> Followers</span>
              <span className="text-sm"><strong>{user?.likesCount}</strong> Likes</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">{user?.bio || "No bio available"}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsModalVisible(true)}
                className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition duration-300"
              >
                Edit Profile
              </button>
              <button className={`py-2 px-4 rounded transition duration-300 ${theme === "light"
                ? "bg-neutral-100 hover:bg-neutral-200"
                : "bg-neutral-700/90 hover:bg-neutral-600"
                } focus:outline-none`}>
                <FontAwesomeIcon icon={faShare} className={`${theme === "light"
                  ? "text-neutral-600"
                  : "text-neutral-100"
                  }`} />
              </button>
              <button className={`py-2 px-4 rounded transition duration-300 ${theme === "light"
                ? "bg-neutral-100 hover:bg-neutral-200"
                : "bg-neutral-700/90 hover:bg-neutral-600"
                } focus:outline-none`}>
                <FontAwesomeIcon icon={faCog} className={`${theme === "light"
                  ? "text-neutral-600"
                  : "text-neutral-100"
                  }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className={`flex border-b ${theme === "light" ? "border-neutral-200" : "border-neutral-800"}`}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`flex items-center space-x-2 px-4 py-2 ${activeTab === tab.key
                  ? `${theme === "light" ? "border-b-2 border-neutral-700 text-neutral-700" : "border-b-2 text-neutral-200 border-neutral-200"}`
                  : `${theme === "light" ? "text-neutral-400 hover:text-neutral-400" : "text-neutral-500 hover:text-neutral-300"}`
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <FontAwesomeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className={`mt-4 text-center ${theme === "light" ? "text-neutral-400" : "text-neutral-500"}`}>
            {activeTab === "1" && "Upload your first video. Your videos will appear here."}
            {activeTab === "2" && "Favorite posts. Your favorite posts will appear here."}
            {activeTab === "3" && "No liked videos yet. Videos you liked will appear here."}
          </div>
        </div>
      </div>

      {isModalVisible && user && (
        <EditProfileModal
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          userAvatar={user?.avatar}
          userId={user?._id}
          userUsername={user?.username}
          userBio={user?.bio}
          theme={theme}
        />
      )}
    </div>
  )
}

export default ProfilePage