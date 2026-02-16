import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function UserProfile() {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Get user data from localStorage
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (!storedUsername) {
            // If no user is logged in, redirect to login page
            navigate("/login");
            return;
        }

        setUsername(storedUsername);
        setRole(storedRole || "User");
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        navigate("/");
    };

    const handleAdminPanel = () => {
        navigate("/adminpanel-parent");
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all hover:scale-105 duration-300">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center mb-8">
                        {/* Person Icon */}
                        <div className="relative mb-4">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-20 w-20 text-white"
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
                            </div>
                            {/* Role Badge */}
                            <div
                                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-md ${role === "Admin"
                                        ? "bg-gradient-to-r from-red-500 to-pink-500"
                                        : "bg-gradient-to-r from-green-500 to-teal-500"
                                    }`}
                            >
                                {role}
                            </div>
                        </div>

                        {/* Username */}
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {username}
                        </h1>
                        <p className="text-gray-500 text-sm">Welcome to your profile</p>
                    </div>

                    {/* User Details Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Account Information
                        </h2>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Username:</span>
                                <span className="text-gray-800 font-semibold">{username}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Role:</span>
                                <span
                                    className={`font-semibold ${role === "Admin" ? "text-red-600" : "text-green-600"
                                        }`}
                                >
                                    {role}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Status:</span>
                                <span className="flex items-center text-green-600 font-semibold">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {/* Admin Panel Button - Only for Admin users */}
                        {role === "Admin" && (
                            <button
                                onClick={handleAdminPanel}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                Admin Panel
                            </button>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserProfile;
