// eventsService.js
const BASE_URL = "/api/events";

/**
 * Fetch all events from the API
 * @returns {Promise<Array>} Array of event objects
 */
export async function getAllEvents() {
  try {
    const res = await fetch(BASE_URL);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch events");
    }
    
    const response = await res.json();
    // Handle the backend response format { success: true, data: events }
    return response.success ? response.data : [];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

/**
 * Fetch a single event by ID
 * @param {string} eventId - The ID of the event to fetch
 * @returns {Promise<Object>} Event object
 */
export async function getEventById(eventId) {
  try {
    if (!eventId) {
      throw new Error("Event ID is required");
    }
    
    const res = await fetch(`${BASE_URL}/${eventId}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch the event");
    }
    
    const response = await res.json();
    return response.success ? response.data : null;
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
}

/**
 * Create a new event
 * @param {Object} eventData - The event data to create
 * @returns {Promise<Object>} Created event object
 */
export async function createEvent(eventData) {
  try {
    if (!eventData) {
      throw new Error("Event data is required");
    }
    
    // Validate the required fields
    const { title, date, time, location, status, description } = eventData;
    if (!title || !date || !time || !location || !status || !description) {
      throw new Error("Title, date, time, location, status, and description are required fields");
    }
    
    // Make sure date is in ISO format
    if (date instanceof Date) {
      eventData.date = date.toISOString();
    }
    
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create the event");
    }
    
    const response = await res.json();
    return response.success ? response.data : null;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

/**
 * Update an existing event
 * @param {string} id - The ID of the event to update
 * @param {Object} eventData - The updated event data
 * @returns {Promise<Object>} Updated event object
 */
export const updateEvent = async (id, eventData) => {
  // Debug logging
  console.log('updateEvent called with:');
  console.log('ID:', id);
  console.log('ID type:', typeof id);
  console.log('Event data:', eventData);
  
  if (!id) {
    throw new Error('Event ID is required for update');
  }
  
  const url = `/api/events/${id}`;
  console.log('Making PUT request to:', url);
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.log('Error response:', errorText);
    throw new Error(`Failed to update event: ${response.statusText}`);
  }
  
  return response.json();
};


/**
 * Delete an event
 * @param {string} eventId - The ID of the event to delete
 * @returns {Promise<Object>} Response data
 */
export async function deleteEvent(eventId) {
  try {
    if (!eventId) {
      throw new Error("Event ID is required");
    }
    
    const res = await fetch(`${BASE_URL}/${eventId}`, {
      method: "DELETE",
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete the event");
    }
    
    const response = await res.json();
    return response.success ? response : null;
  } catch (error) {
    console.error(`Error deleting event ${eventId}:`, error);
    throw error;
  }
}