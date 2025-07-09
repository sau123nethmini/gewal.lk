import React from 'react';
import { assets } from '../assets/assets'; // Ensure assets.about_img exists, or replace with your image path
import { FaHome, FaUsers, FaHandshake, FaShieldAlt } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-[#F6F7FB] py-12 px-6 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-12">
          <div className="w-full md:w-1/2">
            <img
              src={assets.about_img}
              alt="Modern Real Estate"
              className="w-full h-auto rounded-3xl shadow-xl object-cover transition duration-400 hover:scale-105"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-10 text-center md:text-left">
            <h2 className="text-4xl font-bold text-[#22223B] mb-4">About <span className="text-[#8E7BEF]">gewal.lk</span></h2>
            <p className="text-lg text-[#4A4E69] mb-6">
              gewal.lk is Sri Lanka’s modern, trusted platform for property management and real estate services. Whether you’re looking to buy, sell, rent, or manage properties, our mission is to simplify your experience with technology, expertise, and care.
            </p>
            <a
              href="/services"
              className="inline-block bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 mt-2"
            >
              Our Services
            </a>
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#22223B] mb-6">Our Story</h2>
          <p className="text-lg text-[#4A4E69] leading-relaxed text-center max-w-3xl mx-auto">
            Founded by property professionals who understand local needs, gewal.lk was built to bridge the gap between traditional real estate and the future of digital property management. We combine deep market knowledge with intuitive tools, making it easy for individuals, families, and businesses to manage, invest, and thrive in the Sri Lankan property market.
          </p>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#22223B] mb-10">Our Values</h2>
          <div className="flex flex-wrap justify-center gap-10">
            <div className="bg-white rounded-2xl shadow p-8 w-72 flex flex-col items-center hover:shadow-lg transition">
              <FaHome className="text-[#8E7BEF] text-4xl mb-4" />
              <h3 className="text-xl font-semibold text-[#22223B] mb-2">Integrity</h3>
              <p className="text-[#4A4E69] text-center">We operate with honesty and transparency, building trust with every client and partner.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-8 w-72 flex flex-col items-center hover:shadow-lg transition">
              <FaUsers className="text-[#8E7BEF] text-4xl mb-4" />
              <h3 className="text-xl font-semibold text-[#22223B] mb-2">Community</h3>
              <p className="text-[#4A4E69] text-center">We value long-term relationships and support the growth of vibrant local communities.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-8 w-72 flex flex-col items-center hover:shadow-lg transition">
              <FaHandshake className="text-[#8E7BEF] text-4xl mb-4" />
              <h3 className="text-xl font-semibold text-[#22223B] mb-2">Service</h3>
              <p className="text-[#4A4E69] text-center">We are committed to delivering the highest quality service, making property management seamless and stress-free.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-8 w-72 flex flex-col items-center hover:shadow-lg transition">
              <FaShieldAlt className="text-[#8E7BEF] text-4xl mb-4" />
              <h3 className="text-xl font-semibold text-[#22223B] mb-2">Security</h3>
              <p className="text-[#4A4E69] text-center">Your data, assets, and privacy are protected by robust technology and best practices.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] rounded-3xl py-12 px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Join the gewal.lk Community!
          </h2>
          <p className="text-lg text-white text-center mb-8 max-w-2xl mx-auto">
            Get updates on Sri Lanka’s property market, new listings, and exclusive management tips. Sign up for our newsletter and be first to know.
          </p>
          <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg border-2 border-white w-full sm:w-2/3 placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className="bg-white text-[#8E7BEF] hover:bg-[#F5F0FF] font-semibold px-8 py-3 rounded-lg shadow transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;