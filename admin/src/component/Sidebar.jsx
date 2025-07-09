import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen bg-gradient-to-b from-[#1a1f36] to-[#2d3748] shadow-lg border-r border-gray-700 text-white">
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-600">
        <img className="w-30 h-10" src={assets.gewal} alt="Logo" />
        <h2 className="text-lg font-bold tracking-wide">Admin Panel</h2>
      </div>

      {/* Sidebar Content */}
      <div className="pt-6 pl-6 text-[15px] space-y-8">
        {/* Property Management */}
        <div>
          <h3 className="text-gray-400 uppercase font-semibold text-sm mb-3 tracking-wider">
            Property Management
          </h3>
          <NavLink
            to="/adminproperty"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all 
               ${isActive ? 'bg-[#374151] text-white' : 'text-gray-300 hover:bg-[#374151] hover:text-white'}`
            }
          >
            <img className="w-5 h-5" src={assets.add_icon} alt="Add Icon" />
            <p className="hidden md:block font-medium">Admin Dashboard</p>
          </NavLink>
        </div>

        {/* Feedback Management */}
        <div>
          <h3 className="text-gray-400 uppercase font-semibold text-sm mb-3 tracking-wider">
            Finance Management
          </h3>
          <NavLink
            to="/adminfinance"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all 
               ${isActive ? 'bg-[#374151] text-white' : 'text-gray-300 hover:bg-[#374151] hover:text-white'}`
            }
          >
            <img className="w-5 h-5" src={assets.fb} alt="Feedback Icon" />
            <p className="hidden md:block font-medium">Admin Dashboard</p>
          </NavLink>

        
        </div>

        {/* Support Ticket Management */}
        <div>
          <h3 className="text-gray-400 uppercase font-semibold text-sm mb-3 tracking-wider">
            Support Ticket Management
          </h3>
          <NavLink
            to="/adminticket"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all 
               ${isActive ? 'bg-[#374151] text-white' : 'text-gray-300 hover:bg-[#374151] hover:text-white'}`
            }
          >
            <img className="w-5 h-5" src={assets.sp} alt="Support Icon" />
            <p className="hidden md:block font-medium">Admin Dashboard</p>
          </NavLink>
        </div>

        {/* Feedback Management */}
        <div>
          <h3 className="text-gray-400 uppercase font-semibold text-sm mb-3 tracking-wider">
            Feedback Management
          </h3>
          <NavLink
            to="/adminfeedback"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all 
               ${isActive ? 'bg-[#374151] text-white' : 'text-gray-300 hover:bg-[#374151] hover:text-white'}`
            }
          >
            <img className="w-5 h-5" src={assets.fb} alt="Feedback Icon" />
            <p className="hidden md:block font-medium">Admin Dashboard</p>
          </NavLink>

        
        </div>

        {/* Booking & Property Management */}
        <div>
          <h3 className="text-gray-400 uppercase font-semibold text-sm mb-3 tracking-wider">
            Booking & Property Management
          </h3>
          <NavLink
            to="/adminbooking"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all 
               ${isActive ? 'bg-[#374151] text-white' : 'text-gray-300 hover:bg-[#374151] hover:text-white'}`
            }
          >
            <img className="w-5 h-5" src={assets.bm} alt="Booking Icon" />
            <p className="hidden md:block font-medium">Admin Dashboard</p>
          </NavLink>
        </div>


        <div>
          <h3 className="text-gray-400 uppercase font-semibold text-sm mb-3 tracking-wider">
           User  Management
          </h3>
          <NavLink
            to="/adminuser"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all 
               ${isActive ? 'bg-[#374151] text-white' : 'text-gray-300 hover:bg-[#374151] hover:text-white'}`
            }
          >
            <img className="w-5 h-5" src={assets.bm} alt="Booking Icon" />
            <p className="hidden md:block font-medium">Admin Dashboard</p>
          </NavLink>

          <NavLink
            to="/main-admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-all 
               ${isActive ? 'bg-[#374151] text-white' : 'text-gray-300 hover:bg-[#374151] hover:text-white'}`
            }
          >
            <img className="w-5 h-5" src={assets.bm} alt="Booking Icon" />
            <p className="hidden md:block font-medium"> Maintenance Admin Dashboard</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
