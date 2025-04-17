"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const events = [
  {
    title: "2025 BOSAN Annual Dinner",
    date: "2025-05-25",
    location: "Eko Hotel & Suites, Lagos",
    img: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80",
    desc: "An elegant evening celebrating legal excellence, legacy, and community.",
  },
  {
    title: "Legal Excellence Summit",
    date: "2025-06-15",
    location: "Transcorp Hilton, Abuja",
    img: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80",
    desc: "Top legal minds gather to discuss transformative reforms and justice trends.",
  },
  {
    title: "Mentorship Breakfast Forum",
    date: "2024-03-08",
    location: "Oriental Hotel, VI",
    img: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=800&q=80",
    desc: "A vibrant morning of mentorship and intergenerational dialogue in the legal field.",
  },
  {
    title: "2023 Year-End Legal Gala",
    date: "2023-12-15",
    location: "Federal Palace Hotel",
    img: "https://images.unsplash.com/photo-1602526216077-d94f10882f89?auto=format&fit=crop&w=800&q=80",
    desc: "Closing out the year in grand style with BOSAN’s finest.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return { day, month };
};

const today = new Date();

export default function EventsPage() {
  const [tab, setTab] = useState("upcoming");
  const [yearFilter, setYearFilter] = useState("all");

  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const isPast = eventDate < today;
      if (tab === "upcoming" && isPast) return false;
      if (tab === "past" && !isPast) return false;
      if (tab === "past" && yearFilter !== "all") {
        return eventDate.getFullYear().toString() === yearFilter;
      }
      return true;
    })
    .sort((a, b) =>
      new Date(a.date) - new Date(b.date) * (tab === "past" ? -1 : 1)
    );

  const uniqueYears = Array.from(
    new Set(events.map((e) => new Date(e.date).getFullYear()))
  ).sort((a, b) => b - a);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-4xl font-bold text-center text-[#0F2C59] mb-2 font-playfair">
          BOSAN Events
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Explore our upcoming engagements and celebrate the highlights of past milestones.
        </p>

        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                tab === "upcoming"
                  ? "bg-[#D4AF37] text-white"
                  : "bg-gray-200 text-[#0F2C59]"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setTab("past")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                tab === "past"
                  ? "bg-[#D4AF37] text-white"
                  : "bg-gray-200 text-[#0F2C59]"
              }`}
            >
              Past
            </button>
          </div>

          {tab === "past" && (
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => {
            const { day, month } = formatDate(event.date);
            return (
              <motion.div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-4 left-4 bg-white shadow-md rounded-md text-center w-12">
                    <div className="bg-[#D4AF37] text-white text-xs font-bold py-1 rounded-t-md">
                      {month.toUpperCase()}
                    </div>
                    <div className="text-[#0F2C59] font-bold text-lg py-1">{day}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-[#0F2C59] mb-1">{event.title}</h4>
                  <p className="text-sm text-[#D4AF37] font-medium mb-2">{event.location}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{event.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <p className="text-center mt-16 text-gray-500">No events found.</p>
        )}
      </motion.div>
    </section>
  );
}
