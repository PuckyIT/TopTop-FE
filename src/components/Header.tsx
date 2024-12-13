"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faGlobe,
  faMoon,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "@/untils/axiosInstance";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/redux/userSlice";
import UploadVideoButton from "@/components/UploadVideoButton";
import CustomDropdown from "./DropdownBtn";
import toast from "react-hot-toast";

const HeaderComponent: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
      setIsLoggedIn(true);
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/home";
    } catch (error) {
      toast.error("Logout failed:");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const userInitials = user?.email
    ? user.email
      .split("@")[0]
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
    : "U";

  const menuItems = [
    {
      key: "language",
      label: "Translate",
      icon: <FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />,
    },
    {
      key: "theme",
      label: theme === "light" ? "Dark" : "Light",
      icon: <FontAwesomeIcon icon={faMoon} className="w-4 h-4" />,
      onClick: toggleTheme,
    },
    {
      key: "logout",
      label: "Log out",
      icon: <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />,
      onClick: handleLogout,
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full h-20 z-10 flex items-center justify-between px-5 theme-transition transition ease-in-out duration-300 
        ${theme === "light"
          ? "bg-white text-neutral-800 border-b border-neutral-200"
          : "bg-black text-neutral-100 border-b border-neutral-800"
        }`}
    >
      <div className="flex items-center w-1/6">
        <Link href="/home" className="flex items-center no-underline">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="transition-transform duration-300 hover:scale-90 cursor-pointer"
          />
          <span
            className={`text-3xl font-semibold ${theme === "light" ? "text-neutral-800" : "text-neutral-100"
              } text-shadow`}
          >
            TopTop
          </span>
        </Link>
      </div>

      <div className="relative w-96">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className={`w-full py-2 px-4 rounded-full text-base transition ease-in-out duration-300 ${theme === "light"
            ? "bg-neutral-100 text-neutral-800 placeholder-gray-500"
            : "bg-neutral-700 text-neutral-100 placeholder-gray-400"
            } focus:outline-none focus:ring-2 focus:ring-red-500`}
        />
        <FontAwesomeIcon
          icon={faSearch}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-neutral-400" : "text-neutral-500"
            } cursor-pointer hover:text-red-500 transition-colors duration-300`}
        />
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center">
            <UploadVideoButton />
            <Link href="/profile" className="ml-4">
              <div
                className={`w-10 h-10 max-w-10 max-h-10 rounded-full flex items-center justify-center text-white font-bold
                  }`}
              >
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </div>
            </Link>
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
              Log in
            </button>
          </Link>
        )}
        <CustomDropdown items={menuItems} theme={theme} />
      </div>
    </header>
  );
};

export default HeaderComponent;
