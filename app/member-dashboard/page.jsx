"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function MemberDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // Wait for auth state to be determined
        if (!isLoading) {
          if (!user) {
            // Redirect to home if not authenticated
            router.push("/");
          } else {
            setInitialLoading(false);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [user, isLoading, router]);

  if (isLoading || initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-900" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">
          Welcome to your Dashboard, {user?.fullName || "Member"}
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Profile Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Name:</span> {user?.fullName}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Member since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Quick Links</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded bg-white hover:bg-gray-50 transition-colors">
                My Account Settings
              </button>
              <button className="w-full text-left px-4 py-2 rounded bg-white hover:bg-gray-50 transition-colors">
                My Resources
              </button>
              <button className="w-full text-left px-4 py-2 rounded bg-white hover:bg-gray-50 transition-colors">
                Support & Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}