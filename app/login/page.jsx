"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setAuthError("");

      try {
        const res = await axios.post("/api/auth/login", values);
        toast.success("Login successful! Redirecting...", {
          position: "top-center",
          autoClose: 1500,
        });
        setTimeout(() => {
          router.push("/member-dashboard");
          router.refresh();
        }, 1500);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Login failed. Please check your credentials.";
        setAuthError(errorMessage);
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 4000,
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen w-full">
      <ToastContainer />

      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-blue-900 text-white flex-col justify-center items-center p-12">
        <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
        <p className="text-lg text-gray-200 mb-6">
          Please log in to access your account and manage your profile.
        </p>
        <p className="text-sm text-gray-300">
          Need help? Contact support@example.com
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center text-blue-900">
            Member Login
          </h2>

          {authError && (
            <div
              className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md"
              aria-live="polite"
            >
              {authError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!(formik.touched.email && formik.errors.email)}
                  aria-describedby="email-error"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                  {...formik.getFieldProps("email")}
                />
                <FaEnvelope className="absolute top-3 right-3 text-gray-400" />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={
                    !!(formik.touched.password && formik.errors.password)
                  }
                  aria-describedby="password-error"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                  {...formik.getFieldProps("password")}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p id="password-error" className="text-sm text-red-600 mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-700 hover:text-blue-900 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !formik.isValid}
                className={`w-full ${
                  loading || !formik.isValid
                    ? "bg-blue-700 opacity-70 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-800"
                } text-white py-3 rounded-md transition-colors flex justify-center items-center`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          {/* Signup Redirect */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
