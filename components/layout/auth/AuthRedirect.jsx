// components/AuthRedirect.jsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthRedirect({ 
  children, 
  redirectTo = "/", 
  requireAuth = true,
  allowedRoles = []
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth state is determined
    if (!isLoading) {
      // If auth is required but user isn't logged in
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }
      
      // If auth is not required but user is logged in (for login pages)
      if (!requireAuth && isAuthenticated) {
        router.push("/dashboard");
        return;
      }
      
      // If specific roles are required, check user role
      if (
        requireAuth && 
        isAuthenticated && 
        allowedRoles.length > 0 && 
        !allowedRoles.includes(user?.role)
      ) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, requireAuth, redirectTo, router, allowedRoles]);

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  // For auth-required pages, don't render if not authenticated
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect due to useEffect
  }

  // For role-specific pages, don't render if wrong role
  if (
    requireAuth && 
    isAuthenticated && 
    allowedRoles.length > 0 && 
    !allowedRoles.includes(user?.role)
  ) {
    return null; // Will redirect due to useEffect
  }

  // For non-auth pages (like login), don't render if already authenticated
  if (!requireAuth && isAuthenticated) {
    return null; // Will redirect due to useEffect
  }

  // Render children if appropriate auth conditions are met
  return children;
}