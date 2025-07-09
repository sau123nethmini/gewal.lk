import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
import Contact from './pages/Contact'
import About from './pages/About'
import Cart from './pages/Cart'
import Order from './pages/Order'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import Verify from './pages/Verify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminNavbar from './components/AdminNavbar'


//CustomerSupport Managment
import TicketRaisePage from './CustomersupportManagement/TicketRaisePage'
import MyTickets from './CustomersupportManagement/MyTickets'



//User and Feedback Management
import FeedbackPage from './UserAndFeedbackManagement/FeedbackPage'
import MyFeedbacks from './UserAndFeedbackManagement/MyFeedbacks'
import AllFeedbacks from './UserAndFeedbackManagement/AllFeedbacks'
import ProfilePage from './UserAndFeedbackManagement/ProfilePage'

import TenantMaintenanceForm from './UserAndFeedbackManagement/TenantMaintenanceForm'
import  TenantRequestsCards from './UserAndFeedbackManagement/TenantRequestsCards'




//Booking Managment
import BookAppointment from './BookingManagement/BookAppointment'
import MyBookings from './BookingManagement/MyBookings'
import OwnerBookings from './BookingManagement/OwnerBookings '



// import AdminBookings from '../../admin/src/pages/AdminBookings'
// import AdminPropertyManagement from '../../admin/src/pages/AdminPropertyManagement'



//Property Management
import AddProperty from './PropertyManagement/AddProperty'
import PropertyList  from './PropertyManagement/PropertyList'
import UserPropList from './PropertyManagement/UserPropList'


import FinanceAssistance from "./pages/FinanceAssistance";






const App = () => {
  const location = useLocation()

  console.log(location.pathname) // Debugging the pathname

  return (
    <div className='px-4 sm:px-[5vw] md:px [7vw] lg:px-[9vw ]'>
      <ToastContainer />
      
      {/* Render AdminNavbar for admin-related pages */}
      {location.pathname.includes('/orders') || location.pathname.includes('/admin') ? (
        <AdminNavbar />
      ) : (
        <Navbar />
      )}

      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/orders' element={<Order />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/Place-order' element={<PlaceOrder />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/finance/:id' element={<FinanceAssistance />} />
        {/* <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} /> */}



         {/* CustomerSupport Managment */}
        <Route path='/raise-ticket' element={<TicketRaisePage />} />
        <Route path='/my-tickets' element={<MyTickets />} />

        
        {/* Booking Managment */}
        <Route path='/book/:id' element={<BookAppointment />} />
        <Route path='/book' element={<MyBookings />} />
        <Route path='/owner' element={<OwnerBookings />} />

        {/* <Route path='/allbook' element={<AdminBookings />} /> */}

        {/* User and Feedback Management */}
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/submit-feedbacks' element={<FeedbackPage />} />
        <Route path='/my-feedbacks' element={<MyFeedbacks />} />
        <Route path='/feedbacks' element={<AllFeedbacks />} />
        <Route path='/tenant-submit' element={<TenantMaintenanceForm />} />
        <Route path='/my-requests' element={< TenantRequestsCards />} />



        {/* Property Management */}
        {/* <Route path='/adminprop' element={<AdminPropertyManagement />} /> */}
        <Route path='/add-prop' element={<AddProperty />} />
        <Route path='/properties' element={<PropertyList />} />
         <Route path='/user-prop' element={<UserPropList />} /> 




        
      </Routes>
      <Footer />
    </div>
  )
}

export default App
