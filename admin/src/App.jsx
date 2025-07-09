import React, { useEffect, useState } from 'react'
import NavBar from './component/NavBar'
import Sidebar from './component/Sidebar'
import {Routes,Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminHome from './pages/AdminHome';


import Login from './component/Login'

//Booking Management
import AdminBookings from './AllAdmins/BookingAndAppoinmentManagment/AdminBookings';

//CustomrSupport Management
import TickeAdminDashboard from './AllAdmins/CustomerServiceMangament/TicketAdminDashboard';


//PropertyMangment
import AdminPropertyManagement from './AllAdmins/PropertyManagment/AdminPropertyManagement';

//User and Feedback Management
import AdminDashboard from './AllAdmins/UserAndFeedbackManagment/AdminDashboard';
import AllUsers from './AllAdmins/UserAndFeedbackManagment/AllUsers';
import AdminMaintenanceDashboard from './AllAdmins/UserAndFeedbackManagment/AdminMaintenanceDashboard';

import AdminFinance from './AllAdmins/AdminFinance/AdminFinance';













export const backendUrl=import.meta.env.VITE_BACKEND_URL
export const currency ='$'
const App = () => {

  const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):'');


  useEffect(()=>{

    localStorage.setItem('token',token)


  },[token])


  return (


    <div className='bg-gray-50 min-h-screen'>

      <ToastContainer/>

      {token ===""
      ? <Login setToken={setToken}/> 
      : <>

      <NavBar setToken={setToken}/>
      <hr />
      <div className='flex w-full'>
  
        <Sidebar/>
  
        <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
  
  
        
          <Routes>
          <Route path='/' element ={<AdminHome token={token}/>}/>
          <Route path='/adminticket' element ={<TickeAdminDashboard token={token}/>}/>
          <Route path='/adminbooking' element ={<AdminBookings token={token}/>}/>
          <Route path='/adminproperty' element ={<AdminPropertyManagement token={token}/>}/>
          <Route path='/adminfeedback' element ={<AdminDashboard token={token}/>}/>
          <Route path='/adminuser' element ={<AllUsers token={token}/>}/>
          <Route path='/main-admin' element ={<AdminMaintenanceDashboard token={token}/>}/>
          <Route path='/adminfinance' element ={<AdminFinance token={token}/>}/>
  
         </Routes>
  
  
  
  
  
  
        </div>
  
  
  
        
      </div>
  
      
      
      
  
      </>
       }
  

    </div>
  )
}

export default App