import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedProperty from '../comonents/RelatedProperty';

const Appointment = () => {
  const { propId } = useParams();
  const { properties, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [propInfo, setPropInfo] = useState(null);
  const [propSlots, setPropSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const fetchPropInfo = () => {
    const propInfo = properties.find(prop => prop._id === propId);
    setPropInfo(propInfo);
  };

  const getAvailableSlots = () => {
    setPropSlots([]);

    let today = new Date();
    let updatedSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(19, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 8 ? currentDate.getHours() + 1 : 8);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(8);
        currentDate.setMinutes(30);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 60);
      }

      updatedSlots.push(timeSlots);
    }
    setPropSlots(updatedSlots);
  };

  useEffect(() => {
    fetchPropInfo();
  }, [properties, propId]);

  useEffect(() => {
    if (propInfo) {
      getAvailableSlots();
    }
  }, [propInfo]);

  useEffect(() => {
    console.log(propSlots);
  }, [propSlots]);

  if (!propInfo) {
    return <p>Loading property details...</p>;
  }

  return (
    <div>
      {/* Property Details */}
      <div className='flex flex-col sm:flex-row gap-6 mt-10'>
        {/* Image Section */}
        <div>
          <img className='bg-indigo-500 w-full sm:max-w-72 rounded-lg shadow-lg' src={propInfo.image} alt='' />
        </div>

        {/* Property Info Section */}
        <div className='flex-1 border border-gray-300 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 shadow-md'>
          {/* Property Name */}
          <p className='flex items-center gap-2 text-3xl font-bold text-purple-600'>
            {propInfo.name}
            <img className='w-8' src={assets.verify} alt='' />
          </p>

          {/* Property Type and Since */}
          <div className='flex items-center gap-2 text-base mt-2 text-gray-800'>
            <p className='font-medium'>{propInfo.type}</p>
            <button className='py-1 px-3 border border-gray-300 text-sm rounded-full bg-gray-100'>Since - {propInfo.since}</button>
          </div>

          {/* Property Description */}
          <div className='mt-4'>
            <p className='flex items-center gap-1 text-lg font-semibold text-gray-900'>Description</p>
            <p className='text-base text-gray-600 max-w-[700px] mt-2'>{propInfo.description}</p>
          </div>

          {/* Location */}
          <div className='mt-4'>
            <p className='text-lg font-semibold text-gray-900'>Location:</p>
            <p className='text-base text-gray-600 max-w-[700px] mt-2'>{propInfo.location.line1}, {propInfo.location.line2}</p>
          </div>

          {/* Features */}
          <div className='mt-4'>
            <p className='text-lg font-semibold text-gray-900'>Features:</p>
            <ul className='list-disc ml-5 text-base text-gray-600 max-w-[700px] mt-2'>
              {propInfo.features.map((feature, index) => (
                <li key={index} className='text-base'>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className='mt-4'>
            <p className='text-lg font-semibold text-gray-900'>
              Price:
              <span className='text-xl font-bold text-gray-700 ml-2'>{currencySymbol} {propInfo.price}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='flex flex-col items-center justify-center mt-5 font-medium text-gray-700'>
        <p className='text-2xl'>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4 justify-center'>
          {propSlots.length > 0 && propSlots.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-[4rem] rounded-full cursor-pointer ${slotIndex === index ? 'bg-purple-400 text-white' : 'border border-gray-200'}`}
              key={index}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div className='flex items-center gap-3 w-full overflow-x-auto mt-4 justify-center'>
        {propSlots.length > 0 && propSlots[slotIndex].map((item, index) => (
          <p
            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-purple-400 text-white' : 'text-gray-400 border border-gray-200'}`}
            onClick={() => setSlotTime(item.time)}
            key={index}
          >
            {item.time.toLowerCase()}
          </p>
        ))}
      </div>

      <button className='bg-purple-400 text-white text-sm font-light px-14 py-3 rounded-full my-6 block mx-auto'>Book an Appointment</button>

      {/* Listing Related Properties */}
      <RelatedProperty propId={propId} type={propInfo?.type} />
    </div>
  );
};

export default Appointment;