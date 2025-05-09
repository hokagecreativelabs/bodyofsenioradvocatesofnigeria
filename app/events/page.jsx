"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// BOSAN Programs and Events
const bosanPrograms = [
  {
    id: "scholarship",
    title: "BOSAN Scholarship Awards",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-8 md:h-8">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
    ),
    content: `
      <h3>BOSAN Scholarship Awards</h3>
      <p>In 2018, BOSAN became very concerned about the falling standard of practice in the Legal Profession and decided to take steps to arrest the trend. BOSAN believed that the problem could be addressed at the University as well as the Nigerian Law School levels by setting targets that will motivate Law Students to aspire to scholarly excellence.</p>
      <p>To positively impact the standard and quality of Legal Education on a sustainable basis, BOSAN came up with the idea of producing BOSAN SCHOLARS. The maiden award program was established in 2019, during which five deserving students were awarded the scholarship at a prize of ₦1,000,000.00 (One Million Naira) each. Since then, BOSAN has consistently presented the award, except in 2020 due to the COVID-19 pandemic.</p>
      <br />
      <h4>The Award</h4>
      <p>Successful Applicants shall receive the Scholarship Award in the sum of ₦500,000.00 (Five Hundred Thousand Naira) in the final year, and ₦500,000.00 (Five Hundred Thousand Naira) at the Nigerian Law School.</p>
      <br />
      <h4>Eligibility Criteria</h4>
      <ul>
        <li><strong>Institution of Study:</strong> Nigerian Universities (both public and private)</li>
        <li><strong>Course of Study:</strong> Law</li>
        <li><strong>Level of Study:</strong> The student being nominated must be in his/her 400 Level in the University.</li>
        <li><strong>Cumulative Grade Point Average (CGPA):</strong> The student being nominated must be on a CGPA of 4.5 or above on a scale of 5.0. or equivalent for institutions that are not on 5-grade points given the overriding objective of the Scheme.</li>
        <li>The student being nominated must have consistently demonstrated good character, honesty, and integrity throughout his/her period in the University</li>
        <li>Nominees shall be subjected to both written examination and oral interviews to be conducted and superintended by BOSAN</li>
        <li>There shall be a minimum of five (5) Scholarship Awardees in all from the total number of shortlisted candidates nationwide who will eventually become the BOSAN SCHOLARS.</li>
      </ul>
    `
  },
  {
    id: "induction",
    title: "BOSAN Mandatory Induction Program",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-8 md:h-8">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
      </svg>
    ),
    content: `
      <h3>BOSAN Mandatory Induction Program</h3>
      <p>The mandatory pre-swearing-in Induction program is designed to provide orientation for newly appointed Senior Advocates of Nigeria, on their pivotal leadership roles in the legal profession, professional ethics, and the conduct expected of them while executing their responsibilities towards their Clients, the Courts, and Society at large.</p>
      <br />
      <h4>Dress Code for the Induction Programme</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h5>For men:</h5>
          <ul>
            <li>Dark Lounge Suit (black, charcoal grey or navy Blue)</li>
            <li>A button-up collared shirt with a dark tie</li>
            <li>Black socks</li>
            <li>Black shoes</li>
          </ul>
        </div>
        <div>
          <h5>For Women:</h5>
          <ul>
            <li>Dark pantsuits, a suit dress, or skirt suit (black, charcoal grey or navy blue)</li>
            <li>Moderate accessories and hairstyle</li>
            <li>Black shoes</li>
          </ul>
        </div>
      </div>
      <br />
      <p><em>Bold colours and patterns or traditional attires are NOT acceptable for the Induction Programme</em></p>
      
      <p>BOSAN strongly advise that inductees do not promote or encourage the placing of any form of advertisements in newspapers and other social media platforms, as these acts are not in accordance with the values of the Inner Bar.</p>
    `
  },
  {
    id: "dinners",
    title: "BOSAN Dinners",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-8 md:h-8">
        <path d="M3 2h18a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
        <path d="M8 10h8"></path>
        <path d="M8 14h8"></path>
        <path d="M8 18h8"></path>
      </svg>
    ),
    content: `
      <h3>BOSAN Dinners</h3>
      <p>The BOSAN Annual Dinner is a double celebratory event. Apart from welcoming our new members who were sworn-in to the inner Bar, as is our practice, we also award BOSAN Scholarships to carefully selected law students in Nigerian Universities who have proved themselves worthy of flying the flag as "BOSAN Scholars".</p>
      
      <p>Most of all, the Annual Dinners traditionally serve as bonding and camaraderie evenings and sessions for all our members as well as a semi-family gathering seeing as our members and guests are always encouraged to attend with their spouses. Members are encouraged to attend with their spouses and make the evening a grand and memorable one for all of us and our guests.</p>
    `
  },
  {
    id: "meetings",
    title: "BOSAN General Meetings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-8 md:h-8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    content: `
      <h3>BOSAN General Meetings</h3>
      <p>In line with the BOSAN Constitution, general meetings of the Body are held quarterly, while the Annual General Meeting holds annually.</p>
      
      <p>The meetings are rotated from one location to another within Nigeria.</p>
    `
  },
  {
    id: "webinars",
    title: "BOSAN Webinar Series",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-8 md:h-8">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    content: `
      <h3>BOSAN Webinar Series</h3>
      <p>The BOSAN Webinar Series is designed as an avenue for continuous legal education amongst members, in line with the objectives of the Body.</p>
    `
  }
];

export default function BosanEvents() {
  const [activeProgram, setActiveProgram] = useState("scholarship");
  const [isMobile, setIsMobile] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const currentProgram = bosanPrograms.find(p => p.id === activeProgram);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-[#0F2C59] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-center mb-6 tracking-tight">
            BOSAN Events
          </h1>
          <p className="text-lg text-center max-w-3xl mx-auto text-gray-200 leading-relaxed">
            The Body of Senior Advocates of Nigeria (BOSAN) organizes various programs and events
            to uphold excellence and integrity in the legal profession.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          {isMobile && (
            <div className="mb-4">
              <button
                onClick={toggleFilter}
                className="w-full flex items-center justify-between bg-white rounded-lg shadow-md p-4 text-[#0F2C59] font-medium"
              >
                <div className="flex items-center">
                  <span className="text-[#D4AF37] mr-3">
                    {currentProgram.icon}
                  </span>
                  <span>{currentProgram.title}</span>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform ${filterOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Mobile Filter */}
          <AnimatePresence>
            {isMobile && filterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full mb-6 overflow-hidden"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4 bg-[#0F2C59] text-white">
                    <h2 className="text-lg font-bold">Select Program</h2>
                  </div>
                  <nav className="p-2">
                    {bosanPrograms.map((program) => (
                      <button
                        key={program.id}
                        onClick={() => {
                          setActiveProgram(program.id);
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center transition-all ${
                          activeProgram === program.id
                            ? "bg-[#0F2C59] text-white font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className={`mr-3 ${activeProgram === program.id ? "text-[#D4AF37]" : "text-gray-500"}`}>
                          {program.icon}
                        </span>
                        <span>{program.title}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Sidebar Navigation */}
          {!isMobile && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
                <div className="p-6 bg-[#0F2C59] text-white">
                  <h2 className="text-xl font-bold font-playfair">Our Programs</h2>
                </div>
                <nav className="p-3">
                  {bosanPrograms.map((program) => (
                    <button
                      key={program.id}
                      onClick={() => setActiveProgram(program.id)}
                      className={`w-full text-left px-4 py-4 rounded-lg mb-2 flex items-center transition-all ${
                        activeProgram === program.id
                          ? "bg-[#0F2C59] text-white font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span className={`mr-3 ${activeProgram === program.id ? "text-[#D4AF37]" : "text-gray-500"}`}>
                        {program.icon}
                      </span>
                      <span>{program.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header Image/Banner */}
              <div className="h-48 md:h-64 relative">
                <div className="bg-[#0F2C59] absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#0F2C59]/30 backdrop-blur-sm p-6 rounded-full">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="text-[#D4AF37]"
                    >
                      {currentProgram.icon}
                    </motion.div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-[#0F2C59]">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-playfair tracking-tight">
                    {currentProgram.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProgram.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="prose prose-slate max-w-none prose-headings:font-playfair prose-headings:text-[#0F2C59] prose-headings:tracking-tight prose-h3:text-2xl prose-h4:text-xl prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#0F2C59] text-justify prose-p:text-justify prose-p:leading-relaxed prose-li:text-justify"
                    dangerouslySetInnerHTML={{ __html: currentProgram.content }}
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Program Highlights Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bosanPrograms
                .filter(p => p.id !== activeProgram)
                .slice(0, 3)
                .map((program) => (
                  <motion.div
                    key={program.id}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                    className="bg-white p-5 rounded-lg shadow-md cursor-pointer border border-gray-100"
                    onClick={() => setActiveProgram(program.id)}
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-[#D4AF37] mr-3">{program.icon}</span>
                      <h3 className="font-medium text-[#0F2C59] font-playfair">{program.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {program.content
                        .split("</h3>")[1]
                        .split("<p>")[1]
                        .split("</p>")[0]
                        .substring(0, 100)}
                      ...
                    </p>
                    <div className="mt-3 flex justify-end">
                      <span className="text-[#D4AF37] text-sm font-medium flex items-center">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact/CTA Section */}
      <div className="bg-[#0F2C59] mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-playfair tracking-tight">
            Interested in Our Programs?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            For more information about BOSAN events or to participate in our programs, 
            please contact the BOSAN secretariat.
          </p>
          <button className="bg-[#D4AF37] text-white px-6 py-3 rounded-md font-medium hover:bg-[#D4AF37]/90 transition-colors shadow-md hover:shadow-lg">
            <a href="/contact">Contact BOSAN</a>
          </button>
        </div>
      </div>
    </div>
  );
}