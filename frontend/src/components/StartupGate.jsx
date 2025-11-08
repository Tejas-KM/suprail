import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';
import { setAuthToken } from '../utils/axiosInstance';

export default function StartupGate() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Ensure Authorization header is attached if token exists in storage
        try {
          const storedToken =
            window?.localStorage?.getItem('auth_token') ||
            window?.sessionStorage?.getItem('auth_token');
          if (storedToken) setAuthToken(storedToken);
        } catch (_) {}
        await getCurrentUser();
        if (!active) return;
        navigate('/dashboard', { replace: true });
      } catch (e) {
        if (!active) return;
        navigate('/login', { replace: true });
      }
    })();
    return () => { active = false; };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      <div className="animate-pulse">Loading…</div>
    </div>
  );
}
