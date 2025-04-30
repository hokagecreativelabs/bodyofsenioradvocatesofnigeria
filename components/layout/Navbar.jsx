"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import LoginModal from "@/components/layout/auth/LoginModal";

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/"); // Redirect to home page after logout
  };

  const navigateToDashboard = () => {
    router.push("/member-dashboard");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Navigation links
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Services", path: "/services" },
    { title: "Resources", path: "/resources" },
    { title: "Contact", path: "/contact" }
  ];

  return (
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
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
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={navigateToDashboard}
                  className="font-montserrat bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center space-x-2"
                >
                  <span>Dashboard</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="border-blue-900 text-blue-900 hover:bg-blue-50"
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <Button
                className="font-montserrat bg-[#0F2C59] text-white px-5 py-2 rounded hover:bg-opacity-90 transition duration-300 flex items-center space-x-2"
                onClick={handleOpenLoginModal}
              >
                <span>Member Login</span>
                <Lock className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <Button
                onClick={navigateToDashboard}
                className="font-montserrat bg-[#0F2C59] text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 transition duration-300 mr-4"
              >
                Dashboard
              </Button>
            )}
            <button
              onClick={handleToggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-900"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.path
                    ? "bg-blue-50 text-blue-900"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-900"
                }`}
                onClick={closeMenu}
              >
                {link.title}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            {user ? (
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-900"
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            ) : (
              <button
                onClick={() => {
                  handleOpenLoginModal();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-900 flex items-center"
              >
                <span>Member Login</span>
                <Lock className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseLoginModal} 
      />
    </header>
  );
};

export default Navbar;