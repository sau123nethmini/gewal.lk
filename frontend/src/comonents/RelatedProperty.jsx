import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const RelatedProperty = ({ type, propId }) => {
  const { properties } = useContext(AppContext);
  const navigate = useNavigate();

  const [relProp, setRelProp] = useState([]);

  useEffect(() => {
    if (properties.length > 0 && type) {
      const propertiesData = properties.filter(
        (prop) => prop.type === type && prop._id !== propId
      );
      setRelProp(propertiesData);
      console.log(propertiesData); // Debugging
    }
  }, [properties, type, propId]);

  return (
    <div className="flex flex-col items-center gap-6 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-bold tracking-tight">Top Properties to Look</h1>
      <p className="sm:w-2/3 text-center text-base text-gray-600">
        Discover the best properties that match your dreams and lifestyle. Browse top-rated homes and find your perfect place to call home!
      </p>

      <div className="w-full grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 px-3 sm:px-0">
        {relProp.slice(0, 4).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group border border-purple-200 rounded-2xl overflow-hidden cursor-pointer bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-300 shadow"
            key={index}
            tabIndex={0}
            aria-label={`View ${item.name || 'Property'}`}
          >
            <img
              src={item.image || "default-image.jpg"}
              alt={item.name || "Property"}
              className="object-cover w-full h-44 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-green-600 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                <span>Available</span>
              </div>
              <p className="text-gray-900 text-lg font-semibold truncate">{item.name || "Unknown Name"}</p>
              <p className="text-gray-500 text-sm">{item.type || "Unknown Type"}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate(`/property`);
          scrollTo(0, 0);
        }}
        className="bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white px-12 py-3 rounded-full mt-10 text-base font-semibold shadow transition-all duration-200"
      >
        More
      </button>
    </div>
  );
};

export default RelatedProperty;