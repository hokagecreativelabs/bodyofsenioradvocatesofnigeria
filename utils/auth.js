// utils/auth.js
export const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/check-auth', { cache: 'no-store' });
      if (!res.ok) return null;
  
      const data = await res.json();
      return data.user;
    } catch (err) {
      return null;
    }
  };
  