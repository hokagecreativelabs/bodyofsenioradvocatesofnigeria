"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "./auth/LoginModal";
import Image from "next/image";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false); // Ensure client-side rendering
  const { user, logoutMutation } = useAuth();

  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isAboutPage = pathname === "/about";
  const isEventsPage = pathname === "/events";
  const isMembersPage = pathname === "/members";
  const isContactPage = pathname === "/contact";

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Smooth scroll detection with throttling for performance
  useEffect(() => {
    if (!isClient) return; // Prevent execution during SSR

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isClient]);

  // Smoother transition values with easing
  const navbarHeight = "70px"; // Fixed height for consistency
  const isScrolled = scrollY > 5; // Lower threshold for earlier activation

  // Calculate opacity with easing function for smoother transition
  const ease = (t) => t * (2 - t); // Quadratic ease-out
  const navbarOpacity = ease(Math.min(scrollY / 80, 1)) * 0.98;
  const shadowOpacity = ease(Math.min(scrollY / 40, 1)) * 0.15;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <header
        className={`${
          isScrolled ? "fixed top-0 left-0 right-0 will-change-transform" : "relative"
        } transition-all duration-300 z-50`}
        style={{
          height: navbarHeight,
          backgroundColor: isScrolled
            ? `rgba(255, 255, 255, ${0.95 + navbarOpacity * 0.05})`
            : "white",
          boxShadow: isScrolled
            ? `0 4px 12px rgba(0, 0, 0, ${shadowOpacity})`
            : "none",
          backdropFilter: isScrolled ? "blur(8px)" : "none",
          transform: "translate3d(0, 0, 0)", // Force GPU acceleration
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section */}
            <div className="flex items-center h-full">
              <Link href="/" className="flex items-center h-full">
                <div
                  className="h-[60px] w-[60px] flex items-center justify-center overflow-hidden rounded-full bg-[#0F2C59]"
                  style={{ maxHeight: "60px", maxWidth: "60px" }}
                >
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
                  <h1 className="text-[#0F2C59] font-playfair font-bold text-lg sm:text-xl">
                    BOSAN
                  </h1>
                  <p className="text-xs text-gray-500">
                    Body of Senior Advocates of Nigeria
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link
                href="/"
                className={`font-montserrat font-medium cursor-pointer ${
                  isHomePage ? "text-[#0F2C59]" : "text-[#343A40]"
                } hover:text-[#D4AF37] transition duration-300`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`font-montserrat font-medium cursor-pointer ${
                  isAboutPage ? "text-[#0F2C59]" : "text-[#343A40]"
                } hover:text-[#D4AF37] transition duration-300`}
              >
                About
              </Link>
              <Link
                href="/events"
                className={`font-montserrat font-medium cursor-pointer ${
                  isEventsPage ? "text-[#0F2C59]" : "text-[#343A40]"
                } hover:text-[#D4AF37] transition duration-300`}
              >
                Events
              </Link>
              <Link
                href="/members"
                className={`font-montserrat font-medium cursor-pointer ${
                  isMembersPage ? "text-[#0F2C59]" : "text-[#343A40]"
                } hover:text-[#D4AF37] transition duration-300`}
              >
                Members
              </Link>
              <Link
                href="/contact"
                className={`font-montserrat font-medium cursor-pointer ${
                  isContactPage ? "text-[#0F2C59]" : "text-[#343A40]"
                } hover:text-[#D4AF37] transition duration-300`}
              >
                Contact
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    className="font-montserrat bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Dashboard</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              ) : (
                <Button
                  className="font-montserrat bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center space-x-2"
                  onClick={handleOpenLoginModal}
                >
                  <span>Member Login</span>
                  <Lock className="h-4 w-4" />
                </Button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="text-[#0F2C59] hover:text-[#D4AF37] focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden absolute left-0 right-0 bg-white z-50"
                style={{ top: navbarHeight }}
              >
                <div className="px-2 pt-2 pb-4 space-y-1 border-t shadow-lg">
                  <Link
                    href="/"
                    className="block px-3 py-2 text-[#0F2C59] font-medium hover:bg-[#F8F9FA] rounded cursor-pointer"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="block px-3 py-2 text-[#343A40] font-medium hover:bg-[#F8F9FA] rounded cursor-pointer"
                  >
                    About
                  </Link>
                  <Link
                    href="/events"
                    className="block px-3 py-2 text-[#343A40] font-medium hover:bg-[#F8F9FA] rounded cursor-pointer"
                  >
                    Events
                  </Link>
                  <Link
                    href="/members"
                    className="block px-3 py-2 text-[#343A40] font-medium hover:bg-[#F8F9FA] rounded cursor-pointer"
                  >
                    Members
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-3 py-2 text-[#343A40] font-medium hover:bg-[#F8F9FA] rounded cursor-pointer"
                  >
                    Contact
                  </Link>

                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="block w-full mt-2 font-montserrat bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 text-center cursor-pointer"
                      >
                        Dashboard
                      </Link>
                      <button
                        className="block w-full mt-2 font-montserrat border border-[#0F2C59] text-[#0F2C59] px-5 py-2 rounded hover:bg-[#0F2C59] hover:text-white transition duration-300 text-center"
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                      >
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </button>
                    </>
                  ) : (
                    <button
                      className="w-full mt-2 font-montserrat bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center justify-center space-x-2"
                      onClick={handleOpenLoginModal}
                    >
                      <span>Member Login</span>
                      <Lock className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* This div ensures content flows properly when navbar becomes fixed */}
      {isScrolled && <div style={{ height: navbarHeight }}></div>}

      {/* Improved parallax effect for page content */}
      <div
        id="content-wrapper"
        className="relative will-change-transform"
        style={{
          transform: isScrolled ? `translate3d(0, ${Math.min(scrollY * 0.03, 20)}px, 0)` : "none",
          transition: "transform 0.05s cubic-bezier(0.33, 1, 0.68, 1)",
        }}
      >
        {/* Your page content goes here - this wrapper adds the parallax effect */}
      </div>

      <LoginModal isOpen={loginModalOpen} onClose={handleCloseLoginModal} />
    </>
  );
};

export default Navbar;