import React from 'react'
import { 
    Users, 
    BellRing, 
    Calendar, 
    CreditCard,  
    Activity, 
  } from 'lucide-react';

const Activities = () => {
  return (
    <div>
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow h-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium">Recent Activity</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm">New user registered: <span className="font-medium">Alex Thompson</span></p>
                    <p className="text-xs text-gray-500">20 minutes ago</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <CreditCard size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">New transaction: <span className="font-medium">$249.99</span></p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Calendar size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm">New event created: <span className="font-medium">Marketing Conference</span></p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <BellRing size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm">New announcement: <span className="font-medium">System Update</span></p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </li>
              </ul>
              <button className="w-full mt-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50">
                View All Activity
              </button>
            </div>
          </div>
    </div>
  )
}

export default Activities