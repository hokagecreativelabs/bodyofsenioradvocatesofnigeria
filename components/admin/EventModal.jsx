import { useState } from 'react';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { createEvent } from "@/app/api/services/eventsService";

const EventModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'upcoming',
    date: '',
    time: '',
    location: '',
    description: '',
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const { title, date, time, location, status, description } = formData;
    if (!title || !date || !time || !location || !status || !description) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Ensure the date is valid before creating a Date object
      if (!isValidDateTimeFormat(date, time)) {
        throw new Error("Invalid date or time format");
      }

      // Combine date and time into a single ISO string
      const eventDateTime = new Date(`${date}T${time}`);
      
      if (isNaN(eventDateTime.getTime())) {
        throw new Error("Invalid date/time combination");
      }

      // Submit the event data
      const response = await createEvent({
        ...formData,
        date: eventDateTime.toISOString(), // Ensure we're sending ISO string format
      });

      setMessage("Event created successfully!");
      setFormData({
        title: '',
        status: 'upcoming',
        date: '',
        time: '',
        location: '',
        description: '',
      });
      
      // Optional: Call a function to refresh events list if needed
      // refreshEvents();
      
    } catch (error) {
      console.error("Event creation error:", error);
      setMessage(`Error: ${error.message || "Failed to create the event"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate date and time format
  const isValidDateTimeFormat = (date, time) => {
    return date && time && date.match(/^\d{4}-\d{2}-\d{2}$/) && time.match(/^\d{2}:\d{2}$/);
  };

  if (!isOpen) return null;

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'complete':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {message && (
            <div className={`mt-2 p-2 rounded-md text-center text-sm ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {message}
            </div>
          )}

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
            <div className="flex items-center justify-between pb-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    formData.status
                  )}`}
                >
                  {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                </span>
              </div>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="complete">Complete</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1 text-gray-500" />
                    <span>Date</span>
                  </div>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1 text-gray-500" />
                    <span>Time</span>
                  </div>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1 text-gray-500" />
                  <span>Location</span>
                </div>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter location"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Event description"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white font-bold text-sm ${isLoading ? 'bg-gray-400' : 'bg-[#0F2C59] hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default EventModal;