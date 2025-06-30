import React from 'react'
import { typeData } from '../assets/assets'
import { Link } from 'react-router-dom'

const TypeMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='type'>

        <h1 className='text-3xl font-medium'>
            Find by Type
        </h1>

        <p className='sm:w-2/3 text-center text-sm'>
            Explore detailed property specifications, including location, size, amenities, pricing, and more to find your perfect home or investment.
        </p>

        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
            {typeData.map((item, index) => (
                <Link className='flex flex-col items-center cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500ms' 
                        onClick={() => scrollTo(0, 0)}
                        key={index} 
                        to={`/property/${item.type}`}>
                    <img className='w-16 sm:w-32 mb-5' src={item.image} alt="" />
                    <p className=''>{item.type}</p>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default TypeMenu
