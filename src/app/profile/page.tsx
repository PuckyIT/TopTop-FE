/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTheme } from "@/app/context/ThemeContext"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "@/app/redux/userSlice"
import axiosInstance from "@/untils/axiosInstance"
import { toast } from 'react-hot-toast'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTable, faBook, faHeart, faShare, faCog } from "@fortawesome/free-solid-svg-icons"
import EditProfileModal from "@/components/EditProfileModal"
import { User } from "../types/user.types"

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user) as User
  const [loading, setLoading] = useState<boolean>(true)
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState("1")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const router = useRouter()

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
      setLoading(false)
      router.push('/login')
    }
  }, [dispatch, router])

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="relative container mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="User Avatar"
                width={212}
                height={212}
                className="rounded-full cursor-pointer"
                onClick={() => setIsModalVisible(true)}
              />
            ) : (
              <div
                className="w-52 h-52 rounded-full bg-red-500 flex items-center justify-center text-white text-6xl font-bold cursor-pointer"
                onClick={() => setIsModalVisible(true)}
              >
                {userInitials}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold">{user?.username}</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsModalVisible(true)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Edit Profile
              </button>
              <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300">
                <FontAwesomeIcon icon={faShare} className="text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300">
                <FontAwesomeIcon icon={faCog} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="flex space-x-6">
              <span><strong>{user?.followingCount}</strong> Following</span>
              <span><strong>{user?.followersCount}</strong> Followers</span>
              <span><strong>{user?.likesCount}</strong> Likes</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{user?.bio || "No bio available"}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`flex items-center space-x-2 px-4 py-2 ${
                  activeTab === tab.key
                    ? 'border-b-2 border-gray-700 text-gray-700'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <FontAwesomeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
            {activeTab === "1" && "Upload your first video. Your videos will appear here."}
            {activeTab === "2" && "Favorite posts. Your favorite posts will appear here."}
            {activeTab === "3" && "No liked videos yet. Videos you liked will appear here."}
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        user={user}
        theme={theme}
      />
    </div>
  )
}

export default ProfilePage