"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCompass,
  faUsers,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

const Sidebar = () => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("1");
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const { theme } = useTheme();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUserLoggedIn(!!user);
  }, []);

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    switch (key) {
      case "1":
        router.push("/home");
        break;
      case "2":
        router.push("/explore");
        break;
      case "3":
        router.push("/following");
        break;
      case "4":
        router.push("/profile");
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: faHome as IconDefinition,
      label: "For You",
    },
    {
      key: "2",
      icon: faCompass as IconDefinition,
      label: "Explore",
    },
    {
      key: "3",
      icon: faUsers as IconDefinition,
      label: "Following",
    },
    ...(userLoggedIn
      ? [
        {
          key: "4",
          icon: faUser as IconDefinition,
          label: "Profile",
        },
      ]
      : []),
  ];

  return (
    <div
      id="sidebar"
      className={`w-64 p-4 max-h-screen theme-transition bg-transparent transition ease-in-out duration-300 ${theme === "light"
        ? "text-neutral-800"
        : "text-neutral-100"
        }`}
    >
      <div className="space-y-2 mt-20 flex flex-col">
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => handleMenuClick(item.key)}
            className={`flex items-center text-left space-x-3 p-3 rounded-md cursor-pointer transition-all duration-200 
              ${selectedKey === item.key
                ? theme === "dark"
                  ? "text-red-500 font-bold"
                  : "text-red-600 font-bold"
                : theme === "dark"
                  ? "text-neutral-400 hover:text-neutral-200"
                  : "text-neutral-800 hover:text-neutral-600"
              }`}
          >
            <FontAwesomeIcon icon={item.icon} className="text-lg w-8" />
            <span className="text-xl font-semibold">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
