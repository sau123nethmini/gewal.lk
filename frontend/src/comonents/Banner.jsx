import React, { use } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <div className='flex bg-purple-400 rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mt-10'
            style={{
                backgroundImage: `url(${assets.appointment_img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0.5)',
                backgroundBlendMode: 'overlay, multiply'
            }}>
            {/* Left side of the Banner */}
            <div className='flex-1 flex flex-col items-center justify-center py-8 sm:py-10 md:py-16 lg:py-24'>
                <div className='text-center text-xl sm:text-2xl md:text-3xl lg:text-5xl text-purple-400 font-semibold'>
                    <p>Book Appointment</p>
                    <p className='mt-4'>With 100+ Trusted Property Sellers</p>
                </div>

                <button onClick={() => { navigate('/Login'); scrollTo(0, 0) }}
                    className='bg-white text-sm sm:text-base text-purple-400 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'>
                    Create Account
                </button>
            </div>
        </div>
    )
}

export default Banner
