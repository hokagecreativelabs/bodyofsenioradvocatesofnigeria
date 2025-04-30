// app/member-dashboard/layout.jsx
import AdminLayout from "@/components/layouts/AdminLayout";

export default function MemberDashboardLayout({ children }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}

// app/member-dashboard/page.jsx
"use client";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import { Loader2, Users, Calendar, FileText, Award } from "lucide-react";

export default function MemberDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const hasMounted = useHasMounted();
  
  useEffect(() => {
    if (!isLoading && !user && hasMounted) {
      router.push('/');
    }
  }, [user, isLoading, router, hasMounted]);
  
  if (isLoading || !hasMounted) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.fullName?.split(' ')[0] || 'Member'}</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with BOSAN today.</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Members" 
          value="248" 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Upcoming Events" 
          value="5" 
          icon={Calendar} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Resources" 
          value="124" 
          icon={FileText} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Achievements" 
          value="36" 
          icon={Award} 
          color="bg-amber-500" 
        />
      </div>
      
      {/* Recent activity and upcoming events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem 
              title="New member joined" 
              time="2 hours ago" 
              description="John Doe has joined BOSAN as a new member." 
            />
            <ActivityItem 
              title="Event updated" 
              time="Yesterday" 
              description="Annual Conference 2025 details have been updated." 
            />
            <ActivityItem 
              title="Resource added" 
              time="2 days ago" 
              description="New legal resource added to the library." 
            />
          </div>
        </div>
        
        {/* Upcoming events */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <EventItem 
              title="Monthly Meeting" 
              date="May 15, 2025" 
              location="Virtual Zoom Meeting"
            />
            <EventItem 
              title="Annual Conference" 
              date="June 10-12, 2025" 
              location="Lagos Continental Hotel"
            />
            <EventItem 
              title="Legal Workshop" 
              date="July 5, 2025" 
              location="Nigerian Law School, Abuja"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Statistics Card Component
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ title, time, description }) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
}

// Event Item Component
function EventItem({ title, date, location }) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <h4 className="font-medium text-gray-800">{title}</h4>
      <div className="flex items-center text-sm text-gray-600 mt-1 space-x-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span>{date}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mt-1">
        <div className="w-4 h-4 mr-2 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <span>{location}</span>
      </div>
    </div>
  );
}