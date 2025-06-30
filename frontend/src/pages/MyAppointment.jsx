import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointment = () => {
  const { properties } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto mt-14 mb-16 p-4">
      <h2 className="text-2xl font-bold text-purple-700 mb-8 text-center">My Appointments</h2>
      {properties.length === 0 ? (
        <div className="text-center text-purple-400 py-16">You have no appointments yet.</div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.slice(0, 8).map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-5 rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition group"
              style={{ minHeight: 340 }}
            >
              <div className="relative mb-4">
                <img
                  className="w-32 h-32 object-cover rounded-2xl bg-purple-100 shadow group-hover:scale-105 transition-transform"
                  src={item.image}
                  alt={item.name}
                />
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow">
                  {item.type}
                </span>
              </div>
              <div className="w-full text-center mb-3">
                <div className="text-lg font-bold text-gray-900 truncate">{item.name}</div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  {item.address?.line1}
                  {item.address?.line2 ? <>, {item.address.line2}</> : null}
                </div>
                <div className="mt-2 text-xs text-purple-600 font-semibold">
                  25, July, 2024 | 8:30 PM
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full mt-auto">
                <button className="text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 py-2 px-4 rounded-lg hover:from-green-500 hover:to-green-600 transition">
                  Pay Online
                </button>
                <button className="text-sm font-medium text-white bg-red-500 py-2 px-4 rounded-lg border border-red-500 hover:bg-red-600 transition">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointment