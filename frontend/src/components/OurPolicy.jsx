import React from 'react';
import {
  ShieldCheckIcon,
  CreditCardIcon,
  HomeIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';

const policies = [
  {
    icon: ShieldCheckIcon,
    title: "Property Warranty",
    desc: "Enjoy a 5-year warranty on new properties for total peace of mind.",
  },
  {
    icon: CreditCardIcon,
    title: "Flexible Payment Plan",
    desc: "Choose from flexible payment options to make your dream home a reality.",
  },
  {
    icon: HomeIcon,
    title: "Free Property Viewing",
    desc: "Book free viewings and explore properties with no obligation.",
  },
  {
    icon: ScaleIcon,
    title: "Legal Support",
    desc: "Our in-house experts guide you through every legal step with confidence.",
  },
];

const OurPolicy = () => (
  <section className="py-20 bg-[#F6F7FB] font-poppins">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-[#22223B] text-center mb-12">
        Our <span className="text-[#8E7BEF]">Policy</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {policies.map((policy, idx) => (
          <div
            key={policy.title}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-[#eceafd] text-center flex flex-col items-center animate-fade-in"
            style={{ animationDelay: `${0.08 * idx}s`, animationFillMode: "both" }}
          >
            <span className="inline-flex items-center justify-center bg-[#EAE6FB] mb-6 rounded-full w-16 h-16 shadow-sm">
              <policy.icon className="w-9 h-9 text-[#8E7BEF]" />
            </span>
            <h3 className="text-lg md:text-xl font-semibold text-[#22223B] mb-3">{policy.title}</h3>
            <p className="text-[#4A4E69] text-sm md:text-base">{policy.desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`
      @keyframes fade-in { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
      .animate-fade-in { animation: fade-in 1s cubic-bezier(.4,0,.2,1) both;}
      .font-poppins { font-family: 'Poppins', 'Inter', sans-serif;}
    `}</style>
  </section>
);

export default OurPolicy;