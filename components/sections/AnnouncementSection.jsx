"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Fetch Announcements from the API
const getAllAnnouncements = async () => {
  try {
    const response = await fetch("/api/announcements");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

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

  // Function to get only announcements that should be visible to public users
  const getVisibleAnnouncementsForUsers = (announcements) => {
    const now = new Date();
    
    return announcements.filter(announcement => {
      const announcementDateTime = new Date(announcement.date);
      
      // Skip invalid dates
      if (isNaN(announcementDateTime.getTime())) {
        return false;
      }
      
      // Only show announcements that:
      // 1. The scheduled time has passed (not in the future)
      // 2. Status is active (not scheduled, not expired)
      return announcementDateTime <= now && announcement.status === 'active';
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return '';
    }
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setError(null);
        const response = await getAllAnnouncements();
        console.log('Raw API response:', response);
        
        let allAnnouncements = [];
        
        if (Array.isArray(response)) {
          allAnnouncements = response;
        } else if (response && response.data) {
          allAnnouncements = response.data;
        } else {
          setError('No data received from API');
          return;
        }

        // Update statuses based on current time
        const updatedAnnouncements = allAnnouncements.map(updateAnnouncementStatus);
        console.log('Updated announcements with status:', updatedAnnouncements);
        
        // Filter to only show visible announcements to public
        const visibleAnnouncements = getVisibleAnnouncementsForUsers(updatedAnnouncements);
        console.log('Visible announcements for public:', visibleAnnouncements);
        
        // Sort by date (most recent first)
        const sortedAnnouncements = visibleAnnouncements.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA; // Most recent first
        });
        
        setAnnouncements(sortedAnnouncements);
        
      } catch (error) {
        setError(`Failed to fetch announcements: ${error.message}`);
      }
    };

    fetchAnnouncements();
    
    // Set up interval to check for new announcements every minute
    // This ensures scheduled announcements appear as soon as their time arrives
    const interval = setInterval(() => {
      fetchAnnouncements();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex items-center mb-8"
        >
          <h2 className="text-[#0F2C59] font-playfair font-bold text-3xl">Latest Announcements</h2>
          <div className="ml-4 h-[2px] bg-gray-300 flex-grow"></div>
        </motion.div>

        <div className="space-y-6">
          {error ? (
            <div className="col-span-full text-center text-red-600">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <svg className="w-5 h-5 text-red-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : announcements.length === 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center py-12"
            >
              <div className="bg-gray-50 rounded-2xl p-8">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No announcements at this time</h3>
                <p className="text-gray-500">Check back later for updates and news.</p>
              </div>
            </motion.div>
          ) : (
            announcements.map((announcement, index) => (
              <motion.div
                key={announcement._id || announcement.id}
                className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-[#D4AF37] hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-4">
                  <div className="bg-[#0F2C59]/10 rounded-full p-3 h-fit">
                    <svg
                      className="w-5 h-5 text-[#0F2C59]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-montserrat font-semibold text-[#0F2C59] text-lg">
                        {announcement.title}
                      </h3>
                      {announcement.date && (
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full whitespace-nowrap ml-4">
                          {formatDate(announcement.date)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[#343A40]/80 leading-relaxed text-sm mb-4">
                      {announcement.content || announcement.description}
                    </p>
                    
                    {/* Optional: Show active status indicator for reassurance */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/announcements/${announcement._id || announcement.id}`}
                        className="text-[#750E21] font-medium text-sm inline-flex items-center hover:text-opacity-80 transition-colors"
                      >
                        Learn More
                        <svg
                          className="w-3 h-3 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                      
                      {/* Live indicator (optional - can be removed if not desired) */}
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                        <span className="text-xs text-green-600 font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}