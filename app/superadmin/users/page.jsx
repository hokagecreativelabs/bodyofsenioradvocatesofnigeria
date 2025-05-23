"use client"

import React, { useState } from 'react'
import {  
    Layers,
    AlertTriangle,
    Check,
    Users,
    PlusCircle
  } from 'lucide-react';
  import UsersModal from '@/components/admin/UsersModal';

const UserPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
      
        const openModal = () => setIsModalOpen(true);
        const closeModal = () => setIsModalOpen(false);

    const recentTransactions = [
        { id: "TX123456", user: "Emma Wilson", email: "test@email.com", status: "completed", date: "Today, 10:30 AM" },
        { id: "TX123455", user: "James Miller", email: "test@email.com", status: "pending", date: "Today, 9:15 AM" },
        { id: "TX123454", user: "Sophia Lee", email: "test@email.com", status: "completed", date: "Yesterday, 4:30 PM" },
        { id: "TX123453", user: "Marcus Johnson", email: "test@email.com", status: "inactive", date: "Yesterday, 2:45 PM" },
      ];
  return (
    <div>
        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-4">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow">
          <header className="bg-white shadow px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
          </div>
          <button 
          onClick={openModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium cursor-pointer">
            <PlusCircle className="h-4 w-4 mr-2" />
            Onboard User
          </button>
        </div>
        <UsersModal isOpen={isModalOpen} onClose={closeModal} />
      </header>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-xs text-gray-700 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">email</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {transaction.status === 'completed' && <Check size={12} className="mr-1" />}
                          {transaction.status === 'pending' && <Layers size={12} className="mr-1" />}
                          {transaction.status === 'failed' && <AlertTriangle size={12} className="mr-1" />}
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          
        </div>
    </div>
  )
}

export default UserPage