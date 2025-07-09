import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaStar,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCar,
} from 'react-icons/fa';
import { assets } from '../assets/assets';

const BestSeller = () => {
  const { products } = useContext(ShopContext) || {};
  const [newArrivals] = useState([
    {
      _id: '5',
      name: 'Luxury Condo in Mount Lavinia',
      type: 'Condo',
      location: 'Mount Lavinia, Sri Lanka',
      price: 38000000,
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      parking: 2,
      image: assets.p_img1,
      rating: 5,
    },
    {
      _id: '6',
      name: 'Modern Townhouse in Negombo',
      type: 'Townhouse',
      location: 'Negombo, Sri Lanka',
      price: 28000000,
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      parking: 2,
      image: assets.p_img2_1,
      rating: 4,
    },
    {
      _id: '7',
      name: 'Luxury Apartment in Colombo 5',
      type: 'Apartment',
      location: 'Colombo 5, Sri Lanka',
      price: 42000000,
      bedrooms: 3,
      bathrooms: 2,
      area: 2000,
      parking: 2,
      image: assets.p_img3,
      rating: 5,
    },
    {
      _id: '8',
      name: 'Beach Villa in Bentota',
      type: 'Villa',
      location: 'Bentota, Sri Lanka',
      price: 48000000,
      bedrooms: 5,
      bathrooms: 4,
      area: 4000,
      parking: 3,
      image: assets.p_img4,
      rating: 5,
    },
  ]);

  return (
    <section className="py-16 bg-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-4xl font-extrabold text-black mb-3 tracking-tight drop-shadow-sm">
              Discover <span className="text-purple-500">New Arrivals</span>
            </h2>
            <p className="text-[#4A4E69] max-w-2xl text-lg opacity-90">
              Handpicked premium properties, just listed for you. Find your perfect home from our latest selection.
            </p>
          </div>
          <Link
            to="/properties"
            className="flex items-center gap-2 bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white px-7 py-3 rounded-full font-bold shadow-xl transition-transform duration-300 hover:scale-105"
          >
            View All Properties
            <FaArrowRight className="text-base" />
          </Link>
        </div>

        {/* Properties Grid - Dialog with Image style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {newArrivals.map((item, index) => (
            <div
              key={item._id}
              className="relative flex items-stretch bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden p-0 animate-fade-in hover:shadow-2xl transition-all duration-300"
              style={{ animationDelay: `${0.1 * index + 0.05}s`, animationFillMode: "both" }}
            >
              {/* Image as dialog-side */}
              <div className="flex-shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-4 border-[#EAE6FB] shadow-lg bg-white ml-4 mr-4 md:ml-8 md:mr-8 my-6 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                />
                <span className="absolute top-2 left-2 bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl tracking-wide animate-pop-in z-10">
                  New
                </span>
              </div>
              {/* Dialog bubble/content */}
              <div className="flex-1 flex flex-col justify-between p-6 pr-8">
                <div>
                  <div className="flex items-center gap-1 text-[#F4C518] mb-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} className="drop-shadow" />
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold text-[#322653] mb-2">{item.name}</h3>
                  <div className="flex items-center text-[#8E7BEF] text-base mb-4 font-semibold">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{item.location}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-5">
                    <div className="flex items-center gap-2 text-base text-[#444]">
                      <FaBed className="text-[#8E7BEF]" />
                      <span>{item.bedrooms} <span className="font-medium text-[#7e6fc9]">Beds</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-base text-[#444]">
                      <FaBath className="text-[#8E7BEF]" />
                      <span>{item.bathrooms} <span className="font-medium text-[#7e6fc9]">Baths</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-base text-[#444]">
                      <FaRulerCombined className="text-[#8E7BEF]" />
                      <span>{item.area} <span className="font-medium text-[#7e6fc9]">sqft</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-base text-[#444]">
                      <FaCar className="text-[#8E7BEF]" />
                      <span>{item.parking} <span className="font-medium text-[#7e6fc9]">Parking</span></span>
                    </div>
                  </div>
                  <span className="inline-block bg-[#f6f0fe] text-[#8E7BEF] px-4 py-1 rounded-full text-xs font-bold border border-[#EAE6FB] shadow animate-pop-in mb-4">
                    {item.type}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-3">
                  <span className="text-2xl font-extrabold text-[#8E7BEF] tracking-tight drop-shadow">
                    LKR {item.price.toLocaleString()}
                  </span>
                  <Link
                    to={`/product/${item._id}`}
                    className="text-[#8E7BEF] hover:text-[#A084E8] font-bold text-base underline underline-offset-4 transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button for Mobile */}
        <div className="mt-14 text-center md:hidden">
          <Link
            to="/properties"
            className="bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white px-10 py-4 rounded-full font-bold shadow-xl transition-transform duration-300 inline-block"
          >
            View More Properties
          </Link>
        </div>
      </div>

      {/* Animations and Style */}
      <style>{`
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(30px) scale(0.94);}
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(.4,0,.2,1) both;}
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.75);}
          80% { opacity: 1; transform: scale(1.09);}
          100% { opacity: 1; transform: scale(1);}
        }
        .animate-pop-in { animation: pop-in 0.7s cubic-bezier(.4,0,.2,1) both;}
        .font-poppins { font-family: 'Poppins', 'Inter', sans-serif;}
      `}</style>
    </section>
  );
};

export default BestSeller;