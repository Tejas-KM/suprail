import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';

const AppBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // Keep failure non-blocking; still redirect to login to clear client state
      console.error('Logout failed', err);
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="w-full h-12 md:h-14 bg-linear-to-r from-blue-700 via-blue-800 to-blue-900 text-white flex items-center justify-between px-4 md:px-6 shadow-md fixed top-0 left-0 right-0 z-50">
      <h1 className="text-base md:text-lg font-semibold truncate">Supreme AI</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1 rounded hover:bg-white/10 transition"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AppBar;
