'use client';
import { useEffect, useState } from "react";
import AdminHeader from "@/components/layout/dashboard/DashoardHeader";
import withAuth from "@/lib/withAuth";

const DashboardPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  return (
    <div>
      <AdminHeader title="Dashboard" user={user} />
      <div className="p-4">
        <h2 className="text-2xl font-bold">Dashboard Content</h2>
        {/* Your other dashboard content */}
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
