"use client";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const events = [
  {
    title: "2025 BOSAN Annual Dinner",
    date: "May 25, 2025",
    location: "Eko Hotel & Suites, Lagos",
    img: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80", // cleaner image
    desc: "An elegant evening celebrating legal excellence, legacy, and community.",
  },
  {
    title: "Legal Excellence Summit",
    date: "June 15, 2025",
    location: "Transcorp Hilton, Abuja",
    img: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80",
    desc: "Top legal minds gather to discuss transformative reforms and justice trends.",
  },
  {
    title: "Mentorship Breakfast Forum",
    date: "July 6, 2025",
    location: "Oriental Hotel, VI",
    img: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=800&q=80",
    desc: "A vibrant morning of mentorship and intergenerational dialogue in the legal field.",
  },
];

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return { day, month };
};

export default function UpcomingEvents() {
  return (
    <motion.section
      className="py-24 px-4 md:px-12 bg-[#F9FAFB]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
    >
      <h3 className="font-playfair text-3xl font-bold text-[#0F2C59] text-center relative mb-12">
        Upcoming Events
        <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-24 h-[3px] bg-[#D4AF37]"></span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {events.map((event, index) => {
          const { day, month } = formatDate(event.date);
          return (
            <motion.div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
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

      <div className="mt-16 text-center">
        <button className="bg-[#D4AF37] hover:bg-[#b6952f] transition-colors text-white font-semibold py-3 px-8 rounded-full shadow">
          View All Events
        </button>
      </div>
    </motion.section>
  );
}
