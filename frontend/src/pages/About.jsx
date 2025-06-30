import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* About Us Heading */}
      <div className="text-center text-4xl font-extrabold pt-12 tracking-tight">
        <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-md">
          About US
        </span>
      </div>

      {/* About Us Content */}
      <div className="my-14 flex flex-col md:flex-row gap-12 items-center 
        bg-white/20 backdrop-blur-lg bg-clip-padding rounded-3xl shadow-2xl border border-white/40 p-6 md:p-12
        ring-1 ring-inset ring-white/20
        ">
        <img
          className="w-full md:max-w-[360px] rounded-2xl object-cover shadow-xl border-4 border-white/40"
          src={assets.about_img}
          alt="About Prescripto"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-lg text-gray-900/90">
          <p>
            Welcome to <span className="font-semibold text-purple-400">Gewal.lk </span>, Your Trusted Partner in Property Management and Real Estate Solutions.
            At Gewal.lk, we understand the complexities of finding, managing, and investing in real estate. Whether you’re a tenant searching for a perfect home, a landlord looking to streamline property rentals, or an investor seeking valuable insights — we’re here to simplify your journey
          </p>     
          <div>
            <h3 className="text-xl font-bold text-purple-500 mb-1">Our Vision</h3>
            <p>
              Our vision at Gewal.lk is to revolutionize the real estate landscape by connecting people to property with ease, accuracy, and confidence. We strive to be the most reliable digital bridge between tenants, buyers, property owners, and real estate professionals — helping you unlock the true value of property management.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center text-2xl font-extrabold mb-8 tracking-tight">
        <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow">
          WHY CHOOSE US
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-20 items-stretch">
        {/* Card 1 */}
        <div className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-8 py-12 flex flex-col gap-4 items-center shadow-xl backdrop-blur-lg
        hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/80 hover:to-indigo-500/80 hover:text-white transition-all duration-300 cursor-pointer group">
          <span className="text-3xl mb-2 font-semibold transition group-hover:scale-110 duration-200">⚡</span>
          <h4 className="text-lg font-semibold group-hover:text-white text-purple-500">Efficiency</h4>
          <p className="text-center text-base group-hover:text-white/90">Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        {/* Card 2 */}
        <div className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-8 py-12 flex flex-col gap-4 items-center shadow-xl backdrop-blur-lg
        hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/80 hover:to-indigo-500/80 hover:text-white transition-all duration-300 cursor-pointer group">
          <span className="text-3xl mb-2 font-semibold transition group-hover:scale-110 duration-200">🤝</span>
          <h4 className="text-lg font-semibold group-hover:text-white text-purple-500">Convenience</h4>
          <p className="text-center text-base group-hover:text-white/90">Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        {/* Card 3 */}
        <div className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-8 py-12 flex flex-col gap-4 items-center shadow-xl backdrop-blur-lg
        hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/80 hover:to-indigo-500/80 hover:text-white transition-all duration-300 cursor-pointer group">
          <span className="text-3xl mb-2 font-semibold transition group-hover:scale-110 duration-200">🎯</span>
          <h4 className="text-lg font-semibold group-hover:text-white text-purple-500">Personalization</h4>
          <p className="text-center text-base group-hover:text-white/90">Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About