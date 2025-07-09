import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiPhone, FiMessageSquare } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [meetingType, setMeetingType] = useState("physical");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [price, setPrice] = useState(10);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]); // Existing bookings
  const [zoomDetails, setZoomDetails] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/properties/${id}`);
        setProperty(response.data.property);
      } catch (error) {
        
      }
    };

    const fetchBookedSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/bookings/property/${id}`);
        setBookedSlots(response.data.bookings);
      } catch (error) {
        
      }
    };

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in.");
          return;
        }

        const response = await axios.get("http://localhost:4000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const userData = response.data.user;
          setEmail(userData.email);
          setName(userData.name);
          console.log('User profile fetched:', userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Error loading user profile. Please try again.");
      }
    };

    fetchProperty();
    fetchBookedSlots();
    fetchUserProfile();
  }, [id]);

  const handleMeetingChange = (e) => {
    const type = e.target.value;
    setMeetingType(type);
    setPrice(type === "virtual" ? 500 : 250);
  };

  const handleSlotSelection = (slot) => {
    // Toggle logic
    if (timeSlot === slot) {
      setTimeSlot("");
    } else {
      setTimeSlot(slot);
    }
  };

  const isFutureDate = (inputDate) => {
    const today = new Date();
    const selectedDate = new Date(inputDate);
    return selectedDate > today;
  };

  const isSlotAlreadyBooked = (selectedDate, selectedSlot) => {
    return bookedSlots.some(
      (booking) => booking.date === selectedDate && booking.timeSlot === selectedSlot
    );
  };

  const handleBookingConfirmation = async () => {
    console.log('Starting booking confirmation...');
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const contactRegex = /^\d{10}$/;

    if (!nameRegex.test(name)) {
      console.log('Name validation failed');
      toast.error("Name should contain only letters.");
      return;
    }
    if (!emailRegex.test(email)) {
      console.log('Email validation failed');
      toast.error("Email must be a valid @gmail.com address.");
      return;
    }
    if (!contactRegex.test(contact)) {
      console.log('Contact validation failed');
      toast.error("Contact number must be exactly 10 digits.");
      return;
    }
    if (!date || !isFutureDate(date)) {
      console.log('Date validation failed');
      toast.error("Please select a valid future date.");
      return;
    }
    if (!timeSlot) {
      console.log('Time slot validation failed');
      toast.error("Please select a time slot.");
      return;
    }
    if (isSlotAlreadyBooked(date, timeSlot)) {
      console.log('Slot already booked');
      toast.error("This slot is already booked. Please select another slot or date.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log('No token found');
        toast.error("You must be logged in.");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId || decoded.id || decoded._id;

      // Ensure we have the user's email
      if (!email) {
        console.log('No email found, fetching user profile...');
        await fetchUserProfile();
        if (!email) {
          toast.error("Could not get your email. Please try again.");
          return;
        }
      }

      const bookingData = {
        userId,
        propertyId: id,
        name,
        email,
        contact,
        meetingType,
        date,
        timeSlot,
        price,
      };

      console.log('Sending booking data:', bookingData);
      const res = await axios.post("http://localhost:4000/api/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201 || res.data.success) {
        console.log('Booking successful');
        toast.success("Booking Confirmed!");
        
        // If it's a virtual meeting, show zoom details
        if (meetingType === "virtual" && res.data.zoomDetails) {
          setZoomDetails(res.data.zoomDetails);
          toast.info(`Zoom meeting details have been sent to ${email}!`);
        }

        navigate('/Place-order', {
          state: {
            bookingDetails: {
              name,
              email,
              contact,
              meetingType,
              date,
              timeSlot
            },
            propertyId: id,
            amount: price
          }
        });
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error("Failed to confirm booking. Try again.");
    }
  };

  const openWhatsApp = () => {
    const message = `Hello, I'm interested in this property: ${property?.type}\n\nLocation: ${property?.location}\nPrice: $${property?.price}\n\n[Image: ${property?.images[0]}]`;
    const whatsappLink = `https://wa.me/${property?.contactNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  const messageAgent = () => {
    window.location.href = `mailto:${property?.user?.email}?subject=Property Booking Inquiry`;
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      {property ? (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <img
                src={property.images[0]}
                alt="Property"
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
            </div>

            <div className="w-full md:w-1/2 px-4">
              <h2 className="text-3xl font-bold text-gray-800">{property.type}</h2>
              <p className="text-gray-600 mt-2">{property.description}</p>
              <p className="text-gray-700 font-medium mt-4">Location: {property.location}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">LKR {property.price}</p>

              {property.user && (
                <div className="mt-6 flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                  {property.user.profilePic && (
                    <img
                      src={property.user.profilePic}
                      alt="User"
                      className="w-16 h-16 rounded-full border shadow-md object-cover"
                    />
                  )}
                  <div>
                    <p className="text-lg font-semibold text-gray-800">Listed by: {property.user.name}</p>
                    <p className="text-sm text-gray-600">{property.user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600">{property.contactNumber}</p>
                      <button
                        onClick={openWhatsApp}
                        className="text-green-600 hover:text-green-800"
                        title="WhatsApp Agent"
                      >
                        <FiPhone size={18} />
                      </button>
                      <button
                        onClick={messageAgent}
                        className="text-blue-600 hover:text-blue-800"
                        title="Email Agent"
                      >
                        <FiMessageSquare size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Available Time Slots</h3>
            <div className="flex gap-2 flex-wrap mb-6">
              {property.slots?.map((slot, idx) => {
                const isBooked = isSlotAlreadyBooked(date, slot);
                const isSelected = timeSlot === slot;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSlotSelection(slot)}
                    disabled={isBooked}
                    className={`px-4 py-2 rounded-md text-white font-medium ${
                      isBooked
                        ? "bg-red-400 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-600"
                        : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Enter Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  const lettersOnly = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setName(lettersOnly);
                }}
                className="w-full p-3 border rounded-md"
              />
              <div className="w-full p-3 border rounded-md bg-gray-50">
                <p className="text-gray-700">{email}</p>
              </div>
              <input
                type="text"
                placeholder="Enter 10-digit phone number"
                value={contact}
                maxLength={10}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setContact(onlyNumbers);
                }}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-medium">Meeting Type:</label>
              <select
                value={meetingType}
                onChange={handleMeetingChange}
                className="w-full p-3 border rounded-md"
              >
                <option value="physical">Physical Meeting (LKR 250)</option>
                <option value="virtual">Virtual Meeting (LKR)</option>
              </select>

              <label className="block text-gray-700 font-medium mt-4">Select Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border rounded-md mb-4"
                min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]}
              />
            </div>

            <p className="text-lg text-gray-800 mt-2 font-medium">
              Selected Time Slot:{" "}
              <span className="text-blue-600 font-semibold">{timeSlot || "None"}</span>
            </p>

            <p className="text-lg font-medium mt-2">Total Price: LKR {price}</p>

            {zoomDetails && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Virtual Meeting Details</h3>
                <p className="text-blue-600 mb-2">
                  <strong>Zoom Link:</strong>{" "}
                  <a 
                    href={zoomDetails.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-800 hover:underline"
                  >
                    {zoomDetails.link}
                  </a>
                </p>
                <p className="text-blue-600">
                  <strong>Meeting Password:</strong> {zoomDetails.password}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  These details have also been sent to your email.
                </p>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <button
                onClick={handleBookingConfirmation}
                className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
              >
                Book & Pay
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">Loading property details...</p>
      )}
    </div>
  );
};

export default BookAppointment;
