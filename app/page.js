import { useEffect, useState } from 'react';
import Hero from "@/components/sections/HeroSection";
import About from "@/components/sections/AboutSection";
import UpcomingEvents from "@/components/sections/EventsSection";
import Announcements from "@/components/sections/AnnouncementSection";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set the client-side flag when the component mounts
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Prevent rendering until after the component has mounted
    return null;
  }

  return (
    <div>
      <Hero />
      <About />
      <UpcomingEvents />
      <Announcements />
    </div>
  );
}
