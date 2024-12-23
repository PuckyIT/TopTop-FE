// LoginCallback.tsx
"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import axiosInstance from "@/untils/axiosInstance";

const LoginCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const processLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Lưu token vào localStorage
        localStorage.setItem("token", token);

        // Gọi API lấy thông tin người dùng
        const response = await axiosInstance.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;

        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("user", JSON.stringify({ ...user, isActive: true }));

        // Chuyển hướng đến trang chính
        router.push("/home");
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        router.push("/login");
      }
    };

    processLogin();
  }, [router]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default dynamic(() => Promise.resolve(LoginCallback), { ssr: false });