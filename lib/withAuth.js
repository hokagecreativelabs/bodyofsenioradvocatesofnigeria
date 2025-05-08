'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);


    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
    router.replace('/login');
    } else {
    setIsVerified(true);
    }


    useEffect(() => {
      // Check if we're in the browser environment
      if (typeof window !== 'undefined') {
        const checkAuth = () => {
          try {
            const user = localStorage.getItem('user');
            
            // Debug - check what's in localStorage
            console.log('User in localStorage:', user);
            
            if (!user) {
              console.log('No user found, redirecting to login');
              router.replace('/login');
              return false;
            } else {
              console.log('User found, setting verified to true');
              setIsVerified(true);
              return true;
            }
          } catch (error) {
            console.error('Auth check error:', error);
            router.replace('/login');
            return false;
          } finally {
            setLoading(false);
          }
        };
        
        checkAuth();
      }
    }, [router]);

    // Show loading state while checking authentication
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Only render the protected component if user is verified
    return isVerified ? <Component {...props} /> : null;
  };
};

export default withAuth;