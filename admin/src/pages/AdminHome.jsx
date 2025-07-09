import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "Property Management",
      description: "Manage properties, listings, and details",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
      borderClass: "border-blue-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      iconPath:
        "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      onClick: () => navigate("/adminproperty"),
    },
    {
      title: "Customer Management",
      description: "Manage customer profiles and interactions",
      buttonClass: "bg-green-600 hover:bg-green-700",
      borderClass: "border-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      iconPath:
        "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      onClick: () => navigate("/adminticket"),
    },
    {
      title: "Booking Management",
      description: "Manage bookings and schedules",
      buttonClass: "bg-purple-600 hover:bg-purple-700",
      borderClass: "border-purple-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      iconPath:
        "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      onClick: () => navigate("/adminbooking"),
    },
    {
      title: "User Management",
      description: "Manage admin accounts and permissions",
      buttonClass: "bg-red-600 hover:bg-red-700",
      borderClass: "border-red-500",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      iconPath:
        "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      onClick: () => navigate("/adminuser"),
    },
    {
      title: "Feedback Management",
      description: "Review user feedback and comments",
      buttonClass: "bg-green-600 hover:bg-green-700",
      borderClass: "border-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      iconPath:
        "M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18zm-3-4l6-4-6-4v8z",
      onClick: () => navigate("/adminfeedback"),
    },
    {
      title: "Finance Management",
      description: "Manage your finance",
      buttonClass: "bg-purple-600 hover:bg-purple-700",
      borderClass: "border-purple-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      iconPath:
        "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      onClick: () => navigate("/adminfinance"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back, Administrator</p>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border-t-4 ${card.borderClass}`}
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 ${card.iconBg} rounded-lg mr-4`}>
                <svg
                  className={`w-8 h-8 ${card.iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={card.iconPath}
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700">{card.title}</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6">{card.description}</p>
            <button
              onClick={card.onClick}
              className={`w-full ${card.buttonClass} text-white py-2 rounded-lg transition-all`}
            >
              Manage {card.title.split(" ")[0]}
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <p className="text-gray-600">New booking received (#1256)</p>
            </div>
            <span className="text-sm text-gray-400">2h ago</span>
          </div>
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <p className="text-gray-600">New property listing added</p>
            </div>
            <span className="text-sm text-gray-400">4h ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
