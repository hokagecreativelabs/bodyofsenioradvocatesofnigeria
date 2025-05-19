"use client"

import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  PlusCircle, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2,
  Users,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function EventsPage() {
  // State for filter and sorting
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Sample events data
  const events = [
    { 
      id: 1, 
      title: "Marketing Conference", 
      description: "Annual marketing conference with industry leaders and networking opportunities", 
      date: "May 21, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Grand Hotel Conference Center",
      capacity: 200,
      attendees: 120,
      type: "conference",
      status: "upcoming",
      organizer: "Marketing Team"
    },
    { 
      id: 2, 
      title: "Product Launch", 
      description: "Official launch event for our new product line with demos and Q&A", 
      date: "May 25, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Main Office Auditorium",
      capacity: 100,
      attendees: 85,
      type: "launch",
      status: "upcoming",
      organizer: "Product Team"
    },
    { 
      id: 3, 
      title: "Team Training", 
      description: "Skill development workshop for the development team", 
      date: "May 30, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Training Room B",
      capacity: 30,
      attendees: 24,
      type: "training",
      status: "upcoming",
      organizer: "HR Department"
    },
    { 
      id: 4, 
      title: "Quarterly Review", 
      description: "Q2 performance review and planning session", 
      date: "June 5, 2025",
      time: "1:00 PM - 4:00 PM",
      location: "Executive Boardroom",
      capacity: 15,
      attendees: 12,
      type: "meeting",
      status: "upcoming",
      organizer: "Executive Team"
    },
    { 
      id: 5, 
      title: "Customer Appreciation Day", 
      description: "Annual event to thank customers with special deals and entertainment", 
      date: "June 15, 2025",
      time: "11:00 AM - 7:00 PM",
      location: "City Park Pavilion",
      capacity: 500,
      attendees: 320,
      type: "social",
      status: "upcoming",
      organizer: "Customer Success Team"
    },
    { 
      id: 6, 
      title: "Spring Hackathon", 
      description: "24-hour coding challenge for innovative solutions", 
      date: "May 10, 2025",
      time: "9:00 AM - 9:00 AM (Next Day)",
      location: "Innovation Lab",
      capacity: 50,
      attendees: 42,
      type: "competition",
      status: "completed",
      organizer: "Engineering Team"
    },
  ];
  
  // Filter events based on selected status
  const filteredEvents = events.filter(event => {
    if (filterStatus === 'all') return true;
    return event.status === filterStatus;
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else if (sortField === 'attendees') {
      return sortDirection === 'asc' 
        ? a.attendees - b.attendees 
        : b.attendees - a.attendees;
    }
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Event type badge component
  const EventTypeBadge = ({ type }) => {
    const typeStyles = {
      conference: "bg-purple-100 text-purple-800",
      launch: "bg-blue-100 text-blue-800",
      training: "bg-green-100 text-green-800",
      meeting: "bg-yellow-100 text-yellow-800",
      social: "bg-pink-100 text-pink-800",
      competition: "bg-orange-100 text-orange-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeStyles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      upcoming: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Calculate capacity percentage for progress bars
  const getCapacityPercentage = (attendees, capacity) => {
    return Math.round((attendees / capacity) * 100);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-800">Events</h1>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Event
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
              placeholder="Search events..."
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="appearance-none block w-full px-6 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex rounded-md shadow-sm">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium border border-gray-300 
                  ${viewMode === 'list' 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-white text-gray-500 hover:bg-gray-50'} 
                  rounded-l-md`}
              >
                List
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 text-sm font-medium border border-gray-300 
                  ${viewMode === 'grid' 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-white text-gray-500 hover:bg-gray-50'} 
                  rounded-r-md border-l-0`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Events View */}
        {viewMode === 'list' ? (
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
                        Event
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
                        Date & Time
                        {sortField === 'date' && (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button 
                        className="flex items-center" 
                        onClick={() => handleSort('attendees')}
                      >
                        Attendees
                        {sortField === 'attendees' && (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                            {event.date}
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {event.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center mb-1 text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          {event.attendees}/{event.capacity}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${getCapacityPercentage(event.attendees, event.capacity)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <EventTypeBadge type={event.type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={event.status} />
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
                    <span className="font-medium">6</span> events
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
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <StatusBadge status={event.status} />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{event.description}</p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      {event.attendees} of {event.capacity} attendees
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${getCapacityPercentage(event.attendees, event.capacity)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <EventTypeBadge type={event.type} />
                    <div className="flex items-center space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}