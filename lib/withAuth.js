'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUser } from '@/utils/auth'; // adjust path as needed

const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        const user = await fetchUser();
        if (!user) {
          router.replace('/login');
        } else {
          setIsVerified(true);
        }
        setLoading(false);
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return isVerified ? <Component {...props} /> : null;
  };
};

export default withAuth;
