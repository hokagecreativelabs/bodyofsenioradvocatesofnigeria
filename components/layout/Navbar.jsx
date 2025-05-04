"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaLock, FaTachometerAlt } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLoggedIn = false; // Replace with actual auth logic

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Members", path: "/members" },
    { title: "Contact", path: "/contact" },
  ];

  const cta = isLoggedIn
    ? { label: "Dashboard", href: "/dashboard", icon: <FaTachometerAlt className="mr-2" /> }
    : { label: "Member Login", href: "/login", icon: <FaLock className="mr-2" /> };

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
            <Link
              href={cta.href}
              className="flex items-center bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
            >
              {cta.icon}
              {cta.label}
            </Link>
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
            <Link
              href={cta.href}
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 flex items-center justify-center bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition w-full"
            >
              {cta.icon}
              {cta.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
