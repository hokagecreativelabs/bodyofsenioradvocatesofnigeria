// app/member-dashboard/layout.tsx
import DashboardHeader from "../../components/layout/dashboard/DashoardHeader";
import DashboardSidebar from "../../components/layout/dashboard/DashboardSidebar";
import "@/app/globals.css";

export const metadata = {
  title: "Member Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
