import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { assets } from "../assets/assets";

const links = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },

];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-[#E5E5EF] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={assets.gewal}
            alt="Gewel.lk Logo"
            className="h-9 sm:h-11 w-auto rounded-lg shadow-sm group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-7 lg:space-x-10 items-center ml-6">
          {links.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `relative px-2.5 py-1.5 transition-all duration-200 font-medium tracking-wide rounded-md
                  ${isActive
                    ? "text-[#8E7BEF] bg-[#F5F0FF] shadow"
                    : "text-[#22223B] hover:text-[#8E7BEF] hover:bg-[#F5F0FF]"}
                  focus-visible:ring-2 focus-visible:ring-[#8E7BEF]`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link
              to="/login"
              className="ml-6 bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8E7BEF]"
            >
              Login
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-[#8E7BEF] hover:bg-[#F5F0FF] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E7BEF]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed top-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 translate-y-0"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white/95 py-7 px-7 shadow-2xl rounded-b-2xl animate-slideDown max-w-7xl mx-auto w-full">
            <ul className="space-y-5">
              {links.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-base font-medium rounded-lg transition-all duration-200
                      ${isActive ? "text-[#8E7BEF] bg-[#F5F0FF] shadow" : "text-[#22223B] hover:text-[#8E7BEF] hover:bg-[#F5F0FF]"}
                      focus-visible:ring-2 focus-visible:ring-[#8E7BEF]`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Link
                  to="/login"
                  className="block bg-gradient-to-r from-[#8E7BEF] to-[#A084E8] hover:from-[#A084E8] hover:to-[#8E7BEF] text-white px-7 py-3 rounded-xl font-semibold shadow text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8E7BEF]"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      <style>{`
        .animate-slideDown {
          animation: slideDown 0.28s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-24px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </nav>
  );
}