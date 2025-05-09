"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Lock, User, LogOut, ChevronDown, Menu, X, Eye, EyeOff, Mail } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";

const Navbar = () => {
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Refs for click outside handling
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  // Next.js hooks
  const pathname = usePathname();
  const router = useRouter();

  // Fix hydration issues by ensuring component is mounted before rendering browser-specific content
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isMounted) return;
    
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      
      // Close mobile menu when clicking outside if it's open
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, isMounted]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (!isMounted) return;
    setMobileMenuOpen(false);
  }, [pathname, isMounted]);

  // Check authentication status on component mount
  useEffect(() => {
    if (!isMounted) return;

    const checkAuthStatus = async () => {
      try {
        const res = await axios.get('/api/auth/check-auth');
        setIsLoggedIn(true);
        setUser(res.data.user);
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [isMounted]);

  // Watch for pathname changes to update auth status
  useEffect(() => {
    if (!isMounted) return;
    
    // If user navigates to/from login or member pages, check auth again
    if (pathname.includes('login') || pathname.includes('member') || pathname === '/') {
      const checkAuthStatus = async () => {
        try {
          const res = await axios.get('/api/auth/check-auth');
          setIsLoggedIn(true);
          setUser(res.data.user);
        } catch (error) {
          setIsLoggedIn(false);
          setUser(null);
        }
      };

      checkAuthStatus();
    }
  }, [pathname, isMounted]);

  // Login form validation
  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoginLoading(true);
      try {
        const res = await axios.post("/api/auth/login", values);
        
        // Close modal and update auth state
        setLoginModalOpen(false);
        setIsLoggedIn(true);
        setUser(res.data.user);
        
        // Show success toast
        toast.success("Login successful!");
        
        // Redirect to dashboard
        router.push("/member-dashboard");
      } catch (err) {
        console.error("Login error:", err);
        toast.error(err.response?.data?.message || "Invalid credentials");
      } finally {
        setLoginLoading(false);
      }
    },
  });

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Committee", path: "/committee" },
    { title: "Events", path: "/events" },
    { title: "Members", path: "/members" },
    { title: "Resources", path: "/resources" },
    { title: "Contact", path: "/contact" },
  ];

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };
  
  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setIsLoggedIn(false);
      setUser(null);
      setProfileDropdownOpen(false);
      toast.success("Logged out successfully");
      router.push('/');
      router.refresh(); // Force refresh to update auth state
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Early return while checking if we're mounted - avoids hydration mismatch
  if (!isMounted) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center space-x-2 mb-4 cursor-pointer">
                  <div className="h-[60px] w-[60px] flex items-center justify-center overflow-hidden rounded-full bg-[#0F2C59]">
                    {/* Image will be client rendered */}
                  </div>
                  <div className="ml-2">
                    <h3 className="text-[#0F2C59] font-playfair font-bold text-lg sm:text-xl">BOSAN</h3>
                    <p className="text-sm text-gray-800">Body of Senior Advocates of Nigeria</p>
                  </div>
                </div>
              </Link>
            </div>
            {/* Simplified navigation for pre-hydration */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="font-medium cursor-pointer text-[#343A40] hover:text-[#D4AF37] transition duration-300"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
            <div className="md:hidden">
              <button 
                className="text-[#0F2C59] hover:text-[#D4AF37] focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 mb-4 cursor-pointer">
                <div className="h-[60px] w-[60px] flex items-center justify-center overflow-hidden rounded-full bg-[#0F2C59]">
                  <Image
                    src="/assets/BOSAN-logo.png"
                    alt="BOSAN Logo"
                    width={60}
                    height={60}
                    style={{
                      objectFit: "contain",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
                <div className="ml-2">
                  <h3 className="text-[#0F2C59] font-playfair font-bold text-lg sm:text-xl">BOSAN</h3>
                  <p className="text-sm text-gray-800">Body of Senior Advocates of Nigeria</p>
                </div>
              </div>
            </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`font-medium cursor-pointer ${
                    pathname === link.path 
                      ? 'text-[#0F2C59] border-b-2 border-[#0F2C59]' 
                      : 'text-[#343A40]'
                  } hover:text-[#D4AF37] transition duration-300`}
                >
                  {link.title}
                </Link>
              ))}
              
              {!loading && (
                <>
                  {isLoggedIn ? (
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/member-dashboard"
                        className="bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center space-x-2"
                      >
                        <span>Dashboard</span>
                      </Link>
                      
                      <div ref={profileDropdownRef} className="relative">
                        <button 
                          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                          className="flex items-center text-[#343A40] hover:text-[#0F2C59]"
                        >
                          <User className="h-4 w-4 mr-1" />
                          <span className="hidden lg:inline">{user?.name || 'Account'}</span>
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </button>
                        
                        {profileDropdownOpen && (
                          <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg z-50">
                            <div className="py-1">
                              <Link 
                                href="/member-profile" 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setProfileDropdownOpen(false)}
                              >
                                Profile
                              </Link>
                              <button 
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <LogOut className="inline h-4 w-4 mr-2" />
                                Logout
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      className="bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center space-x-2"
                      onClick={handleOpenLoginModal}
                    >
                      <span>Member Login</span>
                      <Lock className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                className="text-[#0F2C59] hover:text-[#D4AF37] focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden bg-white border-t"
            >
              <div className="px-2 pt-2 pb-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`block px-3 py-2 font-medium hover:bg-[#F8F9FA] rounded cursor-pointer ${
                      pathname === link.path 
                        ? 'text-[#0F2C59]' 
                        : 'text-[#343A40]'
                    }`}
                  >
                    {link.title}
                  </Link>
                ))}
                
                {!loading && (
                  <>
                    {isLoggedIn ? (
                      <>
                        <Link
                          href="/member-dashboard"
                          className="block w-full mt-2 bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 text-center cursor-pointer"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/member-profile"
                          className="block w-full mt-2 border border-[#0F2C59] text-[#0F2C59] px-5 py-2 rounded hover:bg-[#F8F9FA] transition duration-300 text-center"
                        >
                          Profile
                        </Link>
                        <button 
                          className="block w-full mt-2 border border-[#0F2C59] text-[#0F2C59] px-5 py-2 rounded hover:bg-[#0F2C59] hover:text-white transition duration-300 text-center"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <button 
                        className="w-full mt-2 bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center justify-center space-x-2"
                        onClick={handleOpenLoginModal}
                      >
                        <span>Member Login</span>
                        <Lock className="h-4 w-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Login Modal - Only render on client */}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
            {/* Modal Header */}
            <div className="bg-[#0F2C59] text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Member Login</h2>
              <button
                onClick={handleCloseLoginModal}
                className="text-white hover:text-gray-200 focus:outline-none"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={loginFormik.handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`w-full px-4 py-2 pl-4 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                        loginFormik.touched.email && loginFormik.errors.email
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-blue-400"
                      }`}
                      {...loginFormik.getFieldProps("email")}
                    />
                    <Mail className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
                  </div>
                  {loginFormik.touched.email && loginFormik.errors.email && (
                    <p className="text-sm text-red-600 mt-1">{loginFormik.errors.email}</p>
                  )}
                </div>
                
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-2 pl-4 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                        loginFormik.touched.password && loginFormik.errors.password
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-blue-400"
                      }`}
                      {...loginFormik.getFieldProps("password")}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {loginFormik.touched.password && loginFormik.errors.password && (
                    <p className="text-sm text-red-600 mt-1">{loginFormik.errors.password}</p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-[#0F2C59] hover:text-[#D4AF37] transition-colors"
                    onClick={handleCloseLoginModal}
                  >
                    Forgot password?
                  </Link>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className={`w-full ${
                    loginLoading 
                      ? "bg-[#0F2C59] opacity-75 cursor-not-allowed" 
                      : "bg-[#0F2C59] hover:bg-opacity-90"
                  } text-white py-3 rounded-md transition-colors flex justify-center items-center`}
                >
                  {loginLoading ? (
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
              </form>
              
              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link 
                    href="/signup" 
                    className="text-[#0F2C59] hover:text-[#D4AF37] font-medium transition-colors"
                    onClick={handleCloseLoginModal}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;