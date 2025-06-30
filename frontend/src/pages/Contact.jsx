import React from 'react'
import {assets} from '../assets/assets'

const Contact = () => {

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Heading */}
      <div className="text-center text-3xl font-bold pt-12 text-gray-700 tracking-tight">
        CONTACT <span className="text-indigo-600">US</span>
      </div>

      {/* Content Section */}
      <div className="my-14 flex flex-col md:flex-row gap-12 md:items-center bg-white rounded-2xl shadow-lg p-6 md:p-12 mb-20">
        {/* Image */}
        <img
          className="w-full md:max-w-[360px] rounded-xl object-cover shadow-md"
          src={assets.contact_img}
          alt="Contact Prescripto"
        />

        {/* Details */}
        <div className="flex flex-col justify-center gap-7 md:w-2/3">
          <div>
            <p className="font-semibold text-lg text-indigo-700 mb-1 tracking-wide">
              OUR OFFICE
            </p>
            <p className="text-gray-500 leading-relaxed">
              54709 Willms Station<br />
              Suite 350, Washington, USA
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">
              Tel: <span className="font-normal">(415) 555‑0132</span><br />
              Email: <a href="mailto:greatstackdev@gmail.com" className="underline hover:text-indigo-600 transition">{`greatstackdev@gmail.com`}</a>
            </p>
          </div>
          <div>
            <p className="font-semibold text-lg text-indigo-700 mb-1 tracking-wide">
              CAREERS AT PRESCRIPTO
            </p>
            <p className="text-gray-600 mb-3">
              Learn more about our teams and job openings.
            </p>
            <button className="border border-indigo-600 px-8 py-3 rounded-lg font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
