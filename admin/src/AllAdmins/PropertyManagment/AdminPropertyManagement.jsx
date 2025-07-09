import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FiTrash2, FiDownload } from "react-icons/fi";
import logo from "../../assets/gewal.png";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminPropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [locationMap, setLocationMap] = useState({});
  const [locationCounts, setLocationCounts] = useState({});
  const [reportProperty, setReportProperty] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const reportRef = useRef();

  const fetchProperties = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/properties/admin/all");
      setProperties(response.data.properties);
      setLoading(false);

      // Count properties by location
      const locationCountMap = {};
      response.data.properties.forEach((p) => {
        const loc = p.location?.trim().toLowerCase();
        if (loc) {
          locationCountMap[loc] = (locationCountMap[loc] || 0) + 1;
        }
      });
      setLocationCounts(locationCountMap);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error("Failed to load properties");
    }
  };

  const deleteProperty = async (id) => {
    setPropertyToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/properties/${propertyToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success("Property has been successfully deleted!", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#10B981",
            color: "#fff",
            fontSize: "16px",
            padding: "16px",
            borderRadius: "8px",
          },
        });
        setProperties(properties.filter((p) => p._id !== propertyToDelete));
      } else {
        toast.error(response.data.message || "Failed to delete property", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#EF4444",
            color: "#fff",
            fontSize: "16px",
            padding: "16px",
            borderRadius: "8px",
          },
        });
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error(error.response?.data?.message || "Failed to delete property. Please try again.", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#EF4444",
          color: "#fff",
          fontSize: "16px",
          padding: "16px",
          borderRadius: "8px",
        },
      });
    } finally {
      setPropertyToDelete(null);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const geocodeLocation = async (locationName) => {
    if (!locationName) return null;

    if (locationMap[locationName.toLowerCase()]) {
      return locationMap[locationName.toLowerCase()];
    }

    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: locationName,
          format: "json",
          limit: 1,
        },
        headers: {
          "Accept-Language": "en-US",
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const coords = [parseFloat(lat), parseFloat(lon)];

        setLocationMap((prev) => ({
          ...prev,
          [locationName.toLowerCase()]: coords,
        }));

        return coords;
      } else {
        toast.error(`Location not found for "${locationName}"`);
        return null;
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      toast.error("Geocoding failed");
      return null;
    }
  };

  const handlePropertyClick = async (property) => {
    const coords = await geocodeLocation(property.location);
    if (coords) {
      setSelectedProperty({
        ...property,
        locationCoords: coords,
      });
    }
  };

  const createCustomIcon = (imageUrl) => {
    return new L.Icon({
      iconUrl: imageUrl,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
      className: "leaflet-marker-icon rounded-full",
    });
  };

  const center = [7.8731, 80.7718]; // Sri Lanka center
  const zoom = 7;

  // Download property report as PDF
  const handleDownloadReport = async (property) => {
    setDownloadingId(property._id);
    setReportProperty(property);
    setTimeout(async () => {
      if (reportRef.current) {
        const canvas = await html2canvas(reportRef.current, { 
          useCORS: true, 
          backgroundColor: "#fff",
          scale: 2 // Higher quality
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${property.type}_report_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.pdf`);
        
        setReportProperty(null);
        setDownloadingId(null);
      }
    }, 2000); // 2 seconds loading
  };

  if (loading) return <div className="text-center mt-10 text-xl">Loading properties...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-8 w-full">
      {/* Delete Confirmation Modal */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setPropertyToDelete(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Report Render for PNG Download */}
      {reportProperty && (
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: "800px",
            padding: "40px",
            background: "#fff",
            zIndex: -1,
            fontFamily: "sans-serif",
          }}
        >
          <div
            ref={reportRef}
            style={{
              border: "2px solid #2563eb",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "0 0 16px rgba(0,0,0,0.08)",
              minHeight: "900px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Header */}
            <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "18px", marginBottom: "24px", textAlign: "center" }}>
              <img src={logo} alt="Logo" style={{ height: "64px", margin: "0 auto 10px" }} />
              <h2 style={{ fontSize: "2rem", color: "#1e293b", fontWeight: 700, margin: 0 }}>Property Report</h2>
            </div>

            {/* Property Details */}
            <div>
              <div style={{ display: "flex", gap: "32px", marginBottom: "24px" }}>
                <img
                  src={reportProperty.images[0]}
                  alt="Property"
                  style={{ width: "300px", height: "200px", objectFit: "cover", borderRadius: "12px", border: "1px solid #e5e7eb" }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#2563eb" }}>{reportProperty.type}</h3>
                  <p style={{ color: "#334155", margin: "8px 0" }}>{reportProperty.description}</p>
                  <p style={{ color: "#16a34a", fontWeight: 700, fontSize: "1.1rem" }}>
                    Rs. {reportProperty.price}
                  </p>
                  <p style={{ color: "#1e293b" }}>📍 {reportProperty.location}</p>
                  <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                    📞 {reportProperty.contactNumber} | ✉️ {reportProperty.email}
                  </p>
                  <div style={{ marginTop: "10px" }}>
                    <span style={{ fontWeight: 500 }}>Available Slots:</span>
                    <ul style={{ marginLeft: "20px", color: "#334155", fontSize: "0.97rem" }}>
                      {reportProperty.slots?.map((slot, i) => (
                        <li key={i}>{slot}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                <img
                  src={reportProperty.user?.profilePic || "/default-user.png"}
                  alt="User"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                />
                <div>
                  <p style={{ fontWeight: 600, margin: 0, color: "#1e293b" }}>
                    {reportProperty.user?.name || "Deleted User"}
                  </p>
                  <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
                    {reportProperty.user?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div style={{ border: "1px dashed #2563eb", borderRadius: "8px", padding: "10px 18px", marginTop: "12px" }}>
                <strong>Property ID:</strong> {reportProperty._id}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                marginTop: "32px",
                paddingTop: "18px",
                textAlign: "center",
                color: "#64748b",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              <div>
                <span>Generated by Property Management Admin</span>
                <span style={{ marginLeft: "18px" }}>
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property List Section */}
      <div className="w-3/5">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Admin Property Management</h1>
        <p className="text-center text-gray-500 mb-6">Total Properties: {properties.length}</p>

        {properties.length === 0 ? (
          <p className="text-center text-gray-500">No properties available.</p>
        ) : (
          <div className="space-y-6">
            {properties.map((property) => {
              const user = property.user;
              const isDownloading = downloadingId === property._id;

              return (
                <div
                  key={property._id}
                  className="bg-white shadow-md rounded-lg p-6 border border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex gap-2 overflow-x-auto">
                        {property.images.map((img, index) => (
                          <img key={index} src={img} alt="Property" className="h-40 w-60 object-cover rounded" />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={user?.profilePic || "/default-user.png"}
                          alt="User"
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{user?.name || "Deleted User"}</p>
                          <p className="text-xs text-gray-500">{user?.email || "N/A"}</p>
                        </div>
                      </div>

                      <h2 className="text-xl font-semibold text-gray-800">{property.type}</h2>
                      <p className="text-gray-600">{property.description}</p>
                      <p className="text-green-600 font-bold">Rs. {property.price}</p>
                      <p className="text-gray-700">📍 {property.location}</p>
                      <p className="text-sm text-gray-500">
                        📞 {property.contactNumber} | ✉️ {property.email}
                      </p>

                      <div className="mt-2">
                        <span className="font-medium">Available Slots:</span>
                        <ul className="list-disc ml-6 text-sm text-gray-600">
                          {property.slots?.map((slot, i) => (
                            <li key={i}>{slot}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-col gap-2">
                        {/* Delete Button with Tooltip */}
                        <div className="relative group w-14 h-14">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProperty(property._id);
                            }}
                            className="w-14 h-14 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded shadow-md transition"
                            aria-label="Delete property details"
                          >
                            <FiTrash2 className="w-7 h-7" />
                          </button>
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 pointer-events-none transition bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20">
                            Delete property details
                          </div>
                        </div>
                        {/* Download Button with Tooltip and Loading */}
                        <div className="relative group w-14 h-14">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isDownloading) handleDownloadReport(property);
                            }}
                            className={`w-14 h-14 flex items-center justify-center bg-black hover:bg-blue-700 text-white rounded shadow-md transition ${isDownloading ? "opacity-70 cursor-not-allowed" : ""}`}
                            aria-label="Download report"
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <svg className="animate-spin h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                              </svg>
                            ) : (
                              <FiDownload className="w-7 h-7" />
                            )}
                          </button>
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 pointer-events-none transition bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20">
                            Download report
                          </div>
                          {/* Loading text overlay */}
                          {isDownloading && (
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-white text-xs px-3 py-2 rounded z-30 flex flex-col items-center">
                              <span className="font-semibold mb-1">Downloading...</span>
                              <span>
                                Your report for <span className="font-bold">{property.type}</span> is downloading
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Map + Chart Section */}
      <div className="w-2/5">
        <div className="sticky top-6 z-10">
          <MapContainer
            center={selectedProperty?.locationCoords || center}
            zoom={zoom}
            style={{ height: "600px", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {selectedProperty && selectedProperty.locationCoords && (
              <Marker
                position={selectedProperty.locationCoords}
                icon={createCustomIcon(selectedProperty.images[0])}
              >
                <Popup>
                  <div>
                    <strong>{selectedProperty.type}</strong>
                    <p>{selectedProperty.description}</p>
                    <p>Location: {selectedProperty.location}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          <div className="mt-2 bg-white p-3 rounded shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700">Map View</h3>
            <p className="text-sm text-gray-500">Click a property to view its location</p>
          </div>

          {/* 📊 Location Chart */}
          {Object.keys(locationCounts).length > 0 && (
            <div className="mt-6 bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold text-center text-gray-700 mb-4">
                Properties by Location
              </h3>
              <Bar
                data={{
                  labels: Object.keys(locationCounts).map(
                    (loc) => loc.charAt(0).toUpperCase() + loc.slice(1)
                  ),
                  datasets: [
                    {
                      label: "Number of Properties",
                      data: Object.values(locationCounts),
                      backgroundColor: "rgba(54, 162, 235, 0.6)",
                      borderColor: "rgba(54, 162, 235, 1)",
                      borderWidth: 1,
                      borderRadius: 4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPropertyManagement;
