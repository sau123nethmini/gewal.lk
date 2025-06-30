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
      <p className='text-gray-600 mt-5'>Browse through the property type.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

      <button className={`py-1 px-3 border rounded text-sm transition-all sn:hidden ${showFilter? 'bg-purple-400 text-white' : ''}`} onClick={()=>setShowFilter(prev => !prev)}>Filters</button>

        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>

          <p onClick={()=> type === 'House' ? navigate('/property') : navigate('/property/House')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${type === "House" ? "bg-purple-400 text-white" : ""}`}>
            House
          </p>
          <p onClick={()=> type === 'Villa' ? navigate('/property') : navigate('/property/Villa')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${type === "Villa" ? "bg-purple-400 text-white" : ""}`}>
            Vila
          </p>
          <p onClick={()=> type === 'Apartment' ? navigate('/property') : navigate('/property/Apartment')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${type === "Apartment" ? "bg-purple-400 text-white" : ""}`}>
            Apartment
          </p>
          <p onClick={()=> type === 'Land' ? navigate('/property') : navigate('/property/Land')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${type === "Land" ? "bg-purple-400 text-white" : ""}`}>
            Land
          </p>
          <p onClick={()=> type === 'Studio' ? navigate('/property') : navigate('/property/Studio')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${type === "Studio" ? "bg-purple-400 text-white" : ""}`}>
            Studio
          </p>
          <p onClick={()=> type === 'Office Area' ? navigate('/property') : navigate('/property/Office Area')}
            className={`w-[95vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${type === "Office Area" ? "bg-purple-400 text-white" : ""}`}>
            Office Area
          </p>
        

        </div>

        <div className='w-full grid grid-cols-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4  gap-y-6 px-3 sm:px-0'>
          {
            filterProp.map((item,index) =>(
              <div 
              onClick={()=>{navigate(`/appointment/${item._id}`)}} 
              className='border border-purple-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                  <img src={item.image} alt="" />
                  <div className='p-4'>
                      <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                          <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                          <p>Available</p>
                      </div>
                      <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                      <p className='text-gray-600 text-sm'>{item.type}</p>
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
