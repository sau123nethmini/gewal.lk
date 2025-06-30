import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-500  rounded-2xl px-6 sm:px-10 md:px-14 lg:px-20 pt-12 pb-8 my-20 md:mt-10 shadow-2xl group">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
        {/* Left side of Footer */}
        <div>
          <img className="mb-6 w-44" src={assets.gewal_white} alt="Logo" />
          <p className="w-full md:w-2/3 text-white/90 leading-7 font-light">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
          </p>
        </div>

        {/* Middle side of Footer */}
        <div>
          <p className="text-xl font-bold mb-5 text-white tracking-wider">Company</p>
          <ul className="flex flex-col gap-3">
            <li
              className="cursor-pointer text-white hover:text-indigo-200 transition-all duration-200 text-base font-semibold"
              onClick={() => navigate('/')}
            >
              Home
            </li>
            <li
              className="cursor-pointer text-white hover:text-indigo-200 transition-all duration-200 text-base font-semibold"
              onClick={() => navigate('/about')}
            >
              About Us
            </li>
            <li
              className="cursor-pointer text-white hover:text-indigo-200 transition-all duration-200 text-base font-semibold"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </li>
            <li
              className="cursor-pointer text-white hover:text-indigo-200 transition-all duration-200 text-base font-semibold"
              onClick={() => navigate('/privacy')}
            >
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Right side of Footer */}
        <div>
          <p className="text-xl font-bold mb-5 text-white tracking-wider">Get in Touch</p>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href="tel:+94777777777"
                className="text-white hover:text-indigo-200 transition-all duration-200 text-base font-semibold"
              >
                +94-777777777
              </a>
            </li>
            <li>
              <a
                href="mailto:gewal.lk@gmail.com"
                className="text-white hover:text-indigo-200 transition-all duration-200 text-base font-semibold break-all"
              >
                gewal.lk@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr className="border-white/40 mb-6" />
        <p className="text-sm text-center text-white/80 font-light tracking-wide">
          © 2024 GreatStack. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
