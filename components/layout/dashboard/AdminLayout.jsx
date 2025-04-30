// components/layouts/AdminLayout.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { 
  Menu, X, Home, Calendar, Users, Settings, Bell, 
  LogOut, ChevronDown, ChevronRight, Search
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function AdminLayout({ children }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useHasMounted();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("");
  
  // Track active path
  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  // Navigation items
  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/member-dashboard', 
      icon: Home 
    },
    { 
      name: 'Events', 
      href: '/member-dashboard/events', 
      icon: Calendar 
    },
    { 
      name: 'Members', 
      href: '/member-dashboard/members', 
      icon: Users 
    },
    { 
      name: 'Settings', 
      href: '/member-dashboard/settings', 
      icon: Settings 
    },
  ];
  
  // Protected route - redirect if not authenticated
  if (!hasMounted) {
    return null;
  }
  
  if (!user && !isLoading && hasMounted) {
    router.push('/');
    return null;
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Mobile overlay when open */}
      <div 
        className={`${
          sidebarOpen ? 'fixed inset-0 z-40 lg:relative lg:inset-auto' : 'hidden lg:block lg:relative'
        } bg-black bg-opacity-50 lg:bg-opacity-0 transition-opacity duration-300 lg:z-auto`}
        onClick={() => setSidebarOpen(false)}
      >
        {/* Prevent propagation on sidebar content clicks */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 bg-[#0F2C59] text-white flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-blue-800">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-full bg-white">
                <Image
                  src="/assets/BOSAN-logo.png"
                  alt="BOSAN Logo"
                  width={40}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">BOSAN</h1>
              </div>
            </Link>
            
            {/* Close button - mobile only */}
            <button 
              className="lg:hidden text-white hover:text-gray-200 focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Sidebar navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activePath === item.href 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-blue-800">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.fullName || user.email}
                  </p>
                  <p className="text-xs text-blue-200 truncate">
                    Member
                  </p>
                </div>
              </div>
            )}
            
            <Button
              className="w-full mt-4 bg-white text-[#0F2C59] hover:bg-gray-100"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoading ? "Logging out..." : "Log out"}
            </Button>
          </div>
        </aside>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left section */}
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button 
                  className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={24} />
                </button>
                
                {/* Page title - show on desktop */}
                <h2 className="ml-4 lg:ml-0 text-lg font-semibold text-gray-800 hidden sm:block">
                  {navItems.find(item => item.href === activePath)?.name || 'Dashboard'}
                </h2>
              </div>
              
              {/* Right section */}
              <div className="flex items-center space-x-4">
                {/* Search - hide on smallest screens */}
                <div className="relative hidden sm:block">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 w-60"
                  />
                </div>
                
                {/* Notifications */}
                <button className="text-gray-600 hover:text-gray-900 focus:outline-none relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                
                {/* User menu */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-[#0F2C59] flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.fullName || user?.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                  
                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                      onBlur={() => setUserMenuOpen(false)}
                    >
                      <Link 
                        href="/member-dashboard/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link 
                        href="/member-dashboard/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}