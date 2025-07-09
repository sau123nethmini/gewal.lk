// components/OwnerBookings.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchOwnerBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode(token);
        const ownerId = decoded.userId || decoded._id;

        const response = await axios.get(`http://localhost:4000/api/bookings/owner-bookings/${ownerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching owner bookings:", error);
      }
    };

    fetchOwnerBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Received Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings received yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="p-4 border rounded-md shadow-sm">
              <p><strong>Property:</strong> {booking.property?.type} - {booking.property?.location}</p>
              <p><strong>Booked By:</strong> {booking.user?.name} ({booking.user?.email})</p>
              <p><strong>Contact:</strong> {booking.contact}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
              <p><strong>Meeting Type:</strong> {booking.meetingType}</p>
              <p><strong>Price:</strong> LKR {booking.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OwnerBookings;
