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
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Properties to Look</h1>
      <p className='sm:w-2/3 text-center text-sm'>
        Discover the best properties that match your dreams and lifestyle. Browse top-rated homes and find your perfect place to call home!
      </p>

      <div className='w-full grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relProp.slice(0, 4).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className='border border-purple-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-2 transition-all duration-500'
            key={index}
          >
            <img src={item.image || 'default-image.jpg'} alt={item.name || 'Property'} />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                <p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name || 'Unknown Name'}</p>
              <p className='text-gray-600 text-sm'>{item.type || 'Unknown Type'}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate(`/property`);
          scrollTo(0, 0);
        }}
        className='bg-purple-400 text-white px-12 py-3 rounded-full mt-10'
      >
        More
      </button>
    </div>
  );
};

export default RelatedProperty;