'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirm) {
      return toast.error("Please enter and confirm your password");
    }
    if (password !== confirm) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setSubmitted(true);
      } else {
        toast.error(data.message || 'Activation failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);
  

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Account Activated 🎉</h2>
        <p className="text-gray-700">You can now log in to the BOSAN portal.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6">Activate Your BOSAN Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border p-2 rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-purple-700 text-white py-2 px-4 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Activating...' : 'Activate Account'}
        </button>
      </form>
    </div>
  );
}
