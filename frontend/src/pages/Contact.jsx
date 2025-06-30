import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Heading */}
      <div className="text-center text-4xl font-extrabold pt-12 tracking-tight">
      <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-md">
          CONTACT US
        </span>
      </div>

      {/* Content Section */}
      <div className="my-14 flex flex-col md:flex-row gap-12 md:items-center 
        bg-white/20 backdrop-blur-lg bg-clip-padding rounded-3xl shadow-2xl border border-white/40 p-6 md:p-12 mb-20
        ring-1 ring-inset ring-white/20"
      >
        {/* Image */}
        <img
          className="w-full md:max-w-[360px] rounded-2xl object-cover shadow-xl border-4 border-white/40"
          src={assets.contact_img}
          alt="Contact Prescripto"
        />

        {/* Details */}
        <div className="flex flex-col justify-center gap-7 md:w-2/3 text-lg text-gray-900/90">
          <div>
            <p className="font-semibold text-lg text-purple-500 mb-1 tracking-wide">
              OUR OFFICE
            </p>
            <p className="text-gray-600 leading-relaxed">
              54709 Willms Station<br />
              Suite 350, Washington, USA
            </p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">
              Tel: <span className="font-normal">(415) 555‑0132</span><br />
              Email: <a href="mailto:greatstackdev@gmail.com" className="underline hover:text-indigo-600 transition">{`greatstackdev@gmail.com`}</a>
            </p>
          </div>
          <div>
            <p className="font-semibold text-lg text-purple-500 mb-1 tracking-wide">
              CAREERS AT PRESCRIPTO
            </p>
            <p className="text-gray-700 mb-3">
              Learn more about our teams and job openings.
            </p>
            <button className="border border-purple-600 px-8 py-3 rounded-xl font-semibold text-purple-600 bg-white/50 backdrop-blur hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-500 hover:text-white transition-all duration-300 shadow-md">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="mb-20 bg-white/20 backdrop-blur-lg bg-clip-padding rounded-3xl shadow-2xl border border-white/40 p-6 md:p-12 ring-1 ring-inset ring-white/20 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-purple-500 mb-6">Send us a Message</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="px-5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="px-5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="px-5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition min-h-[120px] resize-none"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 px-8 rounded-xl shadow hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
          >
            Send Message
          </button>
          {submitted && (
            <p className="text-green-600 font-semibold mt-2 text-center">Thank you! Your message has been sent.</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Contact