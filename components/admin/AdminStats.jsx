import React from "react";
import {
  Users,
  BellRing,
  Calendar,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";

const AdminStats = () => {
  const stats = [
    {
      title: "Total Users",
      value: "5,832",
      icon: <Users size={18} />,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Events",
      value: "28",
      icon: <Calendar size={18} />,
      change: "+3%",
      trend: "up",
    },
    {
      title: "New Announcements",
      value: "7",
      icon: <BellRing size={18} />,
      change: "-2%",
      trend: "down",
    },
    {
      title: "Revenue",
      value: "$24,395",
      icon: <CreditCard size={18} />,
      change: "+18%",
      trend: "up",
    },
  ];

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-500">{stat.title}</div>
              <div className="bg-indigo-100 p-2 rounded-lg">{stat.icon}</div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div
                className={`flex items-center text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <Activity size={16} className="mr-1" />
                )}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStats;
