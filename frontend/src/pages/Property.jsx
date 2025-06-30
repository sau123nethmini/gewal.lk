import React, { useContext, useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Property = () => {

  const { type } = useParams();
  const [filterProp, setfilterProp] = useState([])
  const[showFilter, setShowFilter] =useState(false)
  const navigate = useNavigate()

  const { properties } = useContext(AppContext);

  const applyFilter = () => {
    if (type) {
      setfilterProp(properties.filter((prop) => prop.type === type));
    }
    else{
      setfilterProp(properties);
    }
  }

  useEffect(() => {
    applyFilter()
  }, [properties, type])

  return (
    <div>
    <p className='text-gray-700 mt-8 text-lg font-semibold'>Browse through the property type.</p>
    <div className='flex flex-col sm:flex-row items-start gap-6 mt-6'>
  
      {/* Filter Button (Mobile) */}
      <button
        className={`py-2 px-5 border rounded-lg text-base font-medium transition-all sm:hidden shadow ${
          showFilter ? 'bg-purple-500 text-white' : 'bg-white text-purple-500'
        }`}
        onClick={() => setShowFilter(prev => !prev)}
      >
        Filters
      </button>
  
      {/* Type Filters */}
      <div className={`flex flex-col gap-3 text-base text-gray-700 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
        <p
          onClick={() => type === 'House' ? navigate('/property') : navigate('/property/House')}
          className={`w-[92vw] sm:w-48 pl-4 py-2 border border-gray-300 rounded-lg transition-all cursor-pointer font-medium hover:border-purple-400 hover:text-purple-700 ${
            type === "House" ? "bg-purple-500 text-white border-purple-500 shadow" : "bg-white"
          }`}>
          House
        </p>
        <p
          onClick={() => type === 'Villa' ? navigate('/property') : navigate('/property/Villa')}
          className={`w-[92vw] sm:w-48 pl-4 py-2 border border-gray-300 rounded-lg transition-all cursor-pointer font-medium hover:border-purple-400 hover:text-purple-700 ${
            type === "Villa" ? "bg-purple-500 text-white border-purple-500 shadow" : "bg-white"
          }`}>
          Villa
        </p>
        <p
          onClick={() => type === 'Apartment' ? navigate('/property') : navigate('/property/Apartment')}
          className={`w-[92vw] sm:w-48 pl-4 py-2 border border-gray-300 rounded-lg transition-all cursor-pointer font-medium hover:border-purple-400 hover:text-purple-700 ${
            type === "Apartment" ? "bg-purple-500 text-white border-purple-500 shadow" : "bg-white"
          }`}>
          Apartment
        </p>
        <p
          onClick={() => type === 'Land' ? navigate('/property') : navigate('/property/Land')}
          className={`w-[92vw] sm:w-48 pl-4 py-2 border border-gray-300 rounded-lg transition-all cursor-pointer font-medium hover:border-purple-400 hover:text-purple-700 ${
            type === "Land" ? "bg-purple-500 text-white border-purple-500 shadow" : "bg-white"
          }`}>
          Land
        </p>
        <p
          onClick={() => type === 'Studio' ? navigate('/property') : navigate('/property/Studio')}
          className={`w-[92vw] sm:w-48 pl-4 py-2 border border-gray-300 rounded-lg transition-all cursor-pointer font-medium hover:border-purple-400 hover:text-purple-700 ${
            type === "Studio" ? "bg-purple-500 text-white border-purple-500 shadow" : "bg-white"
          }`}>
          Studio
        </p>
        <p
          onClick={() => type === 'Office Area' ? navigate('/property') : navigate('/property/Office Area')}
          className={`w-[92vw] sm:w-48 pl-4 py-2 border border-gray-300 rounded-lg transition-all cursor-pointer font-medium hover:border-purple-400 hover:text-purple-700 ${
            type === "Office Area" ? "bg-purple-500 text-white border-purple-500 shadow" : "bg-white"
          }`}>
          Office Area
        </p>
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
              </div>
            </div>
          ))
        }
      </div>
    </div>
  </div>
  )
}

export default Property
