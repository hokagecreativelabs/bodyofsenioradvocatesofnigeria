'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";

const links = [
  { label: "Overview", href: "/member-dashboard", icon: <FaTachometerAlt /> },
  // Add more links here
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 hidden md:flex flex-col bg-white border-r shadow-sm">
      <div className="h-16 flex items-center justify-center border-b font-bold text-lg">
        Member Area
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center px-3 py-2 rounded-md font-medium transition ${
              pathname === link.href
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="mr-3">{link.icon}</span> {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={() => {
            localStorage.removeItem('user'); // clear session
            location.href = '/login';
          }}
          className="flex items-center text-sm text-red-600 hover:underline"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
