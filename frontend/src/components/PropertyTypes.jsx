import React from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';
import { BuildingOffice2Icon, UserGroupIcon } from '@heroicons/react/24/outline';
import { FaHotel } from 'react-icons/fa';

const propertyTypes = [
  {
    icon: <HomeIcon className="w-12 h-12 text-purple-500" />,
    title: "Private House",
    count: 400,
    active: true,
  },
  {
    icon: <FaHotel className="w-12 h-12 text-purple-500" />,
    title: "Exclusive Hotel",
    count: 243,
    active: false,
  },
  {
    icon: <BuildingOffice2Icon className="w-12 h-12 text-purple-500" />,
    title: "Private Room",
    count: 123,
    active: false,
    showMore: true,
  },
  {
    icon: <UserGroupIcon className="w-12 h-12 text-purple-500" />,
    title: "Apartment",
    count: 432,
    active: false,
  },
];

const PropertyTypes = () => (
  <section className="py-16 bg-purple-50 font-poppins">
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-10">
        <span className="text-purple-500 font-semibold text-base">Private House</span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#22223B] mb-2">Property Types</h2>
      </div>
      <div className="flex flex-row gap-6 justify-between items-center overflow-x-auto no-scrollbar">
        {propertyTypes.map((type, idx) => (
          <div
            key={type.title}
            className={`flex flex-col items-center justify-center text-center px-6 py-8 bg-white rounded-2xl shadow-md transition-all duration-300 ${
              type.active
                ? "ring-2 ring-purple-500 bg-[#FBFEFF] shadow-lg scale-105 z-10"
                : "hover:shadow-lg"
            }`}
            style={{
              minWidth: 210,
              boxShadow:
                type.active
                  ? "0 8px 32px 0 rgba(32,198,229,0.07), 0 1.5px 4.5px 0 rgba(32,198,229,0.09)"
                  : undefined,
            }}
          >
            <span className="mb-4">{type.icon}</span>
            <div className="font-semibold text-lg text-[#22223B] mb-1">{type.title}</div>
            <div className="text-gray-400 text-base mb-2">{type.count} Listing</div>
            {type.showMore && (
              <a href="#" className="text-purple-500 font-bold text-sm mt-2 hover:underline">
                See More
              </a>
            )}
          </div>
        ))}
        {/* Arrow navigation (display only on large screens) */}
        <div className="hidden md:flex flex-col gap-2 ml-4">
          <button className="w-9 h-9 flex items-center justify-center bg-purple-200 rounded-full shadow hover:bg-purple-500 transition">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-white">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-purple-200 rounded-full shadow hover:bg-purple-500 transition">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-white">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <style>{`
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .font-poppins { font-family: 'Poppins', 'Inter', sans-serif;}
    `}</style>
  </section>
);

export default PropertyTypes;