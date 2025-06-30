import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='bg-purple-100 rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 pt-10 pb-8 my-20 md:mt-10 shadow-lg'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm'>
        {/* Left side of Footer */}
        <div>
          <img className='mb-5 w-40' src={assets.gewal} alt="Logo" />
          <p className='w-full md:w-2/3 text-gray-700 leading-6'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
          </p>
        </div>

        {/* Middle side of Footer */}
        <div>
          <p className='text-xl font-semibold mb-5 text-purple-600'>Company</p>
          <ul className='flex flex-col gap-2 text-gray-700'>
            <li className='hover:text-purple-500 cursor-pointer'>Home</li>
            <li className='hover:text-purple-500 cursor-pointer'>About Us</li>
            <li className='hover:text-purple-500 cursor-pointer'>Contact Us</li>
            <li className='hover:text-purple-500 cursor-pointer'>Privacy Policy</li>
          </ul>
        </div>

        {/* Right side of Footer */}
        <div>
          <p className='text-xl font-semibold mb-5 text-purple-600'>Get in Touch</p>
          <ul className='flex flex-col gap-2 text-gray-700'>
            <li className='hover:text-purple-500 cursor-pointer'>+94-777777777</li>
            <li className='hover:text-purple-500 cursor-pointer'>gewal.lk@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        {/* Copyright text */}
        <hr className='border-gray-300 mb-5' />
        <p className='text-sm text-center text-gray-600'>
          Copyright © 2024 GreatStack - All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
