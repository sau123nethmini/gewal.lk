import React from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const [showMenu, setShowMenu] = React.useState(false)
  const [token, setToken] = React.useState(true)

  // Hide mobile menu on resize to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setShowMenu(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Helper for nav link active style
  const navLinkClass = ({ isActive }) =>
    `py-2 px-5 flex flex-col items-center rounded-xl transition font-semibold text-lg xl:text-xl
    ${isActive ? 'text-purple-700 font-extrabold bg-purple-100 shadow-md scale-105' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50 hover:scale-105 duration-200'}`

  // Helper for button style (shared with Create Account)
  const createAccountButtonClass = ({ isActive }) =>
    `py-1.5 px-5 rounded-full font-semibold text-base md:text-lg transition duration-200
    ${isActive ? 'text-purple-700 font-bold bg-white bg-opacity-80 shadow scale-105' : 'text-white hover:text-purple-100 hover:bg-white/20'}`

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between py-4 border-b border-b-gray-200 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 sm:px-8 md:px-16 shadow-md">
      <img
        onClick={() => navigate(`/`)}
        className="w-40 sm:w-48 cursor-pointer transition-transform hover:scale-105 duration-200"
        src={assets.gewal_white}
        alt="logo"
      />
      {/* Desktop Nav */}
      <ul className="hidden lg:flex items-center gap-6 font-medium">
        <NavLink to="/"
          className={({ isActive }) =>
            `py-1.5 px-3 flex flex-col items-center rounded-lg transition font-semibold text-base
      ${isActive ? 'text-purple-700 font-bold bg-white bg-opacity-80 shadow text-gradient-to-r from-purple-600 to-indigo-600' : 'text-white hover:text-purple-100 hover:bg-white/20'}`
          }
        >
          <li className="py-1">Home</li>
        </NavLink>
        <NavLink to="/property"
          className={({ isActive }) =>
            `py-1.5 px-3 flex flex-col items-center rounded-lg transition font-semibold text-base
      ${isActive ? 'text-purple-700 font-bold bg-white bg-opacity-80 shadow text-gradient-to-r from-purple-600 to-indigo-600' : 'text-white hover:text-purple-100 hover:bg-white/20'}`
          }
        >
          <li className="py-1">All Property</li>
        </NavLink>
        <NavLink to="/about"
          className={({ isActive }) =>
            `py-1.5 px-3 flex flex-col items-center rounded-lg transition font-semibold text-base
      ${isActive ? 'text-purple-700 font-bold bg-white bg-opacity-80 shadow text-gradient-to-r from-purple-600 to-indigo-600' : 'text-white hover:text-purple-100 hover:bg-white/20'}`
          }
        >
          <li className="py-1">About</li>
        </NavLink>
        <NavLink to="/contact"
          className={({ isActive }) =>
            `py-1.5 px-3 flex flex-col items-center rounded-lg transition font-semibold text-base
      ${isActive ? 'text-purple-500 font-bold bg-white bg-opacity-80 shadow text-gradient-to-r from-purple-600 to-indigo-600' : 'text-white hover:text-purple-100 hover:bg-white/20'}`
          }
        >
          <li className="py-1">Contact</li>
        </NavLink>
      </ul>

      <div className="flex items-center gap-3">
        {token ? (
          <div className="relative flex items-center group">
            <img
              src={assets.profile_pic}
              alt="avatar"
              className="w-11 h-11 rounded-full border-2 border-purple-200 cursor-pointer object-cover shadow-sm hover:ring-2 hover:ring-white transition"
              onClick={() => setShowMenu(!showMenu)}
            />
            <img
              src={assets.dropdown}
              alt="menu"
              className="w-8 ml-1 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />
            {/* Dropdown */}
            {showMenu && (
              <div className="absolute right-0 top-14 bg-white border border-gray-100 rounded-2xl shadow-xl w-56 py-4 z-30 animate-fadeIn text-gray-800">
                <button
                  className="block w-full px-6 py-3 text-left hover:text-purple-700 hover:bg-purple-50 transition rounded-lg"
                  onClick={() => {
                    navigate('/my-profile')
                    setShowMenu(false)
                  }}
                >
                  <span className="inline-block mr-2">👤</span> My Profile
                </button>
                <button
                  className="block w-full px-6 py-3 text-left hover:text-purple-700 hover:bg-purple-50 transition rounded-lg"
                  onClick={() => {
                    navigate('/my-appointment')
                    setShowMenu(false)
                  }}
                >
                  <span className="inline-block mr-2">📅</span> My Appointment
                </button>
                <button
                  className="block w-full px-6 py-3 text-left hover:text-purple-700 hover:bg-purple-50 transition rounded-lg"
                  onClick={() => {
                    setToken(false)
                    setShowMenu(false)
                  }}
                >
                  <span className="inline-block mr-2">🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to="/Login"
            className={createAccountButtonClass}
          >
            Create Account
          </NavLink>
        )}

        {/* Mobile menu button (hamburger) */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-10 lg:hidden cursor-pointer"
          src={assets.menu}
          alt="menu"
        />

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${showMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} lg:hidden`}
          onClick={() => setShowMenu(false)}
        />
        {/* Mobile Menu Panel - hidden on lg and up */}
        <div
          className={`fixed right-0 top-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${showMenu ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}
        >
          <div className="flex items-center justify-between px-5 py-6 border-b border-gray-100">
            <img className="w-36" src={assets.gewal} alt="logo" />
            <img className="w-7 cursor-pointer" onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="close" />
          </div>
          <ul className="flex flex-col items-center gap-1 mt-5 px-5 text-lg font-semibold">
            <NavLink to="/" onClick={() => setShowMenu(false)} className={({ isActive }) => `px-4 py-3 rounded-xl w-full text-center transition ${isActive ? "bg-purple-100 text-purple-700 font-bold" : "hover:bg-purple-50 text-gray-700"}`}>
              Home
            </NavLink>
            <NavLink to="/property" onClick={() => setShowMenu(false)} className={({ isActive }) => `px-4 py-3 rounded-xl w-full text-center transition ${isActive ? "bg-purple-100 text-purple-700 font-bold" : "hover:bg-purple-50 text-gray-700"}`}>
              All Property
            </NavLink>
            <NavLink to="/about" onClick={() => setShowMenu(false)} className={({ isActive }) => `px-4 py-3 rounded-xl w-full text-center transition ${isActive ? "bg-purple-100 text-purple-700 font-bold" : "hover:bg-purple-50 text-gray-700"}`}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={() => setShowMenu(false)} className={({ isActive }) => `px-4 py-3 rounded-xl w-full text-center transition ${isActive ? "bg-purple-100 text-purple-700 font-bold" : "hover:bg-purple-50 text-gray-700"}`}>
              Contact
            </NavLink>
            {!token && (
              <NavLink
                to="/Login"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `mt-6 block text-center rounded-full font-semibold text-base px-8 py-3 transition duration-200 shadow
                  ${isActive ? 'text-purple-700 font-bold bg-white bg-opacity-80 shadow scale-105' : 'text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-800'}`
                }
              >
                Create Account
              </NavLink>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar