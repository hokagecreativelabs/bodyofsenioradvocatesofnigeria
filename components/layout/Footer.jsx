import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  
  const handleNewsletterSubscription = (e) => {
    e.preventDefault();
    
    // In a real app, we would send this to an API
    if (email) {
      toast({
        title: "Subscription successful",
        description: "Thank you for subscribing to our newsletter!",
      });
      setEmail("");
    } else {
      toast({
        title: "Subscription failed",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="bg-[#343A40] text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <div className="flex items-center space-x-2 mb-4 cursor-pointer">
                <div className="h-10 w-10 bg-[#0F2C59] rounded-full flex items-center justify-center">
                  <span className="text-[#D4AF37] font-playfair font-bold text-lg">B</span>
                </div>
                <div>
                  <h3 className="text-white font-playfair font-bold text-xl">BOSAN</h3>
                  <p className="text-xs text-gray-400">Body of Senior Advocates of Nigeria</p>
                </div>
              </div>
            </Link>
            <p className="text-gray-400 mb-6">The prestigious association of Senior Advocates committed to upholding the rule of law and excellence in legal practice.</p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition duration-300"
                whileHover={{ y: -3 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.097 10.097 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition duration-300"
                whileHover={{ y: -3 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition duration-300"
                whileHover={{ y: -3 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition duration-300"
                whileHover={{ y: -3 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </motion.a>
            </div>
          </div>
          
          <div>
            <h3 className="font-playfair font-bold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-[#D4AF37] transition duration-300 cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-gray-400 hover:text-[#D4AF37] transition duration-300 cursor-pointer">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/events">
                  <span className="text-gray-400 hover:text-[#D4AF37] transition duration-300 cursor-pointer">Events</span>
                </Link>
              </li>
              <li>
                <Link href="/members">
                  <span className="text-gray-400 hover:text-[#D4AF37] transition duration-300 cursor-pointer">Members</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-gray-400 hover:text-[#D4AF37] transition duration-300 cursor-pointer">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-playfair font-bold text-xl mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#">
                  <span className="text-gray-400 hover:text-[#D4AF37] transition duration-300 cursor-pointer">Legal Updates</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-gray-400 hover:text-[#D4AF37] transition duration-300 cursor-pointer">Publications</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-gray-400 hover:text-[#D4AF37] transition duration-300 cursor-pointer">Media Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-gray-400 hover:text-[#D4AF37] transition duration-300 cursor-pointer">FAQs</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="text-gray-400 hover:text-[#D4AF37] transition duration-300 cursor-pointer">Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-playfair font-bold text-xl mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates, events, and legal insights.</p>
            <form className="flex" onSubmit={handleNewsletterSubscription}>
              <Input
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 w-full rounded-l bg-gray-700 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="bg-[#D4AF37] text-[#0F2C59] px-4 rounded-r hover:bg-opacity-90 transition duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Body of Senior Advocates of Nigeria (BOSAN). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
