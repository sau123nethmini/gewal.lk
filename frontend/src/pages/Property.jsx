import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const PROPERTY_TYPES = [
  "House",
  "Villa",
  "Apartment",
  "Land",
  "Studio",
  "Office Area"
];

const Property = () => {
  const { type } = useParams();
  const [filterProp, setfilterProp] = useState([])
  const navigate = useNavigate()

  const { properties, currencySymbol } = useContext(AppContext);

  const applyFilter = () => {
    if (type) {
      setfilterProp(properties.filter((prop) => prop.type === type));
    } else {
      setfilterProp(properties);
    }
  }

  useEffect(() => {
    applyFilter()
  }, [properties, type])

  return (
    <div>
      {/* Filters at the top */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 mb-8">
        <p className='text-gray-700 text-lg font-semibold mb-2 sm:mb-0'>
          Browse by property type:
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            className={`px-8 py-2.5 rounded-full font-semibold text-base transition-all duration-200 shadow-sm border
      ${!type
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md border-transparent hover:from-purple-600 hover:to-indigo-600 scale-105'
                : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-700'}
    `}
            onClick={() => navigate('/property')}
          >
            All
          </button>
          {PROPERTY_TYPES.map(ptype => (
            <button
              key={ptype}
              className={`px-8 py-2.5 rounded-full font-semibold text-base transition-all duration-200 shadow-sm border
        ${type === ptype
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md border-transparent hover:from-purple-600 hover:to-indigo-600 scale-105'
                  : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-700'}
      `}
              onClick={() => navigate(`/property/${ptype}`)}
            >
              {ptype}
            </button>
          ))}
        </div>
      </div>

      {/* Property Grid */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2 sm:px-0'>
        {
          filterProp.map((item, index) => (
            <div
              onClick={() => { navigate(`/appointment/${item._id}`) }}
              className='border border-purple-300 rounded-2xl overflow-hidden cursor-pointer bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-300'
              key={index}
            >
              <img src={item.image} alt="" className='object-cover w-full h-48' />
              <div className='p-4'>
                <div className='flex items-center gap-2 text-sm text-green-500 mb-1'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  <span>Available</span>
                </div>
                <p className='text-gray-900 text-lg font-semibold'>{item.name}</p>
                <p className='text-gray-500 text-sm'>{item.type}</p>
                {/* Price display */}
                {item.price !== undefined && item.price !== null && (
                  <p className='text-purple-600 text-xl text-base font-bold mt-1'>
                    {currencySymbol} {item.price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Property