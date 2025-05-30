"use client"

import React, { useEffect, useState } from 'react';
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
  ChevronRight,
  Loader,
  AlertCircle,
  Calendar
} from 'lucide-react';
import AnnouncementModal from '@/components/admin/AnnouncementModal';
import { getAllAnnouncements, deleteAnnouncement } from "@/app/api/services/announcementService";

export default function AnnouncementsPage() {
  // State for filter and sorting
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyVisible, setShowOnlyVisible] = useState(false);

  // Modal states - Using single modal for both create and edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Data states
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Open modal for creating new announcement
  const openCreateModal = () => {
    setSelectedAnnouncement(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  
  // Open modal for editing existing announcement 
  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
    setIsEditMode(false);
  };

  // Function to check if announcement should be visible to users
  const isAnnouncementVisible = (announcement) => {
    const now = new Date();
    const announcementDateTime = new Date(announcement.date);
    
    // Check if the date is valid
    if (isNaN(announcementDateTime.getTime())) {
      return false;
    }
    
    // Only show announcements that:
    // 1. Have reached their scheduled date/time (not in the future)
    // 2. Are not expired or cancelled
    // 3. Have active status
    return announcementDateTime <= now && 
           announcement.status === 'active' &&
           announcement.status !== 'expired';
  };

  // Function to update announcement status based on current time
  const updateAnnouncementStatus = (announcement) => {
    const now = new Date();
    const announcementDateTime = new Date(announcement.date);
    
    // Return original if invalid date
    if (isNaN(announcementDateTime.getTime())) {
      return { ...announcement, status: 'expired' };
    }
    
    // Don't change manually set expired status
    if (announcement.status === 'expired') {
      return announcement;
    }
    
    const timeDifference = announcementDateTime.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    
    let newStatus = announcement.status;
    
    // Update status based on time:
    // - scheduled: Future announcements (more than current time)
    // - active: Current announcements (past scheduled time but not expired)  
    // - expired: Old announcements (configurable expiry time - default 7 days)
    
    if (timeDifference > 0) {
      // Future announcement
      newStatus = 'scheduled';
    } else if (hoursDifference >= -168) { // Within 7 days past (168 hours = 7 days)
      // Past scheduled time but within expiry window
      newStatus = 'active';
    } else {
      // Beyond expiry window
      newStatus = 'expired';
    }
    
    return { ...announcement, status: newStatus };
  };

  // Function to get announcements that should be displayed to end users
  const getVisibleAnnouncementsForUsers = (announcements) => {
    const now = new Date();
    
    return announcements.filter(announcement => {
      const announcementDateTime = new Date(announcement.date);
      
      // Skip invalid dates
      if (isNaN(announcementDateTime.getTime())) {
        return false;
      }
      
      // Only show if:
      // 1. The scheduled time has passed
      // 2. Status is active (not scheduled, not expired)
      return announcementDateTime <= now && announcement.status === 'active';
    });
  };
   
  // Fetch Announcements from the API
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllAnnouncements(); 
      console.log(response)
      if (Array.isArray(response)) {
        // Update statuses based on current time
        const updatedAnnouncements = response.map(updateAnnouncementStatus);
        setAnnouncements(updatedAnnouncements);
      } else if (response && response.data) {
        const updatedAnnouncements = response.data.map(updateAnnouncementStatus);
        setAnnouncements(updatedAnnouncements);
      } else {
        setError("No data received from API");
      }
    } catch (err) {
      setError(`Failed to fetch Announcements: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Callback function to handle announcement creation 
  const handleAnnouncementCreated = async () => {
    try {
      // Close the modal first
      closeModal();
      
      // Refetch all announcements from the server
      await fetchAnnouncements();
      
    } catch (err) {
      setError(`Failed to refresh announcements: ${err.message}`);
    }
  };

  // Separate callback for announcement updates 
  const handleAnnouncementUpdated = async () => {
    try {
      // Close the modal first
      closeModal();
      
      // Refetch all announcements from the server
      await fetchAnnouncements();
      
    } catch (err) {
      setError(`Failed to refresh announcements: ${err.message}`);
    }
  };

  // Fetch announcements when the component mounts
  useEffect(() => {
    fetchAnnouncements();
    
    // Set up interval to update statuses every minute
    const interval = setInterval(() => {
      setAnnouncements(prev => prev.map(updateAnnouncementStatus));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Delete announcement handler with better error handling
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncement(id);
        
        // Refetch Announcements after successful deletion
        await fetchAnnouncements();

      } catch (err) {
        setError("Failed to delete announcement. Please try again later.");
      }
    }
  };

  // Filter announcements based on selected status, search term, and visibility
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (announcement.description && announcement.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply visibility filter if showOnlyVisible is true
    // This shows only announcements that would be visible to end users
    const matchesVisibility = !showOnlyVisible || isAnnouncementVisible(announcement);
    
    return matchesStatus && matchesSearch && matchesVisibility;
  });

  // Sort announcements
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortField === 'title') {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return sortDirection === 'asc' 
        ? titleA.localeCompare(titleB) 
        : titleB.localeCompare(titleA);
    }
    if (sortField === 'status') {
      return sortDirection === 'asc' 
        ? a.status.localeCompare(b.status) 
        : b.status.localeCompare(a.status);
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

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Enhanced Status badge component with visibility indicator
  const StatusBadge = ({ status, announcement }) => {
    const now = new Date();
    const announcementDateTime = new Date(announcement.date);
    const isValidDate = !isNaN(announcementDateTime.getTime());
    
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      expired: "bg-gray-100 text-gray-800",
    };
    
    // More precise visibility check
    const isVisible = isValidDate && 
                     announcementDateTime <= now && 
                     status === 'active';
    
    // Calculate time until activation for scheduled announcements
    const getTimeUntilActive = () => {
      if (status !== 'scheduled' || !isValidDate) return '';
      
      const timeDiff = announcementDateTime.getTime() - now.getTime();
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    };
    
    const timeUntilActive = getTimeUntilActive();
    
    return (
      <div className="flex flex-col items-start gap-1">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <div className="flex flex-col gap-0.5">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isVisible ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
          }`}>
            {isVisible ? 'Live' : 'Hidden'}
          </span>
          {status === 'scheduled' && timeUntilActive && (
            <span className="text-xs text-gray-500 px-2">
              in {timeUntilActive}
            </span>
          )}
        </div>
      </div>
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
          <button 
            onClick={openCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium cursor-pointer">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Announcement
          </button>
        </div>
        <AnnouncementModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onAnnouncementCreated={handleAnnouncementCreated}
          onAnnouncementUpdated={handleAnnouncementUpdated}
          announcementToEdit={selectedAnnouncement} 
        />
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Visibility Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyVisible}
                  onChange={(e) => setShowOnlyVisible(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 rounded-full transition-colors ${
                  showOnlyVisible ? 'bg-indigo-600' : 'bg-gray-200'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    showOnlyVisible ? 'translate-x-5' : 'translate-x-0'
                  }`}></div>
                </div>
                <span className="ml-2 text-sm text-gray-700">Show only live</span>
              </label>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Announcement Display Rules:</p>
              <ul className="mt-1 space-y-1 text-blue-700">
                <li>• <strong>Scheduled:</strong> Will go live when the set date/time is reached</li>
                <li>• <strong>Active:</strong> Currently visible to users (past scheduled time)</li>
                <li>• <strong>Expired:</strong> No longer visible (7+ days past scheduled time)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading Announcements...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* No Announcements State */}
        {!loading && !error && sortedAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <BellRing className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-500">
              {filterStatus === 'all' && searchTerm === '' 
                ? 'Get started by creating your first announcement.' 
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        )}

        {/* Announcements Table */}
        {!loading && !error && sortedAnnouncements.length > 0 && (
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
                        Scheduled Date
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
                        Status & Visibility
                        {sortField === 'status' && (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAnnouncements.map((announcement) => (
                    <tr key={announcement._id || announcement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{announcement.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(announcement.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={announcement.status} announcement={announcement} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => openEditModal(announcement)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(announcement._id || announcement.id)}
                            className="text-red-600 hover:text-red-900">
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
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedAnnouncements.length}</span> of{' '}
                    <span className="font-medium">{sortedAnnouncements.length}</span> announcements
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
        )}
      </main>
    </div>
  );
}