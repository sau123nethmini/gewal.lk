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
    <section className="py-20 bg-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-[#22223B] mb-4">
              New <span className="text-[#8E7BEF]">Arrivals</span>
            </h2>
            <p className="text-[#4A4E69] max-w-2xl">
              Explore our latest additions to the property market. These premium listings are handpicked for their exceptional quality and value.
            </p>
          </div>
          <Link
            to="/properties"
            className="flex items-center gap-2 bg-[#8E7BEF] hover:bg-[#A084E8] text-white px-6 py-3 rounded-xl font-semibold shadow transition-all duration-300 hover:scale-105"
          >
            View All Properties
            <FaArrowRight className="text-sm" />
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newArrivals.map((item, index) => (
            <div
              key={item._id}
              className="group bg-[#F6F7FB] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${0.1 * index}s`, animationFillMode: "both" }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/2 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-[#8E7BEF] text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                    New
                  </span>
                  <span className="absolute bottom-4 right-4 bg-white/80 text-[#8E7BEF] px-3 py-1 rounded-full text-xs font-semibold border border-[#EAE6FB] shadow">
                    {item.type}
                  </span>
                </div>

                {/* Details Section */}
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[#F4C518] mb-2">
                      {[...Array(item.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold text-[#22223B] mb-1">{item.name}</h3>
                    <div className="flex items-center text-[#8E7BEF] text-sm mb-3">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{item.location}</span>
                    </div>
                    {/* Property Features */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-[#4A4E69]">
                      <div className="flex items-center gap-2 text-xs">
                        <FaBed className="text-[#8E7BEF]" />
                        <span>{item.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <FaBath className="text-[#8E7BEF]" />
                        <span>{item.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <FaRulerCombined className="text-[#8E7BEF]" />
                        <span>{item.area} sqft</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <FaCar className="text-[#8E7BEF]" />
                        <span>{item.parking} Parking</span>
                      </div>
                    </div>
                  </div>
                  {/* Price & CTA */}
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xl font-bold text-[#8E7BEF]">
                      LKR {item.price.toLocaleString()}
                    </span>
                    <Link
                      to={`/product/${item._id}`}
                      className="text-[#8E7BEF] hover:text-[#A084E8] font-medium text-sm underline underline-offset-4"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button for Mobile */}
        <div className="mt-12 text-center md:hidden">
          <Link
            to="/properties"
            className="bg-[#8E7BEF] hover:bg-[#A084E8] text-white px-8 py-3 rounded-xl font-semibold shadow transition-all duration-300 inline-block"
          >
            View More Properties
          </Link>
        </div>
      </div>

      {/* Fade-in Animation */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(24px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 1.1s cubic-bezier(.4,0,.2,1) both;}
        .font-poppins { font-family: 'Poppins', 'Inter', sans-serif;}
      `}</style>
    </section>
  );
};

export default BestSeller;