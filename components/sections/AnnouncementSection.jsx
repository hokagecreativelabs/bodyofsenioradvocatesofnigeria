"use client";

import { motion } from "framer-motion";
import { Link } from "wouter";

const announcements = [
  {
    id: "1",
    title: "BOSAN AGM Scheduled for May 25th, 2025",
    content:
      "The Body of Senior Advocates of Nigeria (BOSAN) will hold its Annual General Meeting at the Eko Hotel, Lagos. All members are encouraged to attend.",
  },
  {
    id: "2",
    title: "Call for Papers: Legal Reform Symposium",
    content:
      "Submissions are now open for the 2025 Legal Reform Symposium. Deadline is April 30. Selected papers will be published in the BOSAN Journal.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Announcements() {
  return (
    <section className="bg-[#F8F9FA] py-16">
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
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-[#D4AF37]"
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
                <div>
                  <h3 className="font-montserrat font-semibold text-[#0F2C59] text-lg mb-1">
                    {announcement.title}
                  </h3>
                  <p className="text-[#343A40]/80 leading-relaxed text-sm">{announcement.content}</p>
                  <div className="mt-3">
                    <Link href={`/announcements/${announcement.id}`}>
                      <a className="text-[#750E21] font-medium text-sm inline-flex items-center hover:text-opacity-80 transition-colors">
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
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
