"use client";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/layout/Footer";

const queryClient = new QueryClient(); // Move this outside the component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
