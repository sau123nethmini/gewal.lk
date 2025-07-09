import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const media = [assets.hero11, assets.hero22, assets.herov];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden font-poppins">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {media.map((item, index) =>
          item.endsWith(".mp4") ? (
            <video
              key={index}
              src={item}
              autoPlay
              loop
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            <img
              key={index}
              src={item}
              alt={`Property ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          )
        )}
      </div>

      {/* Modern Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1333]/90 via-[#392e66]/60 to-[#a594f9]/40" />

      {/* Gold Sparkle Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/gold-sparkle.png')] bg-repeat opacity-10" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center z-10">
        <div className="max-w-2xl text-white drop-shadow-[0_2px_24px_rgba(34,28,70,0.25)]">
          <div className="mb-6">
            <span className="bg-gradient-to-r from-[#8E7BEF] via-[#bfa9f8] to-[#A084E8] text-transparent bg-clip-text px-6 py-2 rounded-full text-base font-semibold shadow-lg border border-[#eae6fb]/30 tracking-widest uppercase">
              Exclusive Collection
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d1c28f] via-[#fff6d6] to-[#8E7BEF] drop-shadow-[0_3px_24px_rgba(209,194,143,0.15)]">
              Luxury Living
            </span>{" "}
            Awaits You
          </h1>
          <p className="text-lg sm:text-2xl text-[#e6e0fa] mb-10 max-w-lg leading-relaxed font-light">
            Step into the world of sophistication with <span className="font-semibold text-[#F3E9C9]">gewal.lk</span>. Discover breathtaking estates and modern homes in Sri Lanka’s most coveted locations.
          </p>

          {/* Search Bar */}
          <div className="bg-white/20 backdrop-blur-xl border border-[#eae6fb]/40 rounded-2xl shadow-xl p-6 mb-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bfa9f8]" />
                <input
                  type="text"
                  placeholder="Search by location…"
                  className="w-full bg-transparent border-none rounded-xl pl-12 pr-4 py-3 text-white placeholder-[#bfa9f8] focus:outline-none focus:ring-2 focus:ring-[#d1c28f]/60 font-medium"
                />
              </div>
              <div className="flex-1 relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bfa9f8]" />
                <select className="w-full bg-transparent border-none rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d1c28f]/60 font-medium">
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                </select>
              </div>
              <button className="bg-gradient-to-r from-[#d1c28f] to-[#8E7BEF] hover:from-[#8E7BEF] hover:to-[#d1c28f] text-[#392e66] font-bold px-8 py-3 rounded-xl shadow-md text-lg uppercase tracking-wider transition-all duration-300 hover:scale-105 border border-[#d1c28f]/30">
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-7 mb-8">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d1c28f] to-[#8E7BEF]">500+</div>
              <div className="text-sm text-[#e6e0fa] tracking-wider font-medium">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d1c28f] to-[#8E7BEF]">100+</div>
              <div className="text-sm text-[#e6e0fa] tracking-wider font-medium">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d1c28f] to-[#8E7BEF]">10K+</div>
              <div className="text-sm text-[#e6e0fa] tracking-wider font-medium">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d1c28f] to-[#8E7BEF]">24/7</div>
              <div className="text-sm text-[#e6e0fa] tracking-wider font-medium">Support</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/properties"
              className="bg-gradient-to-r from-[#d1c28f] to-[#8E7BEF] hover:from-[#8E7BEF] hover:to-[#d1c28f] text-[#392e66] px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border border-[#eae6fb]/40"
            >
              Explore Properties
              <FaArrowRight className="text-base" />
            </Link>
            <Link
              to="/contact"
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border border-[#eae6fb]/30"
            >
              Contact Us
              <FaArrowRight className="text-base" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <svg
            className="w-8 h-8 text-[#d1c28f] opacity-70"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;