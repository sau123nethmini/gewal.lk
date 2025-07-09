import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import moment from "moment";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    meetingType: "",
    date: "",
    timeSlot: "",
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view your bookings");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setBookings(res.data.bookings);
      } else {
        toast.error("Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(error.response?.data?.message || "Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to delete bookings");
        return;
      }

      await axios.delete(`http://localhost:4000/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error.response?.data?.message || "Failed to delete booking");
    }
  };

  const openEditModal = (booking) => {
    const createdAt = moment(booking.createdAt);
    const now = moment();
    const hoursDiff = now.diff(createdAt, "hours");

    if (hoursDiff > 3) {
      toast.warn("⛔ You can't edit this booking. 3-hour window expired.");
    } else {
      setEditingBooking(booking);
      setFormData({
        name: booking.name,
        email: booking.email,
        contact: booking.contact,
        meetingType: booking.meetingType,
        date: booking.date,
        timeSlot: booking.timeSlot,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyLetters }));
    } else if (name === "contact") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: onlyNumbers }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitEdit = async () => {
    if (moment(formData.date).isBefore(moment(), "day")) {
      toast.error("Please select a future date.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to edit bookings");
        return;
      }

      await axios.put(
        `http://localhost:4000/api/bookings/${editingBooking._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Booking updated successfully");
      setEditingBooking(null);
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error(error.response?.data?.message || "Failed to update booking");
    }
  };

  const closeModal = () => {
    setEditingBooking(null);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const todayDate = moment().format("YYYY-MM-DD");

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-center text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        📅 My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings found.</p>
      ) : (
        bookings.map((b) => {
          const createdAt = moment(b.createdAt);
          const now = moment();
          const hoursDiff = now.diff(createdAt, "hours");
          const canEdit = hoursDiff <= 3;

          return (
            <div
              key={b._id}
              className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-800">
                    {b.property?.type}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Booked on: {moment(b.createdAt).format("YYYY-MM-DD hh:mm A")}
                  </p>
                </div>
                <p className="text-lg font-semibold text-green-700">
                  ${b.price}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <p><strong>Date:</strong> {b.date}</p>
                <p><strong>Time Slot:</strong> {b.timeSlot}</p>
                <p><strong>Meeting Type:</strong> {b.meetingType}</p>
                <p><strong>Name:</strong> {b.name}</p>
                <p><strong>Email:</strong> {b.email}</p>
                <p><strong>Contact:</strong> {b.contact}</p>
                {b.property && (
                  <>
                    <p><strong>Location:</strong> {b.property.location}</p>
                    <p><strong>Property Price:</strong> ${b.property.price}</p>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6 items-start sm:items-center">
                <div>
                  <button
                    onClick={() => openEditModal(b)}
                    disabled={!canEdit}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition ${
                      canEdit
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    title={canEdit ? "Edit Booking" : "Edit not allowed after 3 hours"}
                  >
                    <FiEdit2 />
                    Edit
                  </button>
                  {!canEdit && (
                    <p className="text-sm text-red-500 mt-1">
                      ⛔ Edit disabled after 3 hours.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteBooking(b._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold transition"
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Edit Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700 font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-semibold">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="XXXXXXXXXX"
                  className="w-full border border-gray-300 p-2 rounded"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-semibold">Meeting Type</label>
                <select
                  name="meetingType"
                  value={formData.meetingType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Select Meeting Type</option>
                  <option value="Physical">Physical</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-semibold">Date</label>
                <input
                  type="date"
                  name="date"
                  min={todayDate}
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-semibold">Time Slot</label>
                <input
                  type="text"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  placeholder="Time Slot"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
