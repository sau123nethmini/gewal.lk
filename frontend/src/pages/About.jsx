import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* About Us Heading */}
      <div className="text-center text-4xl font-extrabold pt-12 tracking-tight">
        <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-md">
          About <span className="text-white bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">US</span>
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
            Welcome to <span className="font-semibold text-indigo-600">Prescripto</span>, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
          </p>
          <div>
            <h3 className="text-xl font-bold text-indigo-700 mb-1">Our Vision</h3>
            <p>
              Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center text-2xl font-extrabold mb-8 tracking-tight">
        <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow">
          WHY <span className="text-white bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">CHOOSE US</span>
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-20 items-stretch">
        {/* Card 1 */}
        <div className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-8 py-12 flex flex-col gap-4 items-center shadow-xl backdrop-blur-lg
        hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/80 hover:to-indigo-500/80 hover:text-white transition-all duration-300 cursor-pointer group">
          <span className="text-3xl mb-2 font-semibold transition group-hover:scale-110 duration-200">⚡</span>
          <h4 className="text-lg font-semibold group-hover:text-white text-indigo-700">Efficiency</h4>
          <p className="text-center text-base group-hover:text-white/90">Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        {/* Card 2 */}
        <div className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-8 py-12 flex flex-col gap-4 items-center shadow-xl backdrop-blur-lg
        hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/80 hover:to-indigo-500/80 hover:text-white transition-all duration-300 cursor-pointer group">
          <span className="text-3xl mb-2 font-semibold transition group-hover:scale-110 duration-200">🤝</span>
          <h4 className="text-lg font-semibold group-hover:text-white text-indigo-700">Convenience</h4>
          <p className="text-center text-base group-hover:text-white/90">Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        {/* Card 3 */}
        <div className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-8 py-12 flex flex-col gap-4 items-center shadow-xl backdrop-blur-lg
        hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/80 hover:to-indigo-500/80 hover:text-white transition-all duration-300 cursor-pointer group">
          <span className="text-3xl mb-2 font-semibold transition group-hover:scale-110 duration-200">🎯</span>
          <h4 className="text-lg font-semibold group-hover:text-white text-indigo-700">Personalization</h4>
          <p className="text-center text-base group-hover:text-white/90">Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About