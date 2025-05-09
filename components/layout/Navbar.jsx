"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Lock } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Committee", path: "/committee" },
    { title: "Events", path: "/events" },
    { title: "Members", path: "/members" },
    { title: "Resources", path: "/resources" },
    { title: "Contact", path: "/contact" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-[60px] w-[60px] overflow-hidden bg-[#0F2C59] flex justify-center items-center">
              <Image
                src="/assets/BOSAN-logo.png"
                alt="BOSAN Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-[#0F2C59] font-playfair font-bold text-lg sm:text-xl">
                BOSAN
              </h3>
              <p className="text-sm text-gray-800">
                Body of Senior Advocates of Nigeria
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-medium ${
                  pathname === link.path
                    ? "text-[#0F2C59] border-b-2 border-[#0F2C59]"
                    : "text-[#343A40]"
                } hover:text-[#D4AF37] transition duration-300`}
              >
                {link.title}
              </Link>
            ))}
            <Link
              href="/login"
              className="ml-4 inline-flex items-center px-4 py-4 text-sm font-medium text-white bg-[#0F2C59] hover:bg-[#D4AF37] transition"
            >
              <Lock className="w-4 h-4 mr-2" />
              Member Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="text-[#0F2C59] hover:text-[#D4AF37] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden bg-white px-4 py-4 space-y-4 shadow-md transition-all duration-300 ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            onClick={() => setMobileMenuOpen(false)}
            className={`block font-medium ${
              pathname === link.path
                ? "text-[#0F2C59] border-l-4 pl-2 border-[#0F2C59]"
                : "text-[#343A40]"
            } hover:text-[#D4AF37] transition duration-300`}
          >
            {link.title}
          </Link>
        ))}

        <Link
          href="/login"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center mt-4 px-4 py-2 text-sm font-medium text-white bg-[#0F2C59] hover:bg-[#D4AF37] w-fit"
        >
          <Lock className="w-4 h-4 mr-2" />
          Member Login
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
