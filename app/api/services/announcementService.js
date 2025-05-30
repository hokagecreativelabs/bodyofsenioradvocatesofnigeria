// announcementService.js
const BASE_URL = "/api/announcements";

/**
 * Fetch all announcements from the API
 * @returns {Promise<Array>} Array of announcement objects
 */
export async function getAllAnnouncements() {
  try {
    const res = await fetch(BASE_URL);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch announcements");
    }
    
    const response = await res.json();
    // Handle the backend response format { success: true, data: announcements }
    return response.success ? response.data : [];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

/**
 * Fetch a single announcement by ID
 * @param {string} announcementId - The ID of the announcement to fetch
 * @returns {Promise<Object>} announcement object
 */
export async function getAnnouncementById(announcementId) {
  try {
    if (!announcementId) {
      throw new Error("Announcement ID is required");
    }
    
    const res = await fetch(`${BASE_URL}/${announcementId}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch the announcement");
    }
    
    const response = await res.json();
    return response.success ? response.data : null;
  } catch (error) {
    console.error(`Error fetching announcement ${announcementId}:`, error);
    throw error;
  }
}

/**
 * Create a new announcement
 * @param {Object} announcementData - The announcement data to create
 * @returns {Promise<Object>} Created announcement object
 */
export async function createAnnouncement(announcementData) {
  try {
    if (!announcementData) {
      throw new Error("Event data is required");
    }
    
    // Validate the required fields
    const { title, date, time, status, description } = announcementData;
    if (!title || !date || !time || !status || !description) {
      throw new Error("Title, date, time, status, and description are required fields");
    }
    
    // Make sure date is in ISO format
    if (date instanceof Date) {
        announcementData.date = date.toISOString();
    }
    
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(announcementData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create the announcement");
    }
    
    const response = await res.json();
    return response.success ? response.data : null;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
}

/**
 * Update an existing announcement
 * @param {string} id - The ID of the announcement to update
 * @param {Object} announcementData - The updated announcement data
 * @returns {Promise<Object>} Updated announcement object
 */
export const updateAnnouncement = async (id, announcementData) => {
  // Debug logging
  console.log('updateAnnouncement called with:');
  console.log('ID:', id);
  console.log('ID type:', typeof id);
  console.log('Announcement data:', announcementData);
  
  if (!id) {
    throw new Error('Announcement ID is required for update');
  }
  
  const url = `${BASE_URL}/${id}`;
  console.log('Making PUT request to:', url);
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(announcementData),
  });
  
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.log('Error response:', errorText);
    throw new Error(`Failed to update announcement: ${response.statusText}`);
  }
  
  return response.json();
};


/**
 * Delete an announcement
 * @param {string} announcementId - The ID of the announcement to delete
 * @returns {Promise<Object>} Response data
 */
export async function deleteAnnouncement(announcementId) {
  try {
    if (!announcementId) {
      throw new Error("announcement ID is required");
    }
    
    const res = await fetch(`${BASE_URL}/${announcementId}`, {
      method: "DELETE",
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete the announcement");
    }
    
    const response = await res.json();
    return response.success ? response : null;
  } catch (error) {
    console.error(`Error deleting announcement ${announcementId}:`, error);
    throw error;
  }
}