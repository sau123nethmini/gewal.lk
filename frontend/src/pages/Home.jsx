import React from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import ChatBot from '../components/ChatBot';
import { FaHome, FaShieldAlt, FaHandshake, FaHeadset } from 'react-icons/fa';

const features = [
  {
    icon: <FaHome className="w-12 h-12 mx-auto text-[#8E7BEF] mb-4" />,
    title: "Premium Properties",
    desc: "Discover our exclusive collection of luxury properties"
  },
  {
    icon: <FaShieldAlt className="w-12 h-12 mx-auto text-[#8E7BEF] mb-4" />,
    title: "Secure Transactions",
    desc: "Safe and reliable property transactions"
  },
  {
    icon: <FaHandshake className="w-12 h-12 mx-auto text-[#8E7BEF] mb-4" />,
    title: "Expert Guidance",
    desc: "Professional support throughout your journey"
  },
  {
    icon: <FaHeadset className="w-12 h-12 mx-auto text-[#8E7BEF] mb-4" />,
    title: "24/7 Support",
    desc: "Always here to help you"
  }
];

const Home = () => {
  return (
    <div className="overflow-hidden font-poppins bg-[#F6F7FB]">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((f, idx) => (
              <div
                key={f.title}
                className="text-center p-8 rounded-3xl bg-[#F6F7FB] hover:bg-[#EAE6FB] transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${0.2 * idx}s`, animationFillMode: "both" }}
              >
                {f.icon}
                <h3 className="text-xl font-semibold mb-2 text-[#4A4E69]">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Properties Section */}
      <LatestCollection />

      {/* Best Sellers Section */}
      <BestSeller />

      {/* Our Policy Section */}
      <OurPolicy />

      {/* Newsletter Section */}
      <NewsletterBox />

      {/* Chatbot */}
      <ChatBot />

      {/* Animations (fade-in) */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(.4,0,.2,1) both;}
      `}</style>
    </div>
  );
};

export default Home;