import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
    {/* About Us Heading */}
    <div className="text-center text-3xl font-semibold pt-12 text-gray-700 tracking-tight">
      <span className="text-indigo-600">About</span> US
    </div>

    {/* About Us Content */}
    <div className="my-14 flex flex-col md:flex-row gap-12 items-center bg-white rounded-2xl shadow-lg p-6 md:p-12">
      <img
        className="w-full md:max-w-[360px] rounded-xl object-cover shadow-md"
        src={assets.about_img}
        alt="About Prescripto"
      />
      <div className="flex flex-col justify-center gap-6 md:w-2/4 text-base text-gray-700">
        <p>
          Welcome to <span className="font-semibold text-indigo-600">Prescripto</span>, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
        </p>
        <p>
          Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
        </p>
        <div>
          <h3 className="text-lg font-bold text-indigo-700 mb-1">Our Vision</h3>
          <p>
            Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>
        </div>
      </div>
    </div>

    {/* Why Choose Us */}
    <div className="text-center text-2xl font-bold my-8 tracking-tight">
      WHY <span className="text-indigo-600">CHOOSE US</span>
    </div>

    <div className="flex flex-col md:flex-row gap-8 mb-20 items-stretch">
      {/* Card 1 */}
      <div className="flex-1 bg-white border border-indigo-100 rounded-xl px-8 py-8 flex flex-col gap-4 items-center shadow-sm hover:shadow-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer">
        <span className="text-2xl mb-1 font-semibold">⚡ Efficiency</span>
        <p className="text-center">Streamlined appointment scheduling that fits into your busy lifestyle.</p>
      </div>
      {/* Card 2 */}
      <div className="flex-1 bg-white border border-indigo-100 rounded-xl px-8 py-8 flex flex-col gap-4 items-center shadow-sm hover:shadow-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer">
        <span className="text-2xl mb-1 font-semibold">🤝 Convenience</span>
        <p className="text-center">Access to a network of trusted healthcare professionals in your area.</p>
      </div>
      {/* Card 3 */}
      <div className="flex-1 bg-white border border-indigo-100 rounded-xl px-8 py-8 flex flex-col gap-4 items-center shadow-sm hover:shadow-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer">
        <span className="text-2xl mb-1 font-semibold">🎯 Personalization</span>
        <p className="text-center">Tailored recommendations and reminders to help you stay on top of your health.</p>
      </div>
    </div>
  </div>
  )
}

export default About
