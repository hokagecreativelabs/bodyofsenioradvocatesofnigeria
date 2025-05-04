"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaTimes, FaLock, FaTachometerAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
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
  }, []);

  // Watch for pathname changes to update auth status
  useEffect(() => {
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
  }, [pathname]);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Members", path: "/members" },
    { title: "Contact", path: "/contact" },
  ];

  const handleCtaClick = () => {
    if (isLoggedIn) {
      router.push("/member-dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setIsLoggedIn(false);
      setUser(null);
      router.push('/');
      router.refresh(); // Force refresh to update auth state
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/assets/BOSAN-logo.png" 
                  alt="Company Logo" 
                  width={180} 
                  height={50} 
                  className="h-18 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`font-montserrat text-base font-medium transition-colors duration-300 ${
                    pathname === link.path 
                      ? "text-blue-900 border-b-2 border-blue-900"
                      : "text-gray-700 hover:text-blue-900"
                  }`}
                >
                  {link.title}
                </Link>
              ))}

              {/* Desktop CTA */}
              {!loading && (
                <>
                  <button
                    onClick={handleCtaClick}
                    className="flex items-center bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                  >
                    {isLoggedIn ? (
                      <FaTachometerAlt className="mr-2" />
                    ) : (
                      <FaLock className="mr-2" />
                    )}
                    {isLoggedIn ? "Dashboard" : "Member Login"}
                  </button>
                  
                  {isLoggedIn && (
                    <div className="relative group">
                      <button className="flex items-center text-gray-700 hover:text-blue-900">
                        <FaUser className="mr-1" />
                        <span className="hidden lg:inline">{user?.name || 'Account'}</span>
                      </button>
                      <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg hidden group-hover:block">
                        <div className="py-1">
                          <Link href="/member-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Profile
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FaSignOutAlt className="inline mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </nav>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-blue-900 focus:outline-none"
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed top-20 left-0 right-0 bg-white shadow-lg z-40 border-t">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded text-base font-medium ${
                    pathname === link.path
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-900"
                  }`}
                >
                  {link.title}
                </Link>
              ))}

              {/* Mobile CTA */}
              {!loading && (
                <>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleCtaClick();
                    }}
                    className="mt-4 flex items-center justify-center bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition w-full"
                  >
                    {isLoggedIn ? (
                      <FaTachometerAlt className="mr-2" />
                    ) : (
                      <FaLock className="mr-2" />
                    )}
                    {isLoggedIn ? "Dashboard" : "Member Login"}
                  </button>
                  
                  {isLoggedIn && (
                    <div className="mt-2 space-y-2 border-t pt-2">
                      <Link 
                        href="/member-profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <FaUser className="mr-2" />
                        Profile
                      </Link>
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;