import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ FIX: backend expects lowercase `username` and `password`
        body: JSON.stringify({ username: userName, password: password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);

        // Dispatch custom event to notify Navbar of login
        window.dispatchEvent(new Event("userLogin"));

        alert(`Welcome ${data.username}!`);

        // ✅ Redirect based on user role
        if (data.role === "Admin") {
          navigate("/adminpanel-parent");
        } else {
          navigate("/food");
        }
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-20 border">
        <form onSubmit={handleSubmit} className="p-6 flex flex-col space-y-6">
          {error && (
            <div className="text-red-500 bg-red-100 p-2 rounded">{error}</div>
          )}

          {/* Username Input */}
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border p-2 w-[300px]"
            required
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-[300px]"
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="border rounded-md text-sm p-4 bg-blue-800 text-white transition-all hover:-translate-y-1 hover:bg-transparent hover:text-slate-950"
          >
            Login
          </button>

          {/* Additional Actions */}
          <div className="flex justify-between mt-4">
            <Link to="/create-account">
              <button
                type="button"
                className="border rounded-full text-sm p-4 bg-slate-900 text-white transition-all hover:-translate-y-1 hover:bg-transparent hover:text-green-800"
              >
                Create Account
              </button>
            </Link>

            <Link to="/adminpanel-parent">
              <button
                type="button"
                className="border rounded-full text-sm p-4 bg-slate-900 text-white transition-all hover:-translate-y-1 hover:bg-transparent hover:text-green-800"
              >
                Go Admin
              </button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
