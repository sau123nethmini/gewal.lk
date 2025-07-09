import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import {
  FaArrowRight, FaStar, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCar
} from 'react-icons/fa';
import { assets } from '../assets/assets';

const LatestCollection = () => {
  const { products } = useContext(ShopContext) || {};
  const [latestProducts] = useState(products && products.length ? products.slice(0, 4) : [
    {
      _id: '1',
      name: 'Luxury Villa in Colombo 7',
      type: 'Villa',
      location: 'Colombo 7, Sri Lanka',
      price: 45000000,
      bedrooms: 5,
      bathrooms: 4,
      area: 4500,
      parking: 3,
      image: assets.p_img1,
      rating: 5
    },
    {
      _id: '2',
      name: 'Modern Apartment in Kotte',
      type: 'Apartment',
      location: 'Kotte, Sri Lanka',
      price: 25000000,
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      parking: 2,
      image: assets.p_img2_1,
      rating: 4
    },
    {
      _id: '3',
      name: 'Beachfront House in Galle',
      type: 'House',
      location: 'Galle, Sri Lanka',
      price: 35000000,
      bedrooms: 4,
      bathrooms: 3,
      area: 3000,
      parking: 2,
      image: assets.p_img3,
      rating: 5
    },
    {
      _id: '4',
      name: 'Penthouse in Colombo 3',
      type: 'Penthouse',
      location: 'Colombo 3, Sri Lanka',
      price: 55000000,
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      parking: 2,
      image: assets.p_img4,
      rating: 5
    }
  ]);

  return (
    <section className="py-20 bg-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-[#22223B] mb-4">
              Latest <span className="text-purple-500">Properties</span>
            </h2>
            <p className="text-[#4A4E69] max-w-2xl">
              Discover our newest and most exclusive properties. Each selection is carefully curated to offer you the best in modern living.
            </p>
          </div>
          <Link
            to="/properties"
            className="flex items-center gap-2 bg-[#8E7BEF] hover:bg-[#A084E8] text-white px-6 py-3 rounded-lg font-semibold shadow transition-all duration-300 hover:scale-105"
          >
            View All Properties
            <FaArrowRight className="text-sm" />
          </Link>
        </div>

        {/* Properties Horizontal Scroll */}
        <div className="overflow-x-auto hide-scrollbar pb-4">
          <div className="flex gap-8 min-w-max">
            {latestProducts.map((item, index) => (
              <div
                key={item._id}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in flex-shrink-0 w-[320px]"
                style={{ animationDelay: `${0.1 * index}s`, animationFillMode: "both" }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-[#8E7BEF] text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                    New
                  </span>
                  <span className="absolute bottom-4 right-4 bg-white/80 text-[#8E7BEF] px-3 py-1 rounded-full text-xs font-semibold border border-[#EAE6FB] shadow">
                    {item.type}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col justify-between h-[275px]">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-[#F4C518] mb-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    {/* Name */}
                    <h3 className="text-lg font-bold text-[#22223B] mb-1 truncate">{item.name}</h3>
                    {/* Location */}
                    <div className="flex items-center text-[#8E7BEF] text-sm mb-3 font-medium">
                      <FaMapMarkerAlt className="mr-1" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    {/* Features */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-[#4A4E69] text-sm">
                      <div className="flex items-center gap-2">
                        <FaBed className="text-[#8E7BEF]" />
                        <span>
                          <span className="font-semibold">{item.bedrooms}</span> Beds
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaBath className="text-[#8E7BEF]" />
                        <span>
                          <span className="font-semibold">{item.bathrooms}</span> Baths
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaRulerCombined className="text-[#8E7BEF]" />
                        <span>
                          <span className="font-semibold">{item.area}</span> sqft
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCar className="text-[#8E7BEF]" />
                        <span>
                          <span className="font-semibold">{item.parking}</span> Parking
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Price & CTA */}
                  <div className="flex justify-between items-center border-t pt-4 border-[#eee]">
                    <span className="text-xl font-extrabold text-[#8E7BEF] tracking-tight">
                      LKR {item.price.toLocaleString()}
                    </span>
                    <Link
                      to={`/product/${item._id}`}
                      className="text-[#8E7BEF] hover:text-[#A084E8] font-bold text-sm underline underline-offset-4 transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile "View More" Button */}
        <div className="mt-12 text-center md:hidden">
          <Link
            to="/properties"
            className="bg-[#8E7BEF] hover:bg-[#A084E8] text-white px-8 py-3 rounded-lg font-semibold shadow transition-all duration-300 inline-block"
          >
            View More Properties
          </Link>
        </div>
      </div>

      {/* Fade-in Animation and Hide Scrollbar */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(24px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 1.1s cubic-bezier(.4,0,.2,1) both;}
        .font-poppins { font-family: 'Poppins', 'Inter', sans-serif;}
        /* Hide scrollbar for all browsers */
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </section>
  );
};

export default LatestCollection;