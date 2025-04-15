"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section
      className="relative h-[700px] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(rgba(15, 44, 89, 0.85), rgba(15, 44, 89, 0.9))",
        }}
      ></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative h-full flex flex-col justify-center">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-white font-playfair text-4xl md:text-7xl font-bold mb-4">
            The Body of Senior Advocates of Nigeria
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl">
            Promoting professional responsibility amongst members and maintaining the dignity of the rank of Senior Advocate
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
              <Link href="/about">
                <Button className="w-full sm:w-auto bg-[#D4AF37] text-[#0F2C59] font-montserrat font-medium py-6 px-6 rounded-md hover:bg-opacity-90 transition duration-300 flex items-center justify-center space-x-2">
                  <span>Learn About BOSAN</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
              <Link href="/events">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white text-[#0F2C59] font-montserrat font-medium py-6 px-6 rounded-md hover:bg-opacity-90 transition duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Upcoming Events</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;