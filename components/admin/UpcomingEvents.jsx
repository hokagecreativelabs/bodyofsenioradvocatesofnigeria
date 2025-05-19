import React from 'react'

const UpcomingEvents = () => {
    const upcomingEvents = [
        { name: "Marketing Conference", date: "May 21, 2025", attendees: 120 },
        { name: "Product Launch", date: "May 25, 2025", attendees: 85 },
        { name: "Team Training", date: "May 30, 2025", attendees: 24 },
      ];
  return (
    <div>
        <div className="grid grid-rows-1 gap-4">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow h-full">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Upcoming Events</h2>
                  <button className="text-sm text-indigo-600">View All</button>
                </div>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-100">
                  {upcomingEvents.map((event, index) => (
                    <li key={index} className="py-3 flex justify-between">
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-sm text-gray-500">{event.date}</p>
                      </div>
                      <div className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full self-center">
                        {event.attendees} attendees
                      </div>
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50">
                View All Activity
              </button>
              </div>
            </div>
          </div>
    </div>
  )
}

export default UpcomingEvents