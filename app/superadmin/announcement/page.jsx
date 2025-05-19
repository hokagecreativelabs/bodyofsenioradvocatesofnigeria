"use client"

import React, { useState } from 'react';
import { 
  BellRing, 
  Search, 
  PlusCircle, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AnnouncementsPage() {
  // State for filter and sorting
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Sample announcements data
  const announcements = [
    { 
      id: 1, 
      title: "System Maintenance Scheduled", 
      message: "The system will be down for maintenance on Saturday, May 24th from 2:00 AM to 4:00 AM EST.", 
      status: "active", 
      priority: "high", 
      createdBy: "Admin Team",
      date: "May 18, 2025",
      recipients: "All Users"
    },
    { 
      id: 2, 
      title: "New Feature Launch", 
      message: "We're excited to announce the launch of our new messaging feature, available starting next week.", 
      status: "scheduled", 
      priority: "medium", 
      createdBy: "Product Team",
      date: "May 25, 2025",
      recipients: "Premium Users"
    },
    { 
      id: 3, 
      title: "Holiday Schedule", 
      message: "Our offices will be closed on Monday, May 26th for Memorial Day. Normal operations will resume on Tuesday.", 
      status: "active", 
      priority: "medium", 
      createdBy: "HR Department",
      date: "May 17, 2025",
      recipients: "All Users"
    },
    { 
      id: 4, 
      title: "Updated Privacy Policy", 
      message: "Our privacy policy has been updated. Please review the changes at your earliest convenience.", 
      status: "active", 
      priority: "low", 
      createdBy: "Legal Team",
      date: "May 15, 2025",
      recipients: "All Users"
    },
    { 
      id: 5, 
      title: "Upcoming Webinar", 
      message: "Join us for a webinar on advanced platform features on June 1st at 1 PM EST.", 
      status: "scheduled", 
      priority: "medium", 
      createdBy: "Marketing Team",
      date: "Jun 1, 2025",
      recipients: "Free & Premium Users"
    },
    { 
      id: 6, 
      title: "System Update Complete", 
      message: "The system update has been successfully completed. All services are now operating normally.", 
      status: "expired", 
      priority: "high", 
      createdBy: "Tech Support",
      date: "May 10, 2025",
      recipients: "All Users"
    },
  ];

  // Filter announcements based on selected status
  const filteredAnnouncements = announcements.filter(announcement => {
    if (filterStatus === 'all') return true;
    return announcement.status === filterStatus;
  });

  // Sort announcements
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'priority') {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      return sortDirection === 'asc' 
        ? priorityValues[a.priority] - priorityValues[b.priority]
        : priorityValues[b.priority] - priorityValues[a.priority];
    }
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      expired: "bg-gray-100 text-gray-800",
      draft: "bg-yellow-100 text-yellow-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const priorityStyles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-blue-100 text-blue-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BellRing className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-800">Announcements</h1>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Announcement
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search announcements..."
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="appearance-none block w-full px-8 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="expired">Expired</option>
                <option value="draft">Draft</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Announcements Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('title')}
                    >
                      Title
                      {sortField === 'title' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('date')}
                    >
                      Date
                      {sortField === 'date' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('priority')}
                    >
                      Priority
                      {sortField === 'priority' && (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAnnouncements.map((announcement) => (
                  <tr key={announcement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{announcement.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {announcement.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={announcement.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={announcement.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {announcement.recipients}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {announcement.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{' '}
                  <span className="font-medium">6</span> announcements
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}