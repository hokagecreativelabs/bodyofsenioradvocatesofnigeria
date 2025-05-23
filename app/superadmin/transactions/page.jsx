import React from 'react'
import {  
    Layers,
    AlertTriangle,
    Check
  } from 'lucide-react';

const Transactions = () => {
    const recentTransactions = [
        { id: "TX123456", user: "Emma Wilson", amount: "$120.50", status: "completed", date: "Today, 10:30 AM" },
        { id: "TX123455", user: "James Miller", amount: "$75.00", status: "pending", date: "Today, 9:15 AM" },
        { id: "TX123454", user: "Sophia Lee", amount: "$249.99", status: "completed", date: "Yesterday, 4:30 PM" },
        { id: "TX123453", user: "Marcus Johnson", amount: "$32.50", status: "failed", date: "Yesterday, 2:45 PM" },
      ];
  return (
    <div>
        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-4">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Transactions</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-xs text-gray-700 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{transaction.amount}</td>
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

export default Transactions