import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaArrowRight, FaRegStar, FaRegSmileBeam } from 'react-icons/fa';

const media = [assets.hero11, assets.hero22, assets.herov];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Slider dot navigation
  const goToSlide = (idx) => setCurrentIndex(idx);

  return (
    <section className="relative h-[92vh] min-h-[650px] w-full overflow-hidden font-poppins">
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
        {/* Stronger gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#392e66]/80 via-[#8E7BEF]/40 to-[#d1c28f]/30 pointer-events-none" />
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {media.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 border-[#fff6d6] bg-white/60
            ${idx === currentIndex ? "scale-125 bg-gradient-to-r from-[#d1c28f] to-[#8E7BEF] shadow-md" : "opacity-70"}
            `}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Centered Content */}
      <div className="relative h-full flex items-center justify-center z-10">
        <div className="w-full max-w-3xl mx-auto px-6 py-12 bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#eae6fb]/20 flex flex-col items-center text-center space-y-8 animate-fade-in-up">
          {/* Badge */}
          <span className="inline-block bg-gradient-to-r from-[#8E7BEF] via-[#bfa9f8] to-[#A084E8] text-transparent bg-clip-text px-8 py-2 rounded-full text-base font-semibold shadow-md border border-[#eae6fb]/30 tracking-widest uppercase mb-2">
            Exclusive Collection
          </span>
          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight drop-shadow-xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d1c28f] via-[#fff6d6] to-[#8E7BEF] drop-shadow-[0_3px_24px_rgba(209,194,143,0.18)]">
              Luxury Living
            </span>{" "}
            Awaits You
          </h1>
          {/* Subtitle */}
          <p className="text-lg sm:text-2xl text-[#f3eefc] mb-2 max-w-xl leading-relaxed font-light mx-auto">
            Step into the world of sophistication with <span className="font-semibold text-[#F3E9C9]">gewal.lk</span>. Explore breathtaking estates and modern homes in Sri Lanka’s most coveted locations.
          </p>
          {/* Decorative Divider */}
          <div className="flex justify-center items-center space-x-1 mb-2">
            <FaRegStar className="text-[#d1c28f] text-lg animate-pulse" />
            <div className="w-12 h-1 bg-gradient-to-r from-[#d1c28f] via-[#bfa9f8] to-[#8E7BEF] rounded-full" />
            <FaRegStar className="text-[#d1c28f] text-lg animate-pulse" />
          </div>
          {/* Search Bar */}
          <div className="w-full">
            <div className="bg-white/40 backdrop-blur-xl border border-[#eae6fb]/40 rounded-2xl shadow-2xl p-4 w-full">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bfa9f8]" />
                  <input
                    type="text"
                    placeholder="Search by location…"
                    className="w-full bg-transparent border-none rounded-xl pl-12 pr-4 py-3 text-white placeholder-[#bfa9f8] focus:outline-none focus:ring-2 focus:ring-[#d1c28f]/80 font-medium shadow-inner transition-shadow"
                  />
                </div>
                <div className="flex-1 relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bfa9f8]" />
                  <select className="w-full bg-transparent border-none rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#d1c28f]/80 font-medium shadow-inner transition-shadow">
                    <option value="">Property Type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
                <button className="bg-gradient-to-r from-[#d1c28f] to-[#8E7BEF] hover:from-[#8E7BEF] hover:to-[#d1c28f] text-[#392e66] font-bold px-8 py-3 rounded-xl shadow-lg text-lg uppercase tracking-wider transition-all duration-300 hover:scale-110 border border-[#d1c28f]/30 focus:ring-4 focus:ring-[#d1c28f]/50">
                  Search
                </button>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-7 w-full mt-1 mb-2">
            {[
              { num: "500+", label: "Properties" },
              { num: "100+", label: "Locations" },
              { num: "10K+", label: "Happy Clients" },
              { num: <span className="flex items-center gap-1">24/7 <FaRegSmileBeam className="ml-1 text-[#d1c28f]" /></span>, label: "Support" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center bg-white/10 rounded-xl p-3 backdrop-blur-md shadow-inner ring-1 ring-white/10">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d1c28f] to-[#8E7BEF] drop-shadow-glow animate-fade-in-up">{stat.num}</div>
                <div className="text-sm text-[#f3eefc] tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
            <Link
              to="/properties"
              className="bg-gradient-to-r from-[#d1c28f] to-[#8E7BEF] hover:from-[#8E7BEF] hover:to-[#d1c28f] text-[#392e66] px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center gap-2 border border-[#eae6fb]/40 focus:ring-4 focus:ring-[#d1c28f]/30"
            >
              Explore Properties
              <FaArrowRight className="text-base" />
            </Link>
            <Link
              to="/contact"
              className="bg-white/30 hover:bg-white/50 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow transition-all duration-300 transform hover:scale-110 flex items-center gap-2 border border-[#eae6fb]/30 focus:ring-4 focus:ring-[#fff6d6]/30"
            >
              Contact Us
              <FaArrowRight className="text-base" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20">
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
      {/* Optional: floating shapes for extra flair */}
      {/* <div className="absolute top-10 left-10 w-24 h-24 bg-[#d1c28f]/10 rounded-full blur-2xl animate-pulse" /> */}
    </section>
  );
};

export default Hero;

/* Add this to your CSS for the fade-in-up animation and drop-shadow-glow if not already defined: */