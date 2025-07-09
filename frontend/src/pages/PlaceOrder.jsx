import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;
  
  const { navigate, backendUrl, token, cartItems, setcartItems, delivery_fee, products, getCartAmount } = useContext(ShopContext);
  
  // Get userId from token
  const getUserId = () => {
    try {
      const decoded = jwtDecode(token);
      return decoded.userId || decoded.id || decoded._id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: bookingDetails?.email || '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: bookingDetails?.contact || ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const userId = getUserId();
      if (!userId) {
        toast.error("User authentication failed. Please login again.");
        return;
      }

      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        userId: userId
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
          if (response.data.success) {
            setcartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handlePaymentMethodClick = (paymentMethod) => {
    setMethod(paymentMethod);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = Object.values(formData).every((value) => value.trim() !== '');
    if (!isValid) {
      alert('Please fill in all fields before placing the order.');
      return;
    }
    navigate('/orders');
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 sm:px-8 relative"
    >
      <div className="flex flex-col gap-6 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3 text-gray-800">
          <Title text1=" Booking " text2=" INFORMATION " />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-4">
            <input
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              className="border border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              type="text"
              placeholder="First Name"
              required
            />
            <input
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              className="border border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              type="text"
              placeholder="Last Name"
              required
            />
          </div>
          <input
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            className="border border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            type="email"
            placeholder="Email Address"
            required
          />
          <input
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            className="border border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            type="text"
            placeholder="Street Address"
            required
          />
          <div className="flex gap-4">
            <input
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              className="border border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              type="text"
              placeholder="City"
              required
            />
            <input
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              className="border border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              type="text"
              placeholder="State"
              required
            />
            <input
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              className="border border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              type="text"
              placeholder="Zip Code"
              required
            />
          </div>
          <input
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            type="text"
            placeholder="Country"
            required
          />
          <input
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            className="border border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            type="tel"
            placeholder="Phone Number"
            required
          />
        </div>
      </div>
      <div className="flex flex-col w-full sm:max-w-[400px]">
        <CartTotal />
        <div className="mt-8">
          <Title text1=" PAYMENT " text2=" METHOD " />
          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-4 items-center">
            <div
              onClick={() => handlePaymentMethodClick('stripe')}
              className={`flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg w-full sm:w-auto ${
                method === 'stripe' ? 'border-blue-500' : 'hover:bg-gray-100'
              }`}
            >
              <input type="radio" name="payment" id="stripe" checked={method === 'stripe'} className="cursor-pointer" readOnly />
              <img className="h-5 w-28 ml-6" src={assets.stripe_logo} alt="Stripe" />
            </div>
          </div>
        </div>
        <div className="w-full text-end mt-8">
          <button type="submit" className="bg-black text-white px-16 py-3 text-sm rounded-lg hover:bg-gray-800">
            Confirm Booking
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;