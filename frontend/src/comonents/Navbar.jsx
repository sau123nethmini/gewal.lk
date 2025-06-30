import React from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'


const Navbar = () => {

    const navigate = useNavigate();

    const[showMenu, setShowMenu] = React.useState(false)
    const[token, setToken] = React.useState(true)

  return (
    <div className='flex items-center justify-between text-sm py-4 md-5 border-b border-b-gray-400'>
      <img onClick={()=>navigate(`/`)} className='w-44 cursor-pointer' src={assets.gewal} alt="logo" />
      <ul className='hidden md:flex item-start gap-5 font-medium'>
        <NavLink to='/' 
        className={({ isActive }) =>
            `py-1 flex flex-col items-center ${isActive ? 'text-purple-600 font-bold' : ''}`
          }>
            <li className='py-1'>Home</li>
            <hr/>
        </NavLink>

        <NavLink to='/Properties' 
        className={({ isActive }) =>
            `py-1 flex flex-col items-center ${isActive ? 'text-purple-600 font-bold' : ''}`
          }>
            <li className='py-1'>All Property</li>
            <hr/>
        </NavLink>

        <NavLink to='/About'
        className={({ isActive }) =>
            `py-1 flex flex-col items-center ${isActive ? 'text-purple-600 font-bold' : ''}`
          }>
            <li className='py-1'>About</li>
            <hr/>
        </NavLink>

        <NavLink to='/Contact'
        className={({ isActive }) =>
            `py-1 flex flex-col items-center ${isActive ? 'text-purple-600 font-bold' : ''}`
          }>
            <li className='py-1'>Contact</li>
            <hr/>
        </NavLink>
      </ul>

      <div className='flex item-center gap-4'>
        {
            token
            ?<div className='flex item-center gap-2 cursor-pointer group relative'>
                <img src={assets.profile_pic} alt="avatar" className='w-8 rounded-full' onClick={() => setShowMenu(!showMenu)} />
                <img src={assets.dropdown} alt="menu" className='w-7' onClick={() => setShowMenu(!showMenu)} />
                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-black-600 z-20 hidden group-hover:block'>
                    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                        <p onClick={()=>navigate('MyProfile')} className='hover:text-purple-600 cursor-pointer'>My Profile</p>
                        <p onClick={()=>navigate('MyAppointment')} className='hover:text-purple-600 cursor-pointer'>My Appointment</p>
                        <p onClick={()=>setToken(false)} className='hover:text-purple-600 cursor-pointer'>Logout</p>
                    </div>
                </div>
            </div>
            :<button 
            onClick={() => navigate('/Login')}
            className="bg-purple-600 text-white px-8 py-3 rounded-full font-light hidden md:block 
                       transition-all duration-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-600 focus:text-purple-600 focus:bg-white 
                       hover:bg-white hover:text-purple-600 hover:ring-2 hover:ring-purple-600"
          >Cteate Account</button>
        }

        <img 
        onClick={()=>setShowMenu(true)}
        className='w-4 md:hidden' src={assets.menu_icon} alt="" />

        {/* Mobile Menu */}

        <div className={`${showMenu ? 'fixed w-full': 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="" />
            <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink 
            to='/' onClick={()=>setShowMenu(false)} className='px-4 py-2 rounded inline-block'>
              <p className='px-4 py-2 rounded inline-block'>Home</p>
            </NavLink>

            <NavLink to='/Properties' onClick={()=>setShowMenu(false)}>
              <p className='px-4 py-2 rounded inline-block'>All Property</p>
            </NavLink>

            <NavLink to='/About' onClick={()=>setShowMenu(false)}>
              <p className='px-4 py-2 rounded inline-block'>About</p>
            </NavLink>

            <NavLink to='/Contact' onClick={()=>setShowMenu(false)}>
              <p className='px-4 py-2 rounded inline-block'>Contact</p>
            </NavLink>
          </ul>
        </div>
        
      </div>
    </div>
  )
  
}

export default Navbar
