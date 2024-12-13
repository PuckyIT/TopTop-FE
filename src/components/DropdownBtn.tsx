"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface CustomDropdownProps {
  items: MenuItem[];
  theme: string; // Nhận theme từ parent component
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ items, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownThemeClasses =
    theme === "light"
      ? "bg-white text-neutral-800 border-neutral-200"
      : "bg-neutral-800 text-neutral-200 border-neutral-700";

  const dropdownItemThemeClasses =
    theme === "light"
      ? "hover:bg-neutral-100 text-neutral-800"
      : "hover:bg-neutral-700 text-neutral-200";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full ${
          theme === "light" ? "text-neutral-500" : "text-neutral-300"
        } hover:text-red-500 transition-colors duration-300`}
      >
        <FontAwesomeIcon icon={faEllipsisV} className="w-6 h-6" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-opacity-5 ring-black ${dropdownThemeClasses}`}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {items.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${dropdownItemThemeClasses} transition duration-300`}
                role="menuitem"
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;