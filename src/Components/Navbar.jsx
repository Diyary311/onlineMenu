import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import QRCodeGenerator from "./QRCodeGenerator";

function Navbar() {
  const [isOpen, setOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    // Listen for storage changes (when user logs in/out in different tabs)
    const handleStorageChange = () => {
      const updatedUsername = localStorage.getItem("username");
      setUsername(updatedUsername);
    };

    // Listen for custom login event (when user logs in in same tab)
    const handleUserLogin = () => {
      const updatedUsername = localStorage.getItem("username");
      setUsername(updatedUsername);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLogin", handleUserLogin);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogin", handleUserLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/");
  };

  return (
    <div>
      <nav className="text-black flex justify-between items-center">
        {/* Mobile toggle button */}
        <button className="md:hidden" onClick={() => setOpen(!isOpen)}>
          {isOpen ? "X" : "☰"}
        </button>

        {/* Navigation links */}
        <ul
          className={`${isOpen ? "block" : "hidden"
            } md:flex justify-center items-center space-x-6 flex-1`}
        >
          <li className="px-4 py-2 hover:text-blue-600">
            <Link to="/">Home</Link>
          </li>
          <li className="px-4 py-2 hover:text-blue-600">
            <Link to="/food">Foods</Link>
          </li>
          <li className="px-4 py-2 hover:text-blue-600">
            <Link to="/drinks">Drinks</Link>
          </li>
          <li className="px-4 py-2 hover:text-blue-600">
            <Link to="/sweets">Sweets</Link>
          </li>
          {!username && (
            <li className="px-4 py-2 hover:text-blue-600">
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>

        {/* QR Code Button */}
        <button
          onClick={() => setShowQR(true)}
          className="mx-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          title="Generate QR Code"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
          <span className="hidden sm:inline">QR Code</span>
        </button>

        {/* User Profile Section */}
        {username && (
          <div className="flex items-center space-x-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            {/* Clickable Profile Area */}
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              {/* Person Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {/* Username */}
              <span className="font-semibold text-gray-800">{username}</span>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* QR Code Modal */}
      {showQR && (
        <QRCodeGenerator
          url={`${window.location.origin}${location.pathname}`}
          itemName={`Online Menu - ${location.pathname === '/' ? 'Home' : location.pathname.slice(1)}`}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}

export default Navbar;
