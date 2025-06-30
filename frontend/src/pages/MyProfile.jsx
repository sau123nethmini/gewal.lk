import React, { useRef, useState } from 'react'
import { assets } from '../assets/assets'

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: assets.profile_pic,
    email: 'richardjameswap@gmail.com',
    phone: '+1 123 456 7890',
    address: {
      line1: '57th Cross, Richmond',
      line2: 'Circle, Church Road, London'
    },
    gender: 'Male',
    dob: '2001-05-23'
  });

  const [isEdit, setIsEdit] = useState(false);
  const fileInputRef = useRef();

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressChange = (line, value) => {
    setUserData(prev => ({
      ...prev,
      address: { ...prev.address, [line]: value }
    }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 rounded-3xl shadow-2xl border border-white/40 bg-white/40 backdrop-blur-md">
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <img
            className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-purple-400"
            src={userData.image}
            alt="User profile"
          />
          {isEdit && (
            <>
              <button
                type="button"
                className="absolute bottom-2 right-2 bg-purple-500 text-white p-2 rounded-full shadow-md hover:bg-purple-500 transition flex items-center"
                onClick={() => fileInputRef.current.click()}
                title="Change Profile Picture"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M4 16v2a2 2 0 002 2h8a2 2 0 002-2v-2M16.24 7.76a5 5 0 10-7.07 7.07 5 5 0 007.07-7.07zm-6.18-1.32A3 3 0 1115 10a3 3 0 01-4.94-3.56z" />
                </svg>
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </>
          )}
        </div>
        {isEdit ? (
          <input
            className="text-center text-3xl font-semibold mt-4 bg-gray-100 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            type="text"
            value={userData.name}
            onChange={e => handleInputChange('name', e.target.value)}
          />
        ) : (
          <h2 className="font-semibold text-3xl text-gray-900 mt-4">{userData.name}</h2>
        )}
      </div>

      <hr className="my-6 border-t border-gray-300" />

      {/* Contact Information */}
      <section>
        <h3 className="font-semibold mb-3 tracking-wide">Contact Information</h3>
        <div className="grid grid-cols-[130px_1fr] gap-y-3 text-gray-700">
          <span className="font-medium">Email:</span>
          <span className="text-purple-500 break-words">{userData.email}</span>

          <span className="font-medium">Phone:</span>
          {isEdit ? (
            <input
              className="text-purple-500 bg-gray-100 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 transition max-w-xs"
              type="text"
              value={userData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
            />
          ) : (
            <span className="text-purple-500">{userData.phone}</span>
          )}

          <span className="font-medium">Address:</span>
          {isEdit ? (
            <div className="flex flex-col gap-1">
              <input
                className="bg-gray-100 rounded px-2 py-1 mb-1 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                type="text"
                value={userData.address.line1}
                onChange={e => handleAddressChange('line1', e.target.value)}
              />
              <input
                className="bg-gray-100 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                type="text"
                value={userData.address.line2}
                onChange={e => handleAddressChange('line2', e.target.value)}
              />
            </div>
          ) : (
            <span className="text-gray-600">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </span>
          )}
        </div>
      </section>

      {/* Basic Information */}
      <section className="mt-8">
        <h3 className="font-semibold mb-3 tracking-wide">Basic Information</h3>
        <div className="grid grid-cols-[130px_1fr] gap-y-3 text-gray-700">
          <span className="font-medium">Gender:</span>
          {isEdit ? (
            <select
              className="bg-gray-100 rounded px-2 py-1 max-w-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={userData.gender}
              onChange={e => handleInputChange('gender', e.target.value)}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          ) : (
            <span className="text-gray-600">{userData.gender}</span>
          )}

          <span className="font-medium">Birthday:</span>
          {isEdit ? (
            <input
              className="bg-gray-100 rounded px-2 py-1 max-w-[150px] focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              type="date"
              value={userData.dob}
              onChange={e => handleInputChange('dob', e.target.value)}
            />
          ) : (
            <span className="text-gray-600">{userData.dob}</span>
          )}
        </div>
      </section>

      {/* Edit/Save Button */}
      <div className="flex justify-center mt-10">
        {isEdit ? (
          <button
            className="bg-purple-500 text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-purple-500 transition-all"
            onClick={() => setIsEdit(false)}
          >
            Save Information
          </button>
        ) : (
          <button
            className="border border-purple-500 text-purple-500 px-8 py-2 rounded-full font-semibold shadow hover:bg-purple-500 hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile