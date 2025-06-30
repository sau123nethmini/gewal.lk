import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedProperty from '../comonents/RelatedProperty'

const Appointment = () => {

  const { propId } = useParams();
  const { properties, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [propInfo, setPropInfo] = useState(null);
  const [propSlots, setPropSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const fetchPropInfo = async () => {
    const propInfo = properties.find(prop => prop._id === propId);
    setPropInfo(propInfo);
  }

  const getAvailableSlots = async () => {
    setPropSlots([])

    //getting current date
    let today = new Date()
    let updatedSlots = [];

    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      //setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(19, 0, 0, 0)

      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 8 ? currentDate.getHours() + 1 : 8)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      }
      else {
        currentDate.setHours(8)
        currentDate.setMinutes(30)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        //add slot to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        //incrementing time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 120)
      }

      //setDocSlots(prev => [...prev, timeSlots])
      updatedSlots.push(timeSlots);

    }
    setPropSlots(updatedSlots);
  }

  useEffect(() => {
    fetchPropInfo();
  }, [properties, propId])

  useEffect(() => {
    getAvailableSlots()
  }, [propInfo])

  useEffect(() => {
    console.log(propSlots)
  }, [propSlots])

  return propInfo && (
    <div>

      {/* Property Details */}
      <div className='flex flex-col sm:flex-row gap-4 mt-10'>

        <div>
          <img className='bg-indigo-500 w-full sm:max-w-72 rounded-lg' src={propInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-1000 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

          {/*Property info : Name, Degree, Experience*/}
          <p className='flex items-center gap-2 text-2xl font-medium text-purple-500'>
            {propInfo.name}
            <img className='w-10' src={assets.verify} alt="" />
          </p>

          {/**/}
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-900'>
            <p>{propInfo.type}</p>
            <p></p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>Since - {propInfo.since}</button>
          </div>

          {/*Property description*/}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>Description
              <img className='w-5' src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{propInfo.description}</p>
          </div>
          {/*Location*/}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>Location:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{propInfo.location.line1}, {propInfo.location.line2}</p>
          </div>
          {/*Property Features*/}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>Features:</p>
            <ul className='list-disc ml-5 text-sm text-gray-600 max-w-[700px] mt-1'>
              {propInfo.features.map((feature, index) => (
                <li key={index} className='text-sm'>{feature}</li>
              ))}
            </ul>
          </div>

          {/*Property Price*/}
          <div>
            <p className='text-gray-900 font-medium mt-4'>
              Price :
              <span className='text-gray-700'> {currencySymbol} {propInfo.price}</span>
            </p>
          </div>
        </div>
      </div>

      {/*booking slots*/}
      <div className='flex flex-col items-center justify-center mt-5 font-medium text-gray-700'>
        <p className='text-2xl'>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4 justify-center'>
          {propSlots.length && propSlots.map((item, index) => (
            <div onClick={()=>setSlotIndex(index)}
            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-purple-400 text-white': 'border border-gray-200'}`} 
            key={index}>
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>
      </div>

      {/** Time Slots */}
      <div className='flex items-center gap-3 w-full overflow-x-auto mt-4 justify-center'>
        {propSlots.length && propSlots[slotIndex].map((item,index) => (
          <p className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-purple-400 text-white': 'text-gray-400 border border-gray-200'}`} 
          onClick={()=>setSlotTime(item.time)}
          key={index}>
            {item.time.toLowerCase()}
          </p>
        ))}
      </div>

      <button className='bg-purple-400 text-white text-sm font-light px-14 py-3 rounded-full my-6 block mx-auto'>Book an Appointment</button>
    
      {/*Listing Relaterd properties*/}
      <RelatedProperty propId={propId} type={propId.type}/>
    </div>
  )
}

export default Appointment

