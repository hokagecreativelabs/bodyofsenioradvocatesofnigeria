'use client';
import { FaUserCircle } from "react-icons/fa";

const DashboardHeader = () => (
  <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
    <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
    <FaUserCircle className="text-2xl text-gray-600" />
  </header>
);

export default DashboardHeader;
