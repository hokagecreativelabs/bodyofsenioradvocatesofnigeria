"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Check if the current path is part of the member dashboard
  const isDashboardRoute = pathname?.startsWith('/member-dashboard');

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
            {/* Only render Navbar and Footer for non-dashboard routes */}
            {!isDashboardRoute && <Navbar />}
            <main className={`${!isDashboardRoute ? 'flex-1' : ''}`}>{children}</main>
            {!isDashboardRoute && <Footer />}
        </QueryClientProvider>
      </body>
    </html>
  );
}