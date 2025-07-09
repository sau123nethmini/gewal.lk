import React from 'react';
import { assets } from '../assets/assets'; // Ensure assets.contact_img exists, or update with your own image
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="bg-gradient-to-br from-[#8E7BEF] via-[#F6F7FB] to-[#A084E8] min-h-screen py-12 px-4 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-3xl p-8 mb-16">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <img
              src={assets.contact_img}
              alt="Contact Us"
              className="w-full max-w-md h-auto rounded-2xl shadow-xl object-cover transition duration-400 hover:scale-105"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-10 text-center md:text-left">
            <h2 className="text-4xl font-bold text-[#22223B] mb-4">
              Get in Touch with <span className="text-[#8E7BEF]">gewal.lk</span>
            </h2>
            <p className="text-lg text-[#4A4E69] mb-6">
              Whether you have a question about properties, need support, or want to partner with us, our team is ready to assist you. Reach out today and let us help you on your real estate journey in Sri Lanka.
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white p-8 rounded-3xl shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-center text-[#22223B] mb-8">Contact Form</h2>
          <form className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-6 py-3 rounded-lg border-2 border-[#EAE6FB] focus:outline-none focus:ring-2 focus:ring-[#8E7BEF] bg-[#F6F7FB]"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-6 py-3 rounded-lg border-2 border-[#EAE6FB] focus:outline-none focus:ring-2 focus:ring-[#8E7BEF] bg-[#F6F7FB]"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-6 py-3 rounded-lg border-2 border-[#EAE6FB] focus:outline-none focus:ring-2 focus:ring-[#8E7BEF] bg-[#F6F7FB]"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full px-6 py-3 rounded-lg border-2 border-[#EAE6FB] focus:outline-none focus:ring-2 focus:ring-[#8E7BEF] bg-[#F6F7FB]"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white px-8 py-3 rounded-xl font-semibold shadow transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-[#22223B] mb-8">Contact Information</h2>
          <div className="flex flex-wrap justify-center gap-10 text-[#4A4E69]">
            <div className="bg-white rounded-2xl shadow p-8 w-72 flex flex-col items-center hover:shadow-lg transition">
              <FaPhoneAlt className="text-[#8E7BEF] text-3xl mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p>+94 77 123 4567</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-8 w-72 flex flex-col items-center hover:shadow-lg transition">
              <FaEnvelope className="text-[#8E7BEF] text-3xl mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p>info@gewal.lk</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-8 w-72 flex flex-col items-center hover:shadow-lg transition">
              <FaMapMarkerAlt className="text-[#8E7BEF] text-3xl mb-4" />
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p>123 Galle Road, Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>

        {/* Newsletter/Call to Action */}
        <div className="bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] rounded-3xl py-12 mt-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Stay Connected!</h2>
          <p className="text-lg text-white text-center mb-8">
            Subscribe to our newsletter for the latest property news, exclusive listings, and expert tips.
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

export default Contact;