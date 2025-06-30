import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopProperties = () => {

    const navigate = useNavigate();
    const { properties } = useContext(AppContext);
    

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>Top Houser to Look</h1>
        <p className='sm:w-2/3 text-center text-sm'>
            Discover the best properties that match your dreams and lifestyle. Browse top-rated homes and find your perfect place to call home!
        </p>

        <div className='w-full grid grid-cols-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {properties.slice(0,10).map((item,index) =>(
                <div 
                onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} 
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
            ))}
        </div>

        <button onClick={()=>{navigate(`/property`);scrollTo(0,0)}} className='bg-purple-400 text-white px-12 py-3 rounded-full mt-10'>More</button>   

    </div>
  )
}

export default TopProperties
