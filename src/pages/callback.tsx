"use client";

import { setUser } from "@/app/redux/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const LoginCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const avatar = urlParams.get("avatar");

    if (token && email && avatar) {
      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email, avatar }));
      dispatch(setUser({ email, avatar }));
      // Navigate to home page
      router.push("/home");
    } else {
      // Handle missing or invalid data
      console.error("Missing token, email, or avatar in callback URL");
      router.push("/login");
    }
  }, [dispatch, router]);

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
      <p>Đang xử lý đăng nhập...</p>
    </div>
  );
};

export default LoginCallback;