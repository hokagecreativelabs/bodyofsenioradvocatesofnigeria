"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-[#0F2C59] font-playfair font-bold text-3xl md:text-4xl mb-4">About BOSAN</h2>
          <div className="h-1 w-20 bg-[#D4AF37] mx-auto"></div>
          <p className="text-[#343A40]/80 mt-6 max-w-2xl mx-auto">
            The Body of Senior Advocates of Nigeria (BOSAN) is an independent organization comprising highly 
            distinguished practitioners in the legal profession. Its main objective is to advocate for leadership
            in the legal domain while upholding professional ethics, integrity, and a superior level of legal 
            practice within the Inner Bar and the legal profession in Nigeria.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeIn}>
              <h3 className="font-playfair text-2xl font-bold text-[#0F2C59] mb-4 relative">
                The Body
                <span className="absolute bottom-[-10px] left-0 w-20 h-[3px] bg-[#D4AF37]"></span>
              </h3>
              <p className="text-[#343A40]/80 mb-4">
                The Body comprises 899 distinguished practitioners, with 147 members now of blessed memories. 
                Its membership includes advocates and academics, and it operates under a well-defined constitution.
              </p>
              <p className="text-[#343A40]/80">
                BOSAN fosters collaboration and is governed by a clear constitution. BOSAN promotes a cooperative 
                and lively atmosphere among its members through quarterly meetings and annual gatherings. If the 
                Attorney General of the Federation (where he is a Senior Advocate) is unavailable, the Vice-Chairman 
                or, in his absence, the most senior member of BOSAN assumes the role of Chair, ensuring continuity 
                in leadership.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="mt-8">
              <h3 className="font-playfair text-2xl font-bold text-[#0F2C59] mb-4 relative">
                Membership
                <span className="absolute bottom-[-10px] left-0 w-20 h-[3px] bg-[#D4AF37]"></span>
              </h3>
              <p className="text-[#343A40]/80 mb-4">
                Any legal practitioner who has been conferred the rank of Senior Advocate of Nigeria and 
                sworn in as such becomes a member of BOSAN subject to meeting the requirements of financial 
                membership.
              </p>
              <p className="text-[#343A40]/80">
                The Body's constitution governs membership and aims to promote good administration based on 
                the principles of freedom, equity, and justice. The constitution takes precedence over any 
                Rules and Regulations. Members of the Body are committed to being a social, non-political, 
                non-governmental entity representing the interests of the youth, the less privileged, and 
                the aspirations of society.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="rounded-lg overflow-hidden shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80" 
              alt="BOSAN gathering" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Leadership Section */}
<motion.section
  className="py-20 px-4 sm:px-10 bg-[#F9FAFB]"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeIn}
>
  <h3 className="text-4xl font-bold font-playfair text-center text-[#0F2C59] relative mb-20">
    Leadership
    <span className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-24 h-[4px] bg-[#D4AF37] rounded-full"></span>
  </h3>

  {/* Chairman & Vice-Chairman */}
  <div className="grid md:grid-cols-2 gap-12 mb-20">
    {[
      {
        name: "Prince Lateef Fagbemi, SAN",
        title: "Honourable Attorney General of the Federation and Minister of Justice",
        role: "Chairman, Body of Senior Advocates of Nigeria",
        note: "Under Article 7 of the Constitution of the Body of Senior Advocates of Nigeria, the Honourable Attorney General of the Federation is the statutory Chairman of the Body.",
        img: "/assets/BOSAN/prince-Lateef-fagbemi.jpg"
      },
      {
        name: "Professor Alfred Bandele Kasunmu, SAN",
        title: "Elevated to the Inner Bar in the year 1979",
        role: "Vice-Chairman, Body of Senior Advocates of Nigeria",
        note: "By virtue of being the most senior SAN with the demise of Professor Ben Nwabueze, SAN on October 29, 2023.",
        img: "/assets/BOSAN/prof-alfred-bandele.jpg"
      }
    ].map((person, i) => (
      <motion.div
        key={i}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + i * 0.1 }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 mb-5 rounded-full border-4 border-[#D4AF37] overflow-hidden hover:scale-105 transition-transform duration-300">
            <img src={person.img} alt={person.name} className="w-full h-full object-center" />
          </div>
          <h4 className="text-2xl font-bold text-[#0F2C59]">{person.name}</h4>
          <p className="text-[#D4AF37] font-medium mt-2">{person.title}</p>
          <p className="text-[#343A40]/80 mt-1">{person.role}</p>
          <p className="text-sm text-gray-500 mt-4 italic max-w-md">{person.note}</p>
        </div>
      </motion.div>
    ))}
  </div>

  {/* Committee Chair */}
  <motion.div
    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-lg mx-auto text-center mb-20"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.4 }}
  >
    <div className="flex flex-col items-center">
      <div className="w-36 h-36 mb-5 rounded-full border-4 border-[#0F2C59] overflow-hidden hover:scale-105 transition-transform duration-300">
        <img src="/assets/BOSAN/paul-usoro.png" alt="Paul Usoro, SAN" className="w-full h-full object-cover" />
      </div>
      <h4 className="text-2xl font-bold text-[#0F2C59]">Paul Usoro, SAN</h4>
      <p className="text-[#343A40]/80 mt-1">Chairman, BOSAN Leadership Committee</p>
    </div>
  </motion.div>

  {/* BOSAN Officers */}
  <h4 className="font-playfair text-2xl font-bold text-[#0F2C59] text-center mb-10">BOSAN OFFICERS</h4>
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
    {[
      {
        name: "Olumide Sofowora, SAN, CArb",
        role: "Secretary",
        img: "/assets/BOSAN/olumide-sofowora.jpg"
      },
      {
        name: "Oladipo Olasope, SAN",
        role: "Assistant Secretary",
        img: "/assets/BOSAN/oladipo-olasope.jpg"
      },
      {
        name: "Abimbola Akeredolu, SAN, FCIArb",
        role: "Treasurer",
        img: "/assets/BOSAN/abimbola-akeredolu.png"
      },
      {
        name: "Jean Chiazor Anishere, SAN, FCIArb",
        role: "Financial Secretary",
        img: "/assets/BOSAN/jean.jpg"
      }
    ].map((officer, i) => (
      <motion.div
        key={i}
        className="bg-white rounded-xl border border-gray-100 shadow-lg p-6 text-center hover:shadow-xl transition"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 + i * 0.1 }}
      >
        <div className="w-28 h-28 mb-4 mx-auto rounded-full border-2 border-[#D4AF37] overflow-hidden hover:scale-105 transition-transform duration-300">
          <img src={officer.img} alt={officer.name} className="w-full h-full object-cover" />
        </div>
        <h5 className="text-xl font-bold text-[#0F2C59]">{officer.name}</h5>
        <p className="text-[#343A40]/80 mt-1">{officer.role}</p>
      </motion.div>
    ))}
  </div>

  {/* Programming and Publicity Secretary */}
  <motion.div
    className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-lg mx-auto text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 1 }}
  >
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 mb-4 rounded-full border-2 border-[#0F2C59] overflow-hidden hover:scale-105 transition-transform duration-300">
        <img src="/assets/BOSAN/abdul.jpg" alt="Abdul Mohammed, SAN, FCIArb" className="w-full h-full object-cover" />
      </div>
      <h5 className="text-xl font-bold text-[#0F2C59]">Abdul Mohammed, SAN, FCIArb</h5>
      <p className="text-[#343A40]/80 mt-1">Programming and Publicity Secretary</p>
    </div>
  </motion.div>
</motion.section>

        
        {/* Aims and Objectives Section */}
        <motion.div
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h3 className="font-playfair text-2xl font-bold text-[#0F2C59] mb-6 relative">
            Aims and Objectives
            <span className="absolute bottom-[-10px] left-0 w-20 h-[3px] bg-[#D4AF37]"></span>
          </h3>
          
          <div className="grid grid-cols-1 gap-6 mt-8">
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.ul className="space-y-4" variants={staggerChildren}>
                <motion.li className="flex items-start" variants={fadeIn}>
                  <svg className="w-5 h-5 text-[#D4AF37] mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>To promote professional responsibility amongst members and to maintain and defend the professional integrity of the members of the Body.</span>
                </motion.li>
                <motion.li className="flex items-start" variants={fadeIn}>
                  <svg className="w-5 h-5 text-[#D4AF37] mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>To promote the independence of the judiciary, the rule of law, the highest professional standards of legal practice, legal education, and the advancement of advocacy and jurisprudence.</span>
                </motion.li>
                <motion.li className="flex items-start" variants={fadeIn}>
                  <svg className="w-5 h-5 text-[#D4AF37] mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>To maintain the highest standards of professional ethics, conduct, etiquette, and discipline.</span>
                </motion.li>
                <motion.li className="flex items-start" variants={fadeIn}>
                  <svg className="w-5 h-5 text-[#D4AF37] mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>To establish supportive relationships with the Nigerian Bar Association, the Body of Benchers, the Council of Legal Education, the National Judicial Council, the Legal Practitioners' Privileges Committee, and the Disciplinary Committee of the Legal Profession and with International Bodies sharing similar objectives of the Body.</span>
                </motion.li>
                <motion.li className="flex items-start" variants={fadeIn}>
                  <svg className="w-5 h-5 text-[#D4AF37] mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>To ensure and maintain the dignity of the rank of Senior Advocate of Nigeria.</span>
                </motion.li>
              </motion.ul>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/members">
            <Button className="bg-transparent border border-[#0F2C59] text-[#0F2C59] font-montserrat font-medium py-2 px-6 rounded-md hover:bg-[#0F2C59] hover:text-white transition duration-300">
              Our Disinguished Members
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default About;