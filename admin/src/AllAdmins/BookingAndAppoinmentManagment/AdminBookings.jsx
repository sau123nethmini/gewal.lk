import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/bookings/all");
      const allBookings = response.data.bookings || [];
      setBookings(allBookings);
      setFilteredBookings(allBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (date) => {
    if (!date) {
      setFilteredBookings(bookings);
      return;
    }

    const filtered = bookings.filter((booking) => {
      const bookingDate = new Date(booking.date).toISOString().split("T")[0];
      return bookingDate === date;
    });

    setFilteredBookings(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/bookings/admin/${id}`);
      toast.success("Booking deleted successfully.");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking.");
    }
  };

  const calculateTotalPrice = () => {
    return filteredBookings.reduce((total, booking) => total + booking.price, 0);
  };

  // Prepare data for Doughnut Chart
  const meetingTypeCounts = filteredBookings.reduce(
    (acc, booking) => {
      const type = booking.meetingType?.toLowerCase();
      if (type === "virtual") acc.virtual += 1;
      else if (type === "physical") acc.physical += 1;
      return acc;
    },
    { virtual: 0, physical: 0 }
  );

  const doughnutData = {
    labels: ["Virtual Meetings", "Physical Meetings"],
    datasets: [
      {
        label: "Meeting Type",
        data: [meetingTypeCounts.virtual, meetingTypeCounts.physical],
        backgroundColor: ["#CF9FFF", "#E6E6FA"],
        borderColor: ["#CF9FFF", "#E6E6FA"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const downloadPDF = (booking) => {
    const doc = new jsPDF();
    
    // Add logo and header
    doc.setFontSize(24);
    doc.setTextColor(128, 0, 128); // Purple color
    doc.text('GEWAL Real Estate', 105, 20, { align: 'center' });
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Booking Details Report', 105, 35, { align: 'center' });
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Gray color
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 45, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(128, 0, 128);
    doc.line(20, 50, 190, 50);
    
    // Add booking information with better formatting
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Booking Details Section
    doc.setFont(undefined, 'bold');
    doc.text('Booking Information', 20, 65);
    doc.setFont(undefined, 'normal');
    
    const bookingDetails = [
      { label: 'Booking ID', value: booking._id },
      { label: 'Date', value: new Date(booking.date).toLocaleDateString() },
      { label: 'Time Slot', value: booking.timeSlot },
      { label: 'Meeting Type', value: booking.meetingType },
      { label: 'Price', value: `$${booking.price}` }
    ];
    
    let yPos = 75;
    bookingDetails.forEach(detail => {
      doc.text(`${detail.label}:`, 20, yPos);
      doc.text(detail.value, 60, yPos);
      yPos += 10;
    });
    
    // User Information Section
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text('User Information', 20, yPos);
    doc.setFont(undefined, 'normal');
    
    const userDetails = [
      { label: 'Name', value: booking.user?.name || 'N/A' },
      { label: 'Email', value: booking.user?.email || 'N/A' },
      { label: 'Contact', value: booking.contact }
    ];
    
    yPos += 10;
    userDetails.forEach(detail => {
      doc.text(`${detail.label}:`, 20, yPos);
      doc.text(detail.value, 60, yPos);
      yPos += 10;
    });
    
    // Property Information Section (if available)
    if (booking.property) {
      yPos += 10;
      doc.setFont(undefined, 'bold');
      doc.text('Property Information', 20, yPos);
      doc.setFont(undefined, 'normal');
      
      const propertyDetails = [
        { label: 'Type', value: booking.property.type },
        { label: 'Location', value: booking.property.location },
        { label: 'Price', value: `$${booking.property.price}` }
      ];
      
      yPos += 10;
      propertyDetails.forEach(detail => {
        doc.text(`${detail.label}:`, 20, yPos);
        doc.text(detail.value, 60, yPos);
        yPos += 10;
      });
    }
    
    // Add footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('This is an automatically generated report from the GEWAL Real Estate Management System.', 105, pageHeight - 20, { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} GEWAL Real Estate. All rights reserved.`, 105, pageHeight - 10, { align: 'center' });
    
    // Save the PDF with a professional filename
    doc.save(`booking_report_${booking._id}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
        📋 All Booking Details
      </h2>

      {/* Filter by Date */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <label className="text-lg font-medium text-gray-700">📅 Filter by Date:</label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            filterByDate(e.target.value);
          }}
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={() => {
            setDateFilter("");
            filterByDate("");
          }}
          className="bg-gray-200 hover:bg-gray-300 text-sm font-medium py-2 px-4 rounded"
        >
          Clear Filter
        </button>
      </div>

      {/* Total Price */}
      <div className="mb-6 text-lg font-semibold text-gray-800">
        Total Price of Filtered Bookings:{" "}
        <span className="text-green-600">${calculateTotalPrice()}</span>
      </div>

      {/* Doughnut Chart */}
      <div className="mb-10 w-full max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">
          🧮 Meeting Type Analysis
        </h3>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>

      {/* Booking List */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-center text-red-500 text-lg">No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
            >
              {/* User Info */}
              <div className="flex items-center mb-4">
                {b.user?.profilePic ? (
                  <img
                    src={b.user.profilePic}
                    alt="User"
                    className="w-16 h-16 rounded-full border shadow-md object-cover mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <span className="text-gray-600 font-bold">N/A</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{b.user?.name || "N/A"}</h3>
                  <p className="text-sm text-gray-600">{b.user?.email || "N/A"}</p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>Meeting Type:</strong> {b.meetingType}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(b.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time Slot:</strong> {b.timeSlot}
                </p>
                <p>
                  <strong>Contact:</strong> {b.contact}
                </p>
                <p>
                  <strong>Price:</strong> ${b.price}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end gap-x-2">
                <button
                  onClick={() => downloadPDF(b)}
                  className="px-[10px] py-[6px] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="px-[10px] py-[6px] bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;

