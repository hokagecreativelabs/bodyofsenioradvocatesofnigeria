'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const activateUser = async () => {
      try {
        const res = await fetch(`/api/activate?token=${token}`);
        const data = await res.json();

        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    activateUser();
  }, [token]);

  if (status === 'loading') return <p>Activating your account...</p>;
  if (status === 'success') return <p>✅ Your account has been activated!</p>;
  if (status === 'invalid') return <p>⚠️ Invalid token provided.</p>;
  return <p>❌ Failed to activate your account.</p>;
}
