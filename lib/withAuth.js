'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const checkAuth = () => {
          const isLoggedIn = localStorage.getItem('isLoggedIn');
          const user = localStorage.getItem('user');

          if (!isLoggedIn || !user) {
            router.replace('/login');
          } else {
            setIsVerified(true);
          }
          setLoading(false);
        };

        checkAuth();
      }
    }, [router]);

    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return isVerified ? <Component {...props} /> : null;
  };
};

export default withAuth;
