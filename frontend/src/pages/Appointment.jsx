import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Appointment = () => {

  const { propId } = useParams();
  const { properties } = useContext(AppContext);

  const [propInfo, setPropInfo] = useState(null);

  const fetchPropInfo = async () => {
    const propInfo = properties.find(prop => prop._id === propId);
    setPropInfo(propInfo);
    console.log(propInfo);
  }

  useEffect(() => {
    fetchPropInfo();
  }, [properties, propId])

  return propInfo && (
    <div>

      {/* Property Details */}
      <div className='flex flex-col sm:flex-row gap-4 mt-10'>

        <div>
          <img className='bg-indigo-500 w-full sm:max-w-72 rounded-lg' src={propInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-1000 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

          {/*Property info : Name, Degree, Experience*/}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {propInfo.name}
            <img className='w-10' src={assets.verify} alt="" />
          </p>

          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{propInfo.type}</p>
            <p></p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{propInfo.since}</button>
          </div>

          {/*Property about*/}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>description
            <img className='w-7' src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{propInfo.description}</p>
          </div>
          {/*Location*/}
          <div>
            <p className='text-gray-500 font-medium mt-4'>Location:</p>
            <p className='text-gray-600'>{propInfo.location.line1}, {propInfo.location.line2}</p>
          </div>
          {/*Property Features*/}
          <div>
            <p className='text-gray-500 font-medium mt-4'>Features:</p>
            <ul className='list-disc ml-5 text-gray-600'>
              {propInfo.features.map((feature, index) => (
                <li key={index} className='text-sm'>{feature}</li>
              ))}
            </ul>
          </div>

          {/*Property Price*/}
          <div>
            <p className='text-gray-500 font-medium mt-4'>
              Price:
              <span className='text-gray-600'>{propInfo.price}</span>
            </p>
          </div>
        </div>
      </div>



    </div>
  )
}

export default Appointment

