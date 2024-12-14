"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "@/untils/axiosInstance";
import toast from "react-hot-toast";
import ForgotPasswordModal from "@/components/modal/ForgotPasswordModal";
import OtpModal from "@/components/modal/OtpModal";
import ResetPasswordModal from "@/components/modal/ResetPasswordModal";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const onFinish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await axiosInstance.post(
        "/auth/login",
        {
          email,
          password,
        }, {
        headers: {
          "Content-Type": "application/json",
        },
      }
      );
      toast.success("Đăng nhập thành công!");
      dispatch(setUser({ ...response.data, isActive: true }));
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("refreshToken", response.data.refreshToken);
      router.push("/home");
    } catch (error) {
      toast.error("Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("OTP đã được gửi đến email của bạn!");
      setForgotPasswordModal(false);
      setOtpModal(true);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error("OTP đã gửi. Vui lòng kiểm tra mail.");
      } else {
        toast.error("Không thể gửi OTP. Vui lòng thử lại.");
      }
    }
  };

  const handleVerifyOtp = (otp: string) => {
    setOtp(otp);
    setOtpModal(false);
    setResetPasswordModal(true);
  };

  const handleResetPassword = async (
    newPassword: string,
    confirmPassword: string
  ) => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      await axiosInstance.post(`/auth/reset-password/${otp}`, {
        email: forgotEmail,
        newPassword: newPassword,
      });
      toast.success("Đặt lại mật khẩu thành công!");
      setResetPasswordModal(false);
      setForgotEmail("");
    } catch (error) {
      toast.error("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://top-top-be.vercel.app/api/v1/auth/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "https://top-top-be.vercel.app/api/v1/auth/github";
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen p-4 
        ${theme === "dark"
          ? "bg-gradient-to-br from-neutral-900 to-neutral-800"
          : "bg-gradient-to-br from-neutral-50 to-neutral-100"
        }`}
    >
      <form
        onSubmit={onFinish}
        className={`w-full max-w-lg p-8 space-y-6 rounded-xl shadow-lg 
          ${theme === "dark" ? "bg-neutral-700 text-white" : "bg-neutral-50 text-neutral-800"}`}
      >
        <div className="flex flex-col items-center space-y-2">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-2xl font-bold">TopTop</h1>
        </div>

        <div className="flex space-y-4 px-6 gap-y-2 flex-col">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={`mt-1 text-sm block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400 ${theme === "dark"
                ? "bg-neutral-700 border-neutral-600"
                : "bg-neutral-50 border-neutral-300"
                }`}
              placeholder="Your Email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                className={`block text-sm w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400 
                  ${theme === "dark"
                    ? "bg-neutral-700 border-neutral-600"
                    : "bg-neutral-50 border-neutral-300"
                  }`}
                placeholder="Your Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className={
                    theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                  }
                />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white ${loading
              ? "bg-rose-400 cursor-not-allowed"
              : "bg-rose-500 hover:bg-rose-600"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="flex items-center justify-between pt-4">
            <Link
              href="/signup"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Sign Up
            </Link>
            <button
              type="button"
              onClick={() => setForgotPasswordModal(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot Password?
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${theme === "dark" ? "border-neutral-600" : "border-neutral-300"
                  }`}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${theme === "dark"
                  ? "bg-neutral-700 text-neutral-400"
                  : "bg-neutral-50 text-neutral-500"
                  }`}
              >
                Sign in with
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`flex items-center justify-center w-12 h-12 rounded-full ${theme === "dark"
                ? "bg-neutral-600 hover:bg-neutral-500"
                : "bg-neutral-200 hover:bg-neutral-300"
                }`}
            >
              <Image
                src="/icons/google.png"
                alt="Google Icon"
                width={24}
                height={24}
              />
            </button>
            <button
              type="button"
              onClick={handleGithubLogin}
              className={`flex items-center justify-center w-12 h-12 rounded-full ${theme === "dark"
                ? "bg-neutral-600 hover:bg-neutral-500"
                : "bg-neutral-200 hover:bg-neutral-300"
                }`}
            >
              <Image
                src="/icons/github.png"
                alt="GitHub Icon"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      </form>

      <ForgotPasswordModal
        isOpen={forgotPasswordModal}
        onClose={() => setForgotPasswordModal(false)}
        onSubmit={handleForgotPassword}
        theme={theme}
      />

      <OtpModal
        isOpen={otpModal}
        onClose={() => setOtpModal(false)}
        onSubmit={handleVerifyOtp}
        theme={theme}
      />

      <ResetPasswordModal
        isOpen={resetPasswordModal}
        onClose={() => setResetPasswordModal(false)}
        onSubmit={handleResetPassword}
        theme={theme}
      />
    </div>
  );
};

export default LoginPage;
