import React from 'react';
import AdminStats from '@/components/admin/AdminStats';
import Activity from '@/components/admin/Activity';
import Transactions from '@/components/admin/Transactions';
import UpcomingEvents from '@/components/admin/UpcomingEvents';

export default function AdminDashboard() {

  

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* Main Content */}
      <main className="flex-1 p-1">
        <AdminStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           <UpcomingEvents />
           <Activity />
        </div>
            <Transactions />
      </main>
    </div>
  );
}