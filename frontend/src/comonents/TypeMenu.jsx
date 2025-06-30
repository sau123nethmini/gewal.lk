import React from 'react'
import { typeData } from '../assets/assets'
import { Link } from 'react-router-dom'

const TypeMenu = () => {
    return (
        <div className="flex flex-col items-center gap-6 py-16 text-white" id="type">
            <div className="w-full max-w-5xl mx-auto 
    bg-gradient-to-r from-purple-500 to-indigo-500 
    bg-clip-padding border border-white/30 rounded-3xl shadow-xl 
    backdrop-blur-md bg-opacity-80 p-8 sm:p-12
    ">
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">
                    Find by Type
                </h1>
                <p className="sm:w-2/3 mx-auto text-center text-base text-white/80 mb-3">
                    Explore detailed property specifications, including location, size, amenities, pricing, and more to find your perfect home or investment.
                </p>
                <div className="flex sm:justify-center gap-6 pt-5 w-full overflow-x-auto pb-2 px-1 scrollbar-thin scrollbar-thumb-purple-200">
                    {typeData.map((item, index) => (
                        <Link
                            className="flex flex-col items-center cursor-pointer flex-shrink-0 hover:-translate-y-2 group transition-transform duration-300"
                            onClick={() => scrollTo(0, 0)}
                            key={index}
                            to={`/property/${item.type}`}
                            aria-label={`Find properties of type ${item.type}`}
                        >
                            <div className="w-20 h-20 sm:w-28 sm:h-28 mb-3 rounded-full bg-white shadow-md flex items-center justify-center border border-white group-hover:shadow-xl transition-all duration-300 backdrop-blur-md">
                                <img className="w-24 sm:w-28 h-24 sm:h-28 object-contain" src={item.image} alt={item.type} />
                            </div>
                            <p className="text-base font-medium text-white group-hover:text-yellow-300">{item.type}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TypeMenu
