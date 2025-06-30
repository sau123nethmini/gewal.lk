import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopProperties = () => {

    const navigate = useNavigate();
    const { properties, currencySymbol } = useContext(AppContext);


    return (
        <div className="flex flex-col items-center gap-6 my-16 text-gray-900 md:mx-10">
            <h1 className="text-3xl font-bold tracking-tight">Top Houses to Look</h1>
            <p className="sm:w-2/3 text-center text-base text-gray-600">
                Discover the best properties that match your dreams and lifestyle. Browse top-rated homes and find your perfect place to call home!
            </p>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 px-3 sm:px-0">
                {properties.slice(0, 6).map((item, index) => (
                    <div
                    onClick={() => {
                        navigate(`/appointment/${item._id}`);
                        scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group border border-purple-200 bg-white rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 shadow"
                    key={index}
                    tabIndex={0}
                    aria-label={`View ${item.name || 'Property'}`}
                >
                    <div className="relative">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-44 group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 right-2 bg-white/80 text-purple-700 px-4 py-1 rounded-full text-base font-extrabold shadow">
                            {item.type}
                        </span>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-2 text-xs text-green-600 mb-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                            <span>Available</span>
                        </div>
                        <p className="text-gray-900 text-lg font-semibold truncate">{item.name}</p>
                        {item.price !== undefined && item.price !== null && (
                            <p className="text-purple-600 text-base font-bold mt-1">
                                {currencySymbol} {item.price.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
                ))}
            </div>

            <button
                onClick={() => {
                    navigate(`/property`);
                    scrollTo(0, 0);
                }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-12 py-3 rounded-full mt-10 text-base font-semibold shadow transition-all duration-200"
            >
                More
            </button>
        </div>
    )
}

export default TopProperties
