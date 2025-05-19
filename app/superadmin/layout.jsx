'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/admin/DashboardSidebar';
import AdminHeader from '@/components/layout/admin/DashoardHeader';

const DashboardLayout = ({ children, title = "Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const hamburger = document.getElementById('hamburger-button');
      
      if (sidebarOpen && 
          sidebar && 
          hamburger && 
          !sidebar.contains(event.target) && 
          !hamburger.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scrolling when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <AdminSidebar 
        isMobile={true} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Desktop Sidebar */}
      <AdminSidebar isMobile={false} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Hamburger Menu */}
        <AdminHeader 
          title={title} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Optional Footer */}
        <footer className="bg-white border-t py-3 px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Your Company • All Rights Reserved
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;