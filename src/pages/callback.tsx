// LoginCallback.tsx
"use client";

import { setUser } from "@/app/redux/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";

const LoginCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const avatar = urlParams.get("avatar");

    if (token && email && avatar) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email, avatar }));
      dispatch(setUser({ email, avatar }));
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [router, dispatch]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default dynamic(() => Promise.resolve(LoginCallback), { ssr: false });