import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, X, Upload, Image as ImageIcon } from 'lucide-react';
import { createEvent, updateEvent } from "@/app/api/services/eventsService";

// Add onEventCreated prop to refresh the parent component
const EventModal = ({ isOpen, onClose, onEventCreated, onEventUpdated, eventToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'upcoming',
    date: '',
    time: '',
    image: '',
    location: '',
    description: '',
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState(null)

  useEffect(() => {
    if (eventToEdit) {
      // Editing mode - populate form with existing data
      const { title, status, date, location, description, image } = eventToEdit;
      const [eventDate, eventTime] = date.split("T");
      setFormData({
        title,
        status,
        date: eventDate,
        time: eventTime.slice(0, 5), // Trim seconds
        image,
        location,
        description,
      });
      if (image) {
        setImagePreview(image);
        setExistingImageUrl(image)
        setSelectedImage(null)
      } else {
        setImagePreview(null)
        setExistingImageUrl(null)
        setSelectedImage(null)
      }
    } else {
      // Create mode - reset form to default values
      setFormData({
        title: '',
        status: 'upcoming',
        date: '',
        time: '',
        location: '',
        description: '',
      });
      setImagePreview(null);
      setSelectedImage(null);
      setMessage("");
    }
  }, [eventToEdit]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage("Please select a valid image file.");
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should be less than 5MB.");
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Clear any previous error messages
      setMessage("");
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;

    setUploadingImage(true);
    const imageFormData = new FormData();
    imageFormData.append("file", selectedImage);

    try {
      console.log("Starting image upload...");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: imageFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Image upload successful:", data.url);
      return data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, date, time, location, status, description } = formData;

    if (!title || !date || !time || !location || !status || !description) {
      setMessage("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      if (!isValidDateTimeFormat(date, time)) {
        throw new Error("Invalid date or time format.");
      }

      const eventDateTime = new Date(`${date}T${time}`);
      if (isNaN(eventDateTime.getTime())) {
        throw new Error("Invalid date/time combination.");
      }

      // Upload image first if selected
      let imageUrl = existingImageUrl;
      if (selectedImage) {
        console.log("Uploading image...");
        imageUrl = await uploadImage();
        console.log("Image uploaded, URL:", imageUrl);
      }

      // Create event with image URL
      const eventData = {
        ...formData,
        date: eventDateTime.toISOString(),
        image: imageUrl,
      };

      if (eventToEdit) {
        const updatedEvent = await updateEvent(eventToEdit._id, eventData);
        onEventUpdated && onEventUpdated(updatedEvent);
        setMessage("Event updated successfully!");
      } else {
        const createdEvent = await createEvent(eventData);
        onEventCreated && onEventCreated(createdEvent);
        setMessage("Event created successfully!");
      }
      
      // Reset form only for create mode
      if (!eventToEdit) {
        setFormData({
          title: '',
          status: 'upcoming',
          date: '',
          time: '',
          location: '',
          description: '',
        });
        setSelectedImage(null);
        setImagePreview(null);
      }
      
     
      
      // Close modal after success
      setTimeout(() => {
        onClose();
        setMessage(""); // Clear message when closing
      }, 1500);
      
    } catch (error) {
      console.error("Event creation error:", error);
      setMessage(`Error: ${error.message || "Failed to create the event."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidDateTimeFormat = (date, time) => {
    return date.match(/^\d{4}-\d{2}-\d{2}$/) && time.match(/^\d{2}:\d{2}$/);
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      complete: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExistingImageUrl(null)
    // Reset the file input
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">{eventToEdit ? "Update Event" : "Create New Event"}</h2>
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
              label="Event Title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />

            <SelectField
              id="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'active', label: 'Active' },
                { value: 'complete', label: 'Complete' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              statusColor={getStatusColor(formData.status)}
            />

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

            {/* Enhanced Image Upload Section */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <ImageIcon size={16} className="mr-1" />
                  Upload Image (Optional)
                </div>
              </label>
              
              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col items-center justify-center text-gray-500 hover:text-gray-600 transition-colors"
                  >
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm">Click to upload image</span>
                    <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <p className="text-xs text-gray-500 mt-1">{selectedImage?.name}</p>
                </div>
              )}
            </div>

            <InputField
              id="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              required
              icon={<MapPin size={16} />}
            />

            <TextareaField
              id="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Event description"
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
    isLoading || uploadingImage
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-[#0F2C59] hover:bg-blue-700'
  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
  disabled={isLoading || uploadingImage}
>
  {(() => {
    if (uploadingImage) {
      return (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Uploading...
        </>
      );
    }
    if (isLoading) {
      return (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Creating...
        </>
      );
    }
    return eventToEdit ? 'Update Event' : 'Create Event';
  })()}
</button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Component definitions remain the same
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

const SelectField = ({ id, label, value, onChange, options, statusColor }) => (
  <div>
    <div className="flex items-center justify-between pb-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    </div>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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

export default EventModal;