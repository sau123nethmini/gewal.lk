import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { assets } from "../assets/assets";

const links = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="font-poppins shadow-md bg-white/90 backdrop-blur-md border-b border-[#E5E5EF] fixed w-full z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src={assets.gewal} alt="Gewel.lk Logo" className="h-11 w-auto rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-10 items-center ml-8">
          {links.map(link => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `relative px-3 py-2 transition-all duration-200 font-medium tracking-wide
                 ${isActive ? "text-[#8E7BEF] after:w-full after:bg-[#8E7BEF]" : "text-[#22223B] hover:text-[#8E7BEF] hover:after:w-full hover:after:bg-[#EAE6FB]"}
                 after:content-[''] after:block after:w-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 after:mt-1`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="ml-8 bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white px-7 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8E7BEF]"
          >
            Login
          </Link>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-[#8E7BEF] hover:bg-[#F5F0FF] transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 py-6 px-7 shadow-xl rounded-b-2xl animate-slideDown">
          <ul className="space-y-5">
            {links.map(link => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2 text-lg font-medium rounded-lg transition-all duration-200
                   ${isActive ? "text-[#8E7BEF] bg-[#F5F0FF]" : "text-[#22223B] hover:text-[#8E7BEF] hover:bg-[#F5F0FF]"}`
                }
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/login"
              className="block bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white px-7 py-3 rounded-xl font-semibold shadow text-center transition-all duration-200"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          </ul>
        </div>
      )}

      {/* Custom Animation & Font */}
      <style>{`
        .animate-slideDown {
          animation: slideDown 0.28s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-24px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .font-poppins { font-family: 'Poppins', 'Inter', sans-serif; }
      `}</style>
    </nav>
  );
}