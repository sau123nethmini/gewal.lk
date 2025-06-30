import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div
            className="flex flex-col md:flex-row flex-wrap bg-gradient-to-tr from-purple-200/80 via-white/80 to-purple-100/70 rounded-lg px-4 md:px-10 lg:px-20 mt-5 relative overflow-hidden"
            style={{
                backgroundImage: `url(${assets.header_img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "300px",
            }}
        >
            {/* Soft white overlay for extra lightness */}
            <div className="absolute inset-0 bg-white/60 pointer-events-none rounded-lg" />

            {/* Header left side */}
            <div className="relative z-10 md:w-1/2 flex flex-col items-start justify-center gap-4 py-8 md:py-[8vw] text-left">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 leading-tight drop-shadow-sm">
                    Your Dream Home
                    <br />
                    Is Just a Click Away
                </p>
                <div className="flex flex-col md:flex-row items-start gap-5 mt-3 text-purple-500 text-base font-normal">
                    <img className="w-28" src={assets.group_profiles} alt="Group profiles" />
                    <p>
                        Explore Listings, Book
                        <br className="hidden sm:block" />
                        Visits, Move with Confidence
                    </p>
                </div>
                <a
                    href="/property"
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-12 py-3 rounded-full mt-10 text-base font-semibold shadow transition-all duration-200"
                >
                    See properties
                </a>
            </div>
        </div>
    )
}

export default Header
