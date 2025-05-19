'use client';
import { FaUserCircle, FaBars, FaBell } from "react-icons/fa";
import { getInitials } from "@/utils/getInitials";

const AdminHeader = ({ onMenuToggle, title = "Dashboard", user }) => {
  const fullName = user?.fullName || "Admin";
  const initials = getInitials(fullName);

  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button
          id="hamburger-button"
          onClick={onMenuToggle}
          className="p-1 mr-3 rounded-md text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-1 rounded-full hover:bg-gray-100 relative">
          <FaBell className="text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="hidden md:block text-sm text-gray-600">
          Welcome, {fullName}
        </div>

        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
