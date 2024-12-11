"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

const LoginCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const avatar = urlParams.get("avatar"); // Get avatar from URL

    if (token) {
      // Save token, email, and avatar to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email, avatar })); // Save avatar along with email

      // Navigate to home or user page
      router.push("/home");
    } else {
      // Navigate to login page if no token
      router.push("/login");
    }
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Image src="/logo.png" alt="Logo" width={212} height={212} />
      <p>Đang xử lý đăng nhập...</p>
    </div>
  );
};

export default LoginCallback;