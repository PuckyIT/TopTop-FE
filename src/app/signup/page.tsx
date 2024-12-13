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

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/signup", {
        email,
        username,
        password,
      });
      toast.success("Registration successful!");
      router.push("/login");
    } catch (error) {
      toast.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen p-4 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-gray-50 to-blue-50"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-lg p-8 space-y-6 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-neutral-800 text-white" : "bg-white text-neutral-800"
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-2xl font-bold">TopTop</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400 ${
                theme === "dark"
                  ? "bg-neutral-700 border-neutral-600"
                  : "bg-neutral-50 border-neutral-300"
              }`}
              placeholder="Your Email"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`mt-1 block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400 ${
                theme === "dark"
                  ? "bg-neutral-700 border-neutral-600"
                  : "bg-neutral-50 border-neutral-300"
              }`}
              placeholder="Your Username"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400 ${
                  theme === "dark"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400 ${
                  theme === "dark"
                    ? "bg-neutral-700 border-neutral-600"
                    : "bg-neutral-50 border-neutral-300"
                }`}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  className={
                    theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                  }
                />
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white ${
            loading
              ? "bg-rose-400 cursor-not-allowed"
              : "bg-rose-500 hover:bg-rose-600"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="flex justify-end items-center">
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Already have an account? Log In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
