import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Property from './pages/Property';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointment from './pages/MyAppointment';
import Appointment from './pages/Appointment';
import Navbar from './comonents/Navbar';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      {/* <Navbar /> */}
      < Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/property' element={<Property />} />
        <Route path='/property/:type' element={<Property />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} /> 
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile/>} />
        <Route path='/my-appointment' element={<MyAppointment/>} />
        <Route path='/appointment/:propId' element={<Appointment/>} />
      </Routes>
    </div>
  )
}

export default App
