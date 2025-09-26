import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await auth.login(formData.email, formData.password);
      const data = response.data;

      if (data?.token) {
        login(data.token);
        sessionStorage.setItem("token", data.token);
        toast.success("Welcome to QuickBook!");
        navigate("/rooms");
      } else {
        toast.error("Login failed. No token received.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Invalid credentials");
      sessionStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-[#1A237E] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 
                0 0114.998 0A17.933 17.933 0 0112 
                21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Welcome
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-[#1A237E] hover:text-[#151B60] transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 
                      2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 
                      0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 
                      0 00-2.25 2.25m19.5 0v.243a2.25 2.25 
                      0 01-1.07 1.916l-7.5 4.615a2.25 2.25 
                      0 01-2.36 0L3.32 8.91a2.25 2.25 
                      0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 block w-full px-3 py-3 border 
                    ${errors.email ? "border-red-500" : "border-[#E6F7F5]"}
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-[#00B8A6] focus:border-[#00B8A6] transition-all duration-200 bg-[#F6F8FE]`}
                  placeholder="username@jadeglobal.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 
                      0 10-9 0v3.75m-.75 11.25h10.5a2.25 
                      2.25 0 002.25-2.25v-6.75a2.25 
                      2.25 0 00-2.25-2.25H6.75a2.25 
                      2.25 0 00-2.25 2.25v6.75a2.25 
                      2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 block w-full px-3 py-3 border 
                    ${errors.password ? "border-red-500" : "border-[#E6F7F5]"}
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-[#00B8A6] focus:border-[#00B8A6] transition-all duration-200 bg-[#F6F8FE]`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-sm 
              text-sm font-medium text-white bg-[#1A237E] hover:bg-[#151B60] 
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-[#1A237E] transition-colors duration-200 
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 
                  0 5.373 0 12h4z"
                ></path>
              </svg>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} QuickBook. All rights reserved.
      </p>
    </div>
  );
}
