import { useEffect, useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { createAnnouncement, updateAnnouncement } from "@/app/api/services/announcementService";

// Add onAnnouncementCreated prop to refresh the parent component
const AnnouncementModal = ({ isOpen, onClose, onAnnouncementCreated, onAnnouncementUpdated, announcementToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'scheduled',
    date: '',
    time: '',
    description: '',
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to automatically determine status based on date and time
  const getAutoStatus = (date, time) => {
    if (!date || !time) return 'scheduled';
    
    const now = new Date();
    const announcementDateTime = new Date(`${date}T${time}`);
    
    if (isNaN(announcementDateTime.getTime())) return 'scheduled';
    
    const timeDifference = announcementDateTime.getTime() - now.getTime();
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    
    // If event is more than 1 day in the future
    if (daysDifference > 1) {
      return 'scheduled';
    }
    // If event is within 24 hours (future) or currently happening (within 1 hour past)
    else if (daysDifference > -0.041667) { // -0.041667 days = -1 hour
      return 'active';
    }
    // If event has passed by more than 1 hour
    else {
      return 'expired';
    }
  };

  useEffect(() => {
    if (announcementToEdit) {
      // Editing mode - populate form with existing data
      const { title, status, date, description } = announcementToEdit;
      const [announcementDate, announcementTime] = date.split("T");
      
      // Auto-update status based on current date/time when editing
      const autoStatus = getAutoStatus(announcementDate, announcementTime.slice(0, 5));
      
      setFormData({
        title,
        status: autoStatus, // Use auto-calculated status instead of stored status
        date: announcementDate,
        time: announcementTime.slice(0, 5), // Trim seconds
        description,
      });
    } else {
      // Create mode - reset form to default values
      setFormData({
        title: '',
        status: 'scheduled',
        date: '',
        time: '',
        description: '',
      });
    }

    setMessage("");
  }, [announcementToEdit]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      
      // Auto-update status when date or time changes
      if (name === 'date' || name === 'time') {
        const date = name === 'date' ? value : prevData.date;
        const time = name === 'time' ? value : prevData.time;
        newData.status = getAutoStatus(date, time);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, date, time, status, description } = formData;

    if (!title || !date || !time || !status || !description) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      if (!isValidDateTimeFormat(date, time)) {
        throw new Error("Invalid date or time format.");
      }

      const announcementDateTime = new Date(`${date}T${time}`);
      if (isNaN(announcementDateTime.getTime())) {
        throw new Error("Invalid date/time combination.");
      }

      // Create announcement with auto-calculated status
      const announcementData = {
        ...formData,
        date: announcementDateTime.toISOString(),
        status: getAutoStatus(date, time), 
      };

      if (announcementToEdit) {
        const updatedAnnouncement = await updateAnnouncement(announcementToEdit._id, announcementData);
        onAnnouncementUpdated && onAnnouncementUpdated(updatedAnnouncement);
        setMessage("Announcement updated successfully!");
      } else {
        const createdAnnouncement = await createAnnouncement(announcementData);
        onAnnouncementCreated && onAnnouncementCreated(createdAnnouncement);
        setMessage("Announcement created successfully!");
      }
      
      // Reset form only for create mode
      if (!announcementToEdit) {
        setFormData({
          title: '',
          status: 'scheduled',
          date: '',
          time: '',
          description: '',
        });
      }
      
      // Close modal after success
      setTimeout(() => {
        onClose();
        setMessage(""); // Clear message when closing
      }, 1500);
      
    } catch (error) {
      console.error("Announcement creation error:", error);
      setMessage(`Error: ${error.message || "Failed to create the announcement."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidDateTimeFormat = (date, time) => {
    return date.match(/^\d{4}-\d{2}-\d{2}$/) && time.match(/^\d{2}:\d{2}$/);
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      expired: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      scheduled: 'Announcement is scheduled for the future',
      active: 'Announcement is happening soon or currently active',
      expired: 'Announcement has already concluded',
    };
    return descriptions[status] || '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">{announcementToEdit ? "Update Announcement" : "Create New Announcement"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-md text-center text-sm ${
            message.includes("Error") || message.includes("Please") 
              ? "bg-red-50 text-red-700 border border-red-200" 
              : "bg-green-50 text-green-700 border border-green-200"
          }`}>
            {message}
          </div>
        )}

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="title"
              label="Announcement Title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter announcement title"
              required
            />

            {/* Enhanced Status Display - Read-only with explanation */}
            <div>
              <div className="flex items-center justify-between pb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status (Auto-updated)
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(formData.status)}`}>
                  {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                </span>
              </div>
              <div className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-600">
                {getStatusDescription(formData.status)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Status updates automatically based on the selected date and time
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DateTimeField
                id="date"
                label="Date"
                icon={<Calendar size={16} />}
                value={formData.date}
                onChange={handleChange}
                required
              />
              <DateTimeField
                id="time"
                label="Time"
                icon={<Clock size={16} />}
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <TextareaField
              id="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Announcement description"
            />

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white font-medium text-sm flex items-center gap-2 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#0F2C59] hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {announcementToEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  announcementToEdit ? 'Update Announcement' : 'Create Announcement'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Component definitions
const InputField = ({ id, label, value, onChange, placeholder, required, icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      <div className="flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </div>
    </label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const TextareaField = ({ id, label, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      rows={3}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
      placeholder={placeholder}
    />
  </div>
);

const DateTimeField = ({ id, label, value, onChange, required, icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      <div className="flex items-center">
        {icon}
        <span className="ml-1">{label}</span>
      </div>
    </label>
    <input
      type={id === 'date' ? 'date' : 'time'}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      required={required}
    />
  </div>
);

export default AnnouncementModal;