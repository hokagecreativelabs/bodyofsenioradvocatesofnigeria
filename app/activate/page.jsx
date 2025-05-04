'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { toast } from 'react-toastify';
import { FiCheckCircle } from 'react-icons/fi';

function ActivateForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (submitted) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        window.location.href = '/';
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirm) {
      return toast.error('Please enter and confirm your password');
    }
    if (password !== confirm) {
      return toast.error('Passwords do not match');
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

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-4">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 text-center">
          <FiCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Account Activated 🎉</h2>
          <p className="text-gray-600">
            You can now log in to the BOSAN portal. Redirecting in <span className="font-semibold">{countdown}</span> seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Activate Your BOSAN Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 transition duration-300 text-white py-3 px-4 rounded w-full font-semibold"
            disabled={loading}
          >
            {loading ? 'Activating...' : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <ActivateForm />
    </Suspense>
  );
}
