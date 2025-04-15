import About from "@/components/sections/AboutSection";
import Announcements from "@/components/sections/AnnouncementSection";
import UpcomingEvents from "@/components/sections/EventsSection";
import Hero from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <UpcomingEvents />
      <Announcements />
    </div>
  );
}
