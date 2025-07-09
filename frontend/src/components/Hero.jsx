import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

// Minimal typewriter effect for elegance
const useTypedText = (texts, speed = 70, delay = 1500) => {
  const [displayed, setDisplayed] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typing;
    if (!isDeleting && charIdx <= texts[textIdx].length) {
      typing = setTimeout(() => {
        setDisplayed(texts[textIdx].slice(0, charIdx));
        setCharIdx((idx) => idx + 1);
      }, speed);
    } else if (!isDeleting && charIdx > texts[textIdx].length) {
      typing = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && charIdx >= 0) {
      typing = setTimeout(() => {
        setDisplayed(texts[textIdx].slice(0, charIdx));
        setCharIdx((idx) => idx - 1);
      }, speed / 2);
    } else if (isDeleting && charIdx < 0) {
      setIsDeleting(false);
      setTextIdx((idx) => (idx + 1) % texts.length);
      setCharIdx(0);
    }
    return () => clearTimeout(typing);
  }, [charIdx, isDeleting, textIdx, texts, speed, delay]);
  return displayed;
};

// Animated Counter Hook
function useCountUp(to, duration = 1100) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [to, duration]);
  return count;
}

const media = [assets.hero11, assets.hero22, assets.herov];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simple animated headline
  const animatedText = useTypedText([
    "Your Dream Property Awaits",
    "Discover Iconic Homes in Prime Locations",
    "Live the Life You Deserve — Starting at Home",
    "Experience Luxury Living in Sri Lanka",
    "Where Your Property Dreams Come True",
    "Elevate Your Lifestyle with Our Exclusive Estates",
  ]);

  // Animated stats
  const Properties = useCountUp(500);
  const Locations = useCountUp(100);
  const Clients = useCountUp(10000);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="relative h-[90vh] min-h-[540px] w-full overflow-hidden font-poppins flex items-center bg-white">
      {/* Background Media (only one at a time, soft fade) */}
      <div className="absolute inset-0 w-full h-full z-0">
        {media.map((item, index) =>
          item.endsWith(".mp4") ? (
            <video
              key={index}
              src={item}
              autoPlay
              loop
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
            />
          ) : (
            <img
              key={index}
              src={item}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
            />
          )
        )}
        {/* Soft white overlay for clarity */}
        <div className="absolute inset-0 bg-white/70" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 flex flex-col items-center text-center">
        
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-purple-600 mb-6">
          {animatedText}
        </h1>
        <p className="text-base sm:text-lg text-[#43387f] mb-8 max-w-xl mx-auto font-bold">
          Step into the world of sophistication with{" "}
          <span className="font-bold text-purple-600 ">gewal.lk</span>.
          Discover breathtaking estates and modern homes in Sri Lanka’s most coveted locations.
        </p>

        {/* Search Section */}
        <div className="w-full max-w-xl bg-white/90 border border-purple-600 rounded-2xl shadow-md p-4 sm:p-5 flex flex-col sm:flex-row gap-3 mb-7">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A084E8] opacity-80 text-lg" />
            <input
              type="text"
              placeholder="Search by location…"
              className="w-full bg-transparent border-none rounded-xl pl-10 pr-3 py-2.5 text-[#392e66] placeholder-[#bfa9f8] focus:outline-none focus:ring-2 focus:ring-[#8E7BEF]/40 font-medium transition"
            />
          </div>
          <div className="relative flex-1">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A084E8] opacity-80 text-lg" />
            <select className="w-full bg-transparent border-none rounded-xl pl-10 pr-3 py-2.5 text-[#392e66] focus:outline-none focus:ring-2 focus:ring-[#8E7BEF]/40 font-medium transition">
              <option value="" className="text-black">Property Type</option>
              <option value="house" className="text-black">House</option>
              <option value="apartment" className="text-black">Apartment</option>
              <option value="villa" className="text-black">Villa</option>
            </select>
          </div>
          <button className="w-full sm:w-auto block bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white font-bold px-7 py-2.5 rounded-xl shadow transition-all duration-150 text-base flex items-center justify-center gap-2">
            Search <FaArrowRight />
          </button>
        </div>

        {/* Stats - Animated Counters */}
        <div className="w-full max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 mb-7">
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">{Properties}+</div>
            <div className="text-xs sm:text-sm text-[#43387f] font-medium">Properties</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">{Locations}+</div>
            <div className="text-xs sm:text-sm text-[#43387f] font-medium">Locations</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">{Clients.toLocaleString()}+</div>
            <div className="text-xs sm:text-sm text-[#43387f] font-medium">Happy Clients</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">24/7</div>
            <div className="text-xs sm:text-sm text-[#43387f] font-medium">Support</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/properties"
            className="block bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white px-7 py-3 rounded-xl text-base font-semibold shadow-sm transition-all duration-150 flex items-center justify-center gap-2"
            
          >
            Explore Properties <FaArrowRight />
          </Link>
          <Link
            to="/contact"
            className="bg-white border border-[#edeafd] text-purple-600 px-7 py-3 rounded-xl text-base font-semibold shadow-sm transition-all duration-150 flex items-center justify-center gap-2"
          >
            Contact Us <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;