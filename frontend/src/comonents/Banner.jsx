import React, { use } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <div
            className="flex bg-gradient-to-r from-purple-300/80 via-purple-100/90 to-white/80 rounded-lg px-4 sm:px-8 md:px-14 lg:px-12 my-20 md:mt-10 relative overflow-hidden shadow"
            style={{
                backgroundImage: `url(${assets.appointment_img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "260px",
            }}
        >
            {/* Soft white overlay for extra lightness */}
            <div className="absolute inset-0 bg-white/60 pointer-events-none rounded-lg" />

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-8 sm:py-10 md:py-16 lg:py-20">
                <div className="text-center text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-purple-600 drop-shadow-sm">
                    <p>Book Appointment</p>
                    <p className="mt-3 text-purple-400 font-normal text-base sm:text-xl lg:text-2xl">
                        With 100+ Trusted Property Sellers
                    </p>
                </div>

                <button
                    onClick={() => {
                        navigate("/Login");
                        scrollTo(0, 0);
                    }}
                    className="bg-white/90 text-purple-600 text-base sm:text-lg px-8 py-3 rounded-full mt-7 shadow-md hover:bg-purple-100 hover:scale-105 font-semibold transition-all"
                >
                    Create Account
                </button>
            </div>
        </div>
    )
}

export default Banner
