// in /member-dashboard/page.tsx or layout
"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserStats } from "@/components/members-dashboard/UserStats";
import Transactions from "@/components/members-dashboard/Transactions";


const Dashboard = () => {
  const router = useRouter();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await axios.get("/api/auth/check-auth", {
  //         withCredentials: true, // IMPORTANT
  //       });
  //       // user is authenticated
  //       console.log(res.data.user);
  //     } catch (err) {
  //       router.push("/login"); // not authenticated
  //     }
  //   };

  //   checkAuth();
  // }, []);

  return (
    <div>
      <div className="lg:p-3">
        <UserStats />
        <Transactions />
      </div>
    </div>
  )
};

export default Dashboard;
