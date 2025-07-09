import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const statusColors = {
  pending: "bg-yellow-100 border-yellow-400 text-yellow-800",
  "in-progress": "bg-blue-100 border-blue-400 text-blue-800",
  completed: "bg-green-100 border-green-400 text-green-800",
};

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export default function AdminMaintenanceDashboard() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [deleting, setDeleting] = useState({});
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reporting, setReporting] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch requests
  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching maintenance requests...");
      
      // Check if the backend server is running
      try {
        const serverCheck = await fetch("http://localhost:4000/", {
          method: "GET",
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!serverCheck.ok) {
          throw new Error("Backend server is not responding");
        }
      } catch (serverError) {
        console.error("Server check failed:", serverError);
        setError("Backend server is not responding. Please check if the server is running.");
        setLoading(false);
        return;
      }
      
      const res = await fetch("http://localhost:4000/api/maintenance", {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies in the request
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        
        // Handle specific error cases
        if (res.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem("token"); // Clear invalid token
          setError("Your session has expired. Please log in again.");
          // Redirect to login page after a short delay
          setTimeout(() => {
            window.location.href = "/admin-login";
          }, 2000);
          return;
        }
        
        throw new Error(errorData.message || 'Failed to fetch requests');
      }

      const data = await res.json();
      console.log("Received data:", data);
      
      if (Array.isArray(data)) {
        setRequests(data);
        setFiltered(data);
      } else {
        console.error("Invalid data format:", data);
        setRequests([]);
        setFiltered([]);
        setError(data.error || "Failed to fetch requests.");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setRequests([]);
      setFiltered([]);
      
      // Provide more specific error messages
      if (err.message.includes("Failed to fetch")) {
        setError("Network error: Could not connect to the server. Please check your internet connection and ensure the backend server is running.");
      } else {
        setError(err.message || "Network error. Please check your connection.");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view maintenance requests");
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "/admin-login";
      }, 2000);
      return;
    }
    fetchRequests();
  }, []);

  // Filter by search and date
  useEffect(() => {
    let data = [...requests];
    if (search.trim()) {
      data = data.filter(
        (req) =>
          req.title?.toLowerCase().includes(search.toLowerCase()) ||
          req.description?.toLowerCase().includes(search.toLowerCase()) ||
          req.tenantName?.toLowerCase().includes(search.toLowerCase()) ||
          req.property?.toLowerCase().includes(search.toLowerCase()) ||
          req.createdBy?.name?.toLowerCase().includes(search.toLowerCase()) ||
          req.createdBy?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (dateFrom) {
      data = data.filter(
        (req) => new Date(req.createdAt) >= new Date(dateFrom + "T00:00:00")
      );
    }
    if (dateTo) {
      data = data.filter(
        (req) => new Date(req.createdAt) <= new Date(dateTo + "T23:59:59")
      );
    }
    setFiltered(data);
  }, [search, dateFrom, dateTo, requests]);

  // Chart data: requests per day
  const chartData = (() => {
    const counts = {};
    filtered.forEach((req) => {
      const d = formatDate(req.createdAt);
      counts[d] = (counts[d] || 0) + 1;
    });
    const labels = Object.keys(counts).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    return {
      labels,
      datasets: [
        {
          label: "Requests",
          data: labels.map((d) => counts[d]),
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79,70,229,0.1)",
          tension: 0.4, // Curvy line!
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: "#4f46e5",
        },
      ],
    };
  })();

  // Update status handler
  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdating((prev) => ({ ...prev, [id]: true }));
    const token = localStorage.getItem("token");
    try {
      const form = new FormData();
      form.append("status", newStatus);
      const res = await fetch(`http://localhost:4000/api/maintenance/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.ok) {
        fetchRequests();
      } else {
        alert("Failed to update status");
      }
    } catch {
      alert("Network error");
    }
    setStatusUpdating((prev) => ({ ...prev, [id]: false }));
  };

  // Delete handler with modal
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };
  const confirmDelete = async () => {
    setDeleting((prev) => ({ ...prev, [deleteId]: true }));
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:4000/api/maintenance/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchRequests();
        closeDeleteModal();
      } else {
        alert("Failed to delete request");
      }
    } catch {
      alert("Network error");
    }
    setDeleting((prev) => ({ ...prev, [deleteId]: false }));
  };

  // Report generation
  const reportRef = useRef();
  const handleReport = async (req) => {
    setReporting(req._id);
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Maintenance Request Report', 105, 20, { align: 'center' });
      
      // Add generation date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
      
      // Add request details
      doc.setFontSize(12);
      doc.text('Request Details:', 20, 50);
      doc.text(`Title: ${req.title}`, 20, 60);
      doc.text(`Status: ${req.status}`, 20, 70);
      doc.text(`Created: ${formatDate(req.createdAt)}`, 20, 80);
      if (req.dueDate) {
        doc.text(`Due Date: ${formatDate(req.dueDate)}`, 20, 90);
      }
      
      // Add requester information
      doc.text('Requester Information:', 20, 110);
      doc.text(`Name: ${req.createdBy?.name || 'Unknown'}`, 20, 120);
      doc.text(`Email: ${req.createdBy?.email || 'No Email'}`, 20, 130);
      
      // Add description
      doc.text('Description:', 20, 150);
      
      // Split description into multiple lines if it's too long
      const splitDescription = doc.splitTextToSize(req.description, 170);
      doc.text(splitDescription, 20, 160);
      
      // Add image if available
      if (req.image?.url) {
        try {
          const img = new Image();
          img.src = req.image.url;
          
          await new Promise((resolve) => {
            img.onload = () => {
              const imgWidth = 100;
              const imgHeight = (img.height * imgWidth) / img.width;
              doc.addImage(img, 'JPEG', 20, 200, imgWidth, imgHeight);
              resolve();
            };
            img.onerror = () => {
              doc.text('Image could not be loaded', 20, 200);
              resolve();
            };
          });
        } catch (error) {
          console.error('Error adding image to PDF:', error);
          doc.text('Image could not be added to the report', 20, 200);
        }
      }
      
      // Add footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.text('This is an automatically generated report from the GEWAL Real Estate Management System.', 105, pageHeight - 20, { align: 'center' });
      doc.text(`© ${new Date().getFullYear()} GEWAL Real Estate. All rights reserved.`, 105, pageHeight - 10, { align: 'center' });
      
      // Save the PDF
      doc.save(`maintenance_request_${req._id}.pdf`);
      
      setReporting(null);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
      setReporting(null);
    }
  };

  // Categorize requests by status
  const categorized = {
    pending: [],
    "in-progress": [],
    completed: [],
  };
  filtered.forEach((req) => {
    categorized[req.status]?.push(req);
  });

  const totalCount = filtered.length;

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-4 bg-gray-50 min-h-screen">
      {/* Topbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Maintenance Dashboard</h1>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, desc, user..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-base w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                max={dateTo || ""}
              />
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={dateFrom || ""}
              />
              {(dateFrom || dateTo) && (
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => { setDateFrom(""); setDateTo(""); }}
                >
                  Clear Dates
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-l-4 border-gray-800">
            <span className="text-4xl font-bold text-gray-800">{filtered.length}</span>
            <span className="text-gray-600 font-medium mt-1">Total Requests</span>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-l-4 border-yellow-400">
            <span className="text-4xl font-bold text-yellow-600">
              {filtered.filter(req => req.status === "pending").length}
            </span>
            <span className="text-gray-600 font-medium mt-1">Pending</span>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-l-4 border-blue-400">
            <span className="text-4xl font-bold text-blue-600">
              {filtered.filter(req => req.status === "in-progress").length}
            </span>
            <span className="text-gray-600 font-medium mt-1">In Progress</span>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-l-4 border-green-400">
            <span className="text-4xl font-bold text-green-600">
              {filtered.filter(req => req.status === "completed").length}
            </span>
            <span className="text-gray-600 font-medium mt-1">Completed</span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading maintenance requests...</p>
        </div>
      )}

      {/* No data message */}
      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <svg className="h-16 w-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="mt-4 text-gray-600 text-lg">No maintenance requests found.</p>
        </div>
      )}

      {/* Chart */}
      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Requests Over Time</h2>
          <div className="h-80">
            <Line data={chartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { 
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 12,
                  titleFont: {
                    size: 14
                  },
                  bodyFont: {
                    size: 13
                  }
                }
              },
              elements: { 
                line: { tension: 0.4 },
                point: {
                  radius: 4,
                  hoverRadius: 6
                }
              },
              scales: { 
                y: { 
                  beginAtZero: true, 
                  ticks: { stepSize: 1 },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              }
            }} />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Maintenance Request</h3>
              <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this maintenance request? This action cannot be undone.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmDelete}
                  disabled={deleting[deleteId]}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  {deleting[deleteId] ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Requests */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-8">
          {/* Pending Requests Section */}
          {filtered.filter(req => req.status === "pending").length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Pending Requests
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filtered.filter(req => req.status === "pending").length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered
                  .filter(req => req.status === "pending")
                  .map((req) => (
                    <div 
                      key={req._id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-yellow-500"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <img
                              src={req.createdBy?.profilePic || "https://ui-avatars.com/api/?name=User&background=cccccc&color=555555&size=128"}
                              alt="profile"
                              className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-gray-800">{req.createdBy?.name || "Unknown"}</p>
                              <p className="text-xs text-gray-500">{req.createdBy?.email || "No Email"}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            {req.status}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{req.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{req.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Created: {formatDate(req.createdAt)}</span>
                          {req.dueDate && <span>Due: {formatDate(req.dueDate)}</span>}
                        </div>
                        
                        {req.image?.url && (
                          <img
                            src={req.image.url}
                            alt=""
                            className="w-full h-40 object-cover rounded-lg mb-4"
                          />
                        )}
                        
                        <div className="flex items-center justify-between">
                          <select
                            value={req.status}
                            disabled={statusUpdating[req._id]}
                            onChange={(e) => handleStatusChange(req._id, e.target.value)}
                            className="border border-yellow-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleReport(req)}
                              disabled={reporting === req._id}
                              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
                            >
                              {reporting === req._id ? "Generating..." : "Report"}
                            </button>
                            <button
                              onClick={() => openDeleteModal(req._id)}
                              disabled={deleting[req._id]}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* In Progress Requests Section */}
          {filtered.filter(req => req.status === "in-progress").length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                In Progress Requests
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filtered.filter(req => req.status === "in-progress").length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered
                  .filter(req => req.status === "in-progress")
                  .map((req) => (
                    <div 
                      key={req._id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <img
                              src={req.createdBy?.profilePic || "https://ui-avatars.com/api/?name=User&background=cccccc&color=555555&size=128"}
                              alt="profile"
                              className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-gray-800">{req.createdBy?.name || "Unknown"}</p>
                              <p className="text-xs text-gray-500">{req.createdBy?.email || "No Email"}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {req.status}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{req.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{req.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Created: {formatDate(req.createdAt)}</span>
                          {req.dueDate && <span>Due: {formatDate(req.dueDate)}</span>}
                        </div>
                        
                        {req.image?.url && (
                          <img
                            src={req.image.url}
                            alt=""
                            className="w-full h-40 object-cover rounded-lg mb-4"
                          />
                        )}
                        
                        <div className="flex items-center justify-between">
                          <select
                            value={req.status}
                            disabled={statusUpdating[req._id]}
                            onChange={(e) => handleStatusChange(req._id, e.target.value)}
                            className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleReport(req)}
                              disabled={reporting === req._id}
                              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
                            >
                              {reporting === req._id ? "Generating..." : "Report"}
                            </button>
                            <button
                              onClick={() => openDeleteModal(req._id)}
                              disabled={deleting[req._id]}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Completed Requests Section */}
          {filtered.filter(req => req.status === "completed").length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Completed Requests
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filtered.filter(req => req.status === "completed").length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered
                  .filter(req => req.status === "completed")
                  .map((req) => (
                    <div 
                      key={req._id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-green-500"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <img
                              src={req.createdBy?.profilePic || "https://ui-avatars.com/api/?name=User&background=cccccc&color=555555&size=128"}
                              alt="profile"
                              className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-gray-800">{req.createdBy?.name || "Unknown"}</p>
                              <p className="text-xs text-gray-500">{req.createdBy?.email || "No Email"}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {req.status}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{req.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{req.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Created: {formatDate(req.createdAt)}</span>
                          {req.dueDate && <span>Due: {formatDate(req.dueDate)}</span>}
                        </div>
                        
                        {req.image?.url && (
                          <img
                            src={req.image.url}
                            alt=""
                            className="w-full h-40 object-cover rounded-lg mb-4"
                          />
                        )}
                        
                        <div className="flex items-center justify-between">
                          <select
                            value={req.status}
                            disabled={statusUpdating[req._id]}
                            onChange={(e) => handleStatusChange(req._id, e.target.value)}
                            className="border border-green-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleReport(req)}
                              disabled={reporting === req._id}
                              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
                            >
                              {reporting === req._id ? "Generating..." : "Report"}
                            </button>
                            <button
                              onClick={() => openDeleteModal(req._id)}
                              disabled={deleting[req._id]}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
