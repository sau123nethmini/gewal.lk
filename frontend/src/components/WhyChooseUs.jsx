import React from 'react';
import { FaHome, FaLightbulb, FaVideo, FaTrophy, FaCertificate, FaBookOpen } from 'react-icons/fa';
import { assets } from '../assets/assets';

// Demo stats (can replace with dynamic)
const stats = [
  { count: 420, label: "Apart Asset" },
  { count: 104, label: "House Asset" },
  { count: 165, label: "Villa Asset" },
];

// Two property/team images (use your actual assets)
const MAIN_IMAGE = assets.p_img1;
const SECOND_IMAGE = assets.p_img2_1;

const WhyChooseUs = () => (
  <div className="bg-purple-50 min-h-[60vh] py-20 px-4 flex flex-col items-center font-poppins">
    <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-20 px-2 lg:px-8">
      {/* Left - Main Image, arch style, overlap sub-image */}
      <div className="relative w-full max-w-[420px] flex-shrink-0 mx-auto lg:mx-0 mb-16 lg:mb-0">
        {/* Main image: arch shape (simulated with rounded-t-[50px] and overflow-hidden) */}
        <div className="overflow-hidden rounded-t-[160px] rounded-b-[40px] bg-gray-200 shadow-2xl" style={{ aspectRatio: '1.1/1', minHeight: 370 }}>
          <img
            src={MAIN_IMAGE}
            alt="Property"
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>
        {/* Small image overlap, white card border */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 lg:left-auto lg:-right-10 lg:translate-x-0 bg-white p-2 rounded-[42px] shadow-xl flex items-center"
             style={{ width: 180, height: 110 }}>
          <img
            src={SECOND_IMAGE}
            alt="Property"
            className="w-full h-full object-cover rounded-[36px]"
            draggable="false"
          />
        </div>
      </div>

      {/* Right - About Us (Inspired by the provided image) */}
      <div className="flex-1 mt-8 lg:mt-0 px-2 lg:px-0">
        <span className="block text-purple-500 font-bold text-base mb-2">About Us</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] leading-tight mb-4">
          Get To Know Us More About<br className="hidden md:block"/> Our Company
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-2xl">
          We are a real estate agency based in Sri Lanka that has been around for years. We have helped countless people find their dream home.
        </p>
        {/* Stats */}
        <div className="flex gap-8 sm:gap-16 mb-10">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="text-purple-500 text-2xl md:text-3xl font-extrabold mb-1">{stat.count} <span className="text-purple-500">+</span></div>
              <div className="text-gray-400 font-medium text-base">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Feature highlights (optional, as in your original) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaCertificate className="text-[#8E7BEF] text-lg" />
            <span className="font-semibold text-[#4A4E69]">Verified Listings</span>
            <span className="text-gray-500 text-sm ml-2">All properties are thoroughly checked for authenticity.</span>
          </div>
          <div className="flex items-center gap-3">
            <FaBookOpen className="text-[#8E7BEF] text-lg" />
            <span className="font-semibold text-[#4A4E69]">Personalized Support</span>
            <span className="text-gray-500 text-sm ml-2">Our dedicated team guides you from search to settlement.</span>
          </div>
        </div>
      </div>
    </div>
    {/* Animation and arch effect */}
    <style>{`
      .rounded-t-[160px] { border-top-left-radius: 160px; border-top-right-radius: 160px; }
      .rounded-b-[40px] { border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; }
      .rounded-[42px] { border-radius: 42px; }
      .rounded-[36px] { border-radius: 36px; }
      @media (max-width: 1023px) {
        .rounded-t-[160px] { border-top-left-radius: 80px; border-top-right-radius: 80px; }
      }
    `}</style>
  </div>
);

export default WhyChooseUs;