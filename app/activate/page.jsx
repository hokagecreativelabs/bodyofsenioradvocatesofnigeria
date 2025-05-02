'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setMessage('No token provided.');
      return;
    }

    const activateUser = async () => {
      try {
        const res = await fetch('/api/activate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Account activated successfully.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Activation failed.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred.');
      }
    };

    activateUser();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center">
      <div>
        {status === 'loading' && <p>Activating your account...</p>}
        {status === 'success' && <p className="text-green-600">{message}</p>}
        {status === 'error' && <p className="text-red-600">{message}</p>}
        {status === 'invalid' && <p className="text-red-600">{message}</p>}
      </div>
    </div>
  );
}
