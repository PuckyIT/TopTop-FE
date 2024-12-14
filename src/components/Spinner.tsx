import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import Link from "next/link";

interface SpinnerProps {
  visible: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ visible }) => {
  const { theme } = useTheme();
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
    setShow(true);
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`fixed flex-col inset-0 flex items-center justify-center z-50 h-screen w-screen ${visible ? "opacity-100" : "opacity-0"
        }`}
      style={{
        backgroundColor:
          theme === "dark" ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <Image src="/logo.png" alt="Logo" width={250} height={250} />
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        size="3x"
        className={theme === "dark" ? "text-white" : "text-neutral-800"}
        style={{
          transition: "transform 0.3s ease-in-out", // Hiệu ứng xoay đồng bộ
          transform: visible ? "scale(1)" : "scale(0.5)", // Mặc định scale nhỏ hơn khi chưa hiển thị
          width: "3%",
        }}
      />
      <p className={`mt-5 ${theme === "dark" ? "text-white" : "text-neutral-800"}`}>
        Waiting for Backend to load data:
        <Link href="https://toptop-be.onrender.com" className="text-blue-500">
          Click here
        </Link>

      </p>
      <p className={theme === "dark" ? "text-white" : "text-neutral-800"}>
        The website is not yet complete.
      </p>
    </div>
  );
};

export default Spinner;
