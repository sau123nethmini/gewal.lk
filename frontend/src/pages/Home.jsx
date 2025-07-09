import React, { useRef, useEffect } from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import PropertyTypes from '../components/PropertyTypes';
import NewsletterBox from '../components/NewsletterBox';
import ChatBot from '../components/ChatBot';
import WhyChooseUs from '../components/WhyChooseUs';


// Custom hook for scroll-reveal animation
function useScrollReveal(className = "reveal-on-scroll") {
  const refs = useRef([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reveal = () => {
      refs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add("animate-reveal-pop");
        }
      });
    };
    reveal();
    window.addEventListener("scroll", reveal);
    return () => window.removeEventListener("scroll", reveal);
  }, []);
  return refs;
}

const Home = () => {
  const featureRefs = useScrollReveal();

  return (
    <div className="overflow-hidden font-poppins">
      {/* Hero Section */}
      <Hero />

      {/* Latest Properties Section */}
      <LatestCollection />

      {/*what is gewal.lk*/}
      <WhyChooseUs />

      {/* Best Sellers Section */}
      <BestSeller />

      {/* Property Types Section */}
      <PropertyTypes />

      {/* Newsletter Section */}
      <NewsletterBox />

      {/* Chatbot */}
      <ChatBot />

      {/* Animations (fade-in, custom, scroll reveal, hover) */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(.4,0,.2,1) both;}

        @keyframes bounce-slow {
          0%,100% { transform: translateY(0);}
          50% { transform: translateY(-12px);}
        }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }

        @keyframes spin-slow {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .animate-spin-slow { animation: spin-slow 5s linear infinite; }

        @keyframes wiggle {
          0%,100% { transform: rotate(-8deg);}
          50% { transform: rotate(8deg);}
        }
        .animate-wiggle { animation: wiggle 1.5s ease-in-out infinite; }

        @keyframes pulse-slow {
          0%,100% { opacity: 1;}
          50% { opacity: 0.5;}
        }
        .animate-pulse-slow { animation: pulse-slow 2s infinite; }

        @keyframes reveal-pop {
          0% { opacity: 0; transform: translateY(60px) scale(.85);}
          60% { opacity: 1;}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-reveal-pop {
          animation: reveal-pop .85s cubic-bezier(.4,0,.2,1) both;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default Home;