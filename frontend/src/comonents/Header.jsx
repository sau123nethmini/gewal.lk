import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div
            className='flex flex-col md:flex-row flex-wrap bg-purple-500 rounded-lg px-6 md:px-10 lg:px-20 mt-5'
            style={{
                backgroundImage: `url(${assets.header_img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.5)',
                backgroundBlendMode: 'overlay, multiply'
            }}>

            {/* Header left side*/}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-5 md:py-[10vw] md:mb-[-30px] text-left'>
                <p className='text-3xl md:text-4xl lg:text-5xl text-purple-500 font-semibold leading-tight'>
                    Book Appointment
                    <br />
                    within your finger tips
                </p>
                <div className='flex flex-col md:flex-row items-start gap-3 mt-4 text-black text-sm font-light'>
                    <img className='w-28' src={assets.group_profiles} alt="" />
                    <p>
                        Simply browse through our list of trusted sellers,
                        <br className='hidden sm:block' />
                        schedule your appointment hassle-free
                    </p>
                </div>
                <a href="#speciality" className='flex items-center gap-3 bg-purple-500 px-8 py-3 rounded-full text-white text-sm md:mr-auto hover:scale-105 transition-all duration-300'>
                    Book Appointment
                    <img className="w-5" src={assets.arrow_icon} alt="" />
                </a>
            </div>
        </div>
    )
}

export default Header
