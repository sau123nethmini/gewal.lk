import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaDownload, FaTrash, FaSearch } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import html2canvas from "html2canvas";
import logo from "../../assets/gewal.png";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";

// Spinner for download animation
const Spinner = ({ show, text }) =>
  show ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <span className="text-white text-lg">{text || "Generating report..."}</span>
      </div>
    </div>
  ) : null;

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=cccccc&color=555555&size=128";

const TicketAdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [replyData, setReplyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [solvedData, setSolvedData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);
  const reportRef = useRef();
  const [downloading, setDownloading] = useState(false);

  

  

  

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/tickets/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data.tickets);

      // Analytics
      const solvedByDay = {};
      response.data.tickets.forEach((ticket) => {
        if (ticket.replies.length > 0) {
          const day = new Date(ticket.updatedAt).toLocaleDateString();
          solvedByDay[day] = (solvedByDay[day] || 0) + 1;
        }
      });
      setSolvedData(
        Object.entries(solvedByDay)
          .sort((a, b) => new Date(a[0]) - new Date(b[0]))
          .map(([date, count]) => ({ date, count }))
      );

      // Top customers
      const customerMap = {};
      response.data.tickets.forEach((ticket) => {
        const email = ticket.userId?.email || "Unknown";
        if (!customerMap[email]) {
          customerMap[email] = {
            name: ticket.userId?.name || "Unknown",
            profilePic: ticket.userId?.profilePic || DEFAULT_AVATAR,
            email,
            count: 0,
          };
        }
        customerMap[email].count += 1;
      });
      setTopCustomers(
        Object.values(customerMap)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch tickets");
    }
  };

  // Stats
  const totalTickets = tickets.length;
  const solvedTickets = tickets.filter((t) => t.replies.length > 0).length;
  const pendingTickets = tickets.filter((t) => t.replies.length === 0).length;
  const todaySolved = tickets.filter(
    (t) =>
      t.replies.length > 0 &&
      new Date(t.updatedAt).toLocaleDateString() === new Date().toLocaleDateString()
  ).length;

  // Calculate average tickets per day
  let avgTicketsPerDay = 0;
  if (tickets.length > 0) {
    const sorted = [...tickets].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const firstDate = new Date(sorted[0].createdAt);
    const lastDate = new Date();
    const diffDays = Math.max(
      1,
      Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24))
    );
    avgTicketsPerDay = (tickets.length / diffDays).toFixed(2);
  }

  // Search and date filter logic
  const filteredTickets = tickets.filter((ticket) => {
    const searchMatch =
      ticket.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.userId?.email?.toLowerCase().includes(search.toLowerCase());
    let dateMatch = true;
    if (dateFrom) {
      dateMatch =
        dateMatch && new Date(ticket.createdAt) >= new Date(dateFrom + "T00:00:00");
    }
    if (dateTo) {
      dateMatch =
        dateMatch && new Date(ticket.createdAt) <= new Date(dateTo + "T23:59:59");
    }
    return searchMatch && dateMatch;
  });

  // Collect ticket images for lightbox
  const ticketImages = filteredTickets.map((ticket) => ticket.image).filter((img) => !!img);

  // Download overall report as PNG
  const downloadReport = async () => {
    setDownloading(true);
    try {
      if (!reportRef.current) return;
      // Render only the portrait report div, not the whole page!
      const canvas = await html2canvas(reportRef.current, {
        useCORS: true,
        backgroundColor: "#fff",
        width: 600,
        height: 900,
        scale: 2 // for high quality
      });
      const link = document.createElement("a");
      link.download = `ticket_main_report_${new Date().toLocaleDateString().replace(/\//g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  
  

  // Download per-ticket report as PNG
  const downloadTicketReport = async (ticket) => {
    setDownloading(true);
    try {
      // Create a temporary DOM node for the ticket report
      const temp = document.createElement("div");
      temp.style.position = "fixed";
      temp.style.left = "-9999px";
      temp.style.top = "0";
      temp.style.background = "#fff";
      temp.style.width = "600px";
      temp.style.padding = "24px";
      temp.innerHTML = `
        <div style="border:2px solid #4f46e5;border-radius:12px;box-shadow:0 2px 8px #0001;">
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eee;padding-bottom:8px;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:12px;">
              <img src="${logo}" alt="Logo" style="height:40px;width:40px;border-radius:8px;" />
              <span style="font-size:20px;font-weight:bold;color:#4f46e5;">Ticket Report</span>
            </div>
            <span style="color:#888;font-size:12px;">${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}</span>
          </div>
          <div style="margin-bottom:16px;">
            <strong>User:</strong> ${ticket.userId?.name || "Unknown"}<br/>
            <strong>Email:</strong> ${ticket.userId?.email || "Unknown"}<br/>
            <strong>Product:</strong> ${ticket.product}<br/>
            <strong>Subject:</strong> ${ticket.subject}<br/>
            <strong>Inquiry:</strong> ${ticket.inquiry}<br/>
            <strong>Status:</strong> ${ticket.replies.length > 0 ? "Solved" : "Pending"}<br/>
          </div>
          ${
            ticket.image
              ? `<div style="margin-bottom:16px;">
                  <img src="${ticket.image}" alt="Ticket" style="max-width:100%;border-radius:8px;border:2px solid #eee;" />
                </div>`
              : ""
          }
          <div style="border-top:1px solid #eee;padding-top:8px;margin-top:16px;display:flex;justify-content:space-between;font-size:12px;color:#888;">
            <span>&copy; ${new Date().getFullYear()} Ticket Support System</span>
            <span>Generated by customersupport admin</span>
          </div>
        </div>
      `;
      document.body.appendChild(temp);
      const canvas = await html2canvas(temp, {
        useCORS: true,
        backgroundColor: "#fff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `ticket_${ticket._id}_report.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      document.body.removeChild(temp);
    } finally {
      setDownloading(false);
    }
  };

  // Ticket actions
  const handleReplyChange = (ticketId, value) => {
    setReplyData((prev) => ({ ...prev, [ticketId]: value }));
  };

  const handleReplySubmit = async (ticketId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/tickets/reply",
        { ticketId, reply: replyData[ticketId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Reply sent successfully");
      setReplyData((prev) => ({ ...prev, [ticketId]: "" }));
      fetchTickets();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/tickets/delete/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      setMessage("Ticket deleted successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete ticket");
    }
  };

  // Lightbox open handler
  const openLightbox = (imgUrl) => {
    const idx = ticketImages.findIndex((img) => img === imgUrl);
    setLightboxImages(ticketImages);
    setLightboxIndex(idx);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <Spinner show={downloading} text="Generating high-quality PNG report..." />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12 w-12 rounded" />
          <h1 className="text-3xl font-bold text-blue-900">Support Tickets Admin Dashboard</h1>
        </div>
        <button
          onClick={downloadReport}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
          disabled={downloading}
        >
          <FaDownload className="mr-2" />
          Download Main Report (PNG)
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full md:w-1/3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name or email"
            className="outline-none w-full bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="p-2 border rounded"
            max={dateTo || ""}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="p-2 border rounded"
            min={dateFrom || ""}
          />
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
            className="ml-2 text-blue-600 underline"
          >
            Clear Dates
          </button>
        )}
      </div>

      {/* Main Report for PNG export */}
      <div
        ref={reportRef}
        className="bg-white rounded-xl shadow p-8 mx-auto border-4 border-blue-400 max-w-2xl mb-8"
        style={{
          fontFamily: "Segoe UI, Arial, sans-serif",
          background: "linear-gradient(to bottom right, #f3f4f6, #e0e7ff)",
        }}
      >
        {/* PNG Header */}
        <div className="flex items-center justify-between border-b-2 border-blue-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" style={{ height: 56, width: 56, borderRadius: 12 }} />
            <span className="text-2xl font-bold text-blue-800">GEWAL Ticket Main Report</span>
          </div>
          <span className="text-gray-500 text-sm font-semibold">
            {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* Report Summary */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl shadow p-6 flex flex-col items-center border-2 border-blue-200">
            <span className="text-3xl font-bold text-blue-700">{totalTickets}</span>
            <span className="text-gray-600 mt-1 font-semibold">Total Tickets</span>
          </div>
          <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col items-center border-2 border-green-200">
            <span className="text-3xl font-bold text-green-600">{solvedTickets}</span>
            <span className="text-gray-600 mt-1 font-semibold">Resolved Tickets</span>
          </div>
          <div className="bg-yellow-50 rounded-xl shadow p-6 flex flex-col items-center border-2 border-yellow-200">
            <span className="text-3xl font-bold text-yellow-600">{pendingTickets}</span>
            <span className="text-gray-600 mt-1 font-semibold">Pending Tickets</span>
          </div>
          <div className="bg-purple-50 rounded-xl shadow p-6 flex flex-col items-center border-2 border-purple-200">
            <span className="text-3xl font-bold text-purple-700">{avgTicketsPerDay}</span>
            <span className="text-gray-600 mt-1 font-semibold">Avg Tickets/Day</span>
          </div>
        </div>

        {/* PNG Footer */}
        <div className="border-t-2 border-blue-200 pt-4 mt-8 flex justify-between items-center text-xs text-gray-400 font-semibold">
          <span>
            &copy; {new Date().getFullYear()} GEWAL Ticket Support System. All rights reserved.
          </span>
          <span>Generated by customersupport admin</span>
        </div>
      </div>

      {/* Main Content: Analytics, Table, etc. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow p-6 col-span-2 border border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Solved Tickets Over Time</h2>
            <span className="text-gray-400 text-sm">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={solvedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Customers</h2>
          <ul>
            {topCustomers.map((c, i) => (
              <li key={i} className="flex items-center mb-4">
                <img
                  src={c.profilePic}
                  alt={c.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover mr-3"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-700">{c.name}</span>
                  <span className="block text-xs text-gray-400">{c.email}</span>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  {c.count} Tickets
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Tickets</h2>
          <span className="text-gray-400 text-sm">
            Showing {Math.min(10, filteredTickets.length)} of {filteredTickets.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 text-left">User</th>
                <th className="py-2 px-3 text-left">Product</th>
                <th className="py-2 px-3 text-left">Subject</th>
                <th className="py-2 px-3 text-left">Inquiry</th>
                <th className="py-2 px-3 text-left">Image</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-left">Reply</th>
                <th className="py-2 px-3 text-left">Delete</th>
                <th className="py-2 px-3 text-left">Report</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.slice(0, 10).map((ticket) => (
                <tr key={ticket._id} className="border-b">
                  <td className="py-2 px-3 flex items-center">
                    <img
                      src={
                        ticket.userId?.profilePic
                          ? ticket.userId.profilePic
                          : DEFAULT_AVATAR
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full mr-2 border-2 border-blue-400 object-cover"
                    />
                    <span>
                      {ticket.userId?.name || "Unknown"}
                      <br />
                      <span className="text-xs text-gray-400">
                        {ticket.userId?.email || "No Email"}
                      </span>
                    </span>
                  </td>
                  <td className="py-2 px-3">{ticket.product}</td>
                  <td className="py-2 px-3">{ticket.subject}</td>
                  <td className="py-2 px-3">{ticket.inquiry}</td>
                  <td className="py-2 px-3">
                    {ticket.image ? (
                      <img
                        src={ticket.image}
                        alt="Ticket"
                        className="w-14 h-14 rounded-lg object-cover border-2 border-blue-200 cursor-pointer hover:scale-105 transition"
                        onClick={() => openLightbox(ticket.image)}
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {ticket.replies.length > 0 ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                        Solved
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex flex-col">
                      <textarea
                        className="w-full p-1 border rounded mb-1"
                        rows="1"
                        placeholder="Reply..."
                        value={replyData[ticket._id] || ""}
                        onChange={(e) =>
                          handleReplyChange(ticket._id, e.target.value)
                        }
                      />
                      <button
                        className="bg-black text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                        onClick={() => handleReplySubmit(ticket._id)}
                        disabled={loading || !replyData[ticket._id]}
                      >
                        {loading ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <FaTrash
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      size={16}
                      title="Delete Ticket"
                      onClick={() => deleteTicket(ticket._id)}
                    />
                  </td>
                  <td className="py-2 px-3">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                      onClick={() => downloadTicketReport(ticket)}
                      disabled={downloading}
                    >
                      <FaDownload className="inline mr-1" />
                      Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {message && (
          <p className="text-center text-red-500 mt-4">{message}</p>
        )}
      </div>

      {/* Lightbox for ticket images */}
      {isLightboxOpen && (
        <Lightbox
          mainSrc={lightboxImages[lightboxIndex]}
          nextSrc={lightboxImages[(lightboxIndex + 1) % lightboxImages.length]}
          prevSrc={
            lightboxImages[
              (lightboxIndex + lightboxImages.length - 1) % lightboxImages.length
            ]
          }
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex(
              (lightboxIndex + lightboxImages.length - 1) % lightboxImages.length
            )
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)
          }
          imageTitle={`Ticket Image ${lightboxIndex + 1} of ${lightboxImages.length}`}
          reactModalStyle={{
            overlay: { zIndex: 10000 },
          }}
        />
      )}



      {/* Portrait Report for PNG export */}
<div
  ref={reportRef}
  style={{
    width: "600px",
    height: "900px",
    padding: "40px 32px",
    background: "#fff",
    border: "4px solid #4f46e5",
    borderRadius: "24px",
    boxShadow: "0 8px 32px #0002",
    position: "fixed",
    left: "-9999px", // Hide off screen
    top: 0,
    zIndex: -1,
    display: "block",
    fontFamily: "Segoe UI, Arial, sans-serif"
  }}
>
  {/* Header */}
  <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #e0e7ff", paddingBottom: 24, marginBottom: 32 }}>
    <img src={logo} alt="Logo" style={{ height: 64, width: 64, borderRadius: 16, marginRight: 24 }} />
    <div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#4f46e5" }}>GEWAL Ticket Main Report</div>
      <div style={{ color: "#888", fontSize: 16, fontWeight: 500 }}>
        {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}
      </div>
    </div>
  </div>
  {/* Stats */}
  <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: 1, marginRight: 16, background: "#f1f5ff", borderRadius: 12, padding: 24, textAlign: "center", border: "2px solid #4f46e5" }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#4f46e5" }}>{totalTickets}</div>
        <div style={{ color: "#555", marginTop: 8, fontWeight: 600 }}>Total Tickets</div>
      </div>
      <div style={{ flex: 1, marginRight: 16, background: "#e7fbe9", borderRadius: 12, padding: 24, textAlign: "center", border: "2px solid #22c55e" }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#22c55e" }}>{solvedTickets}</div>
        <div style={{ color: "#555", marginTop: 8, fontWeight: 600 }}>Resolved Tickets</div>
      </div>
      <div style={{ flex: 1, background: "#fffbe7", borderRadius: 12, padding: 24, textAlign: "center", border: "2px solid #eab308" }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#eab308" }}>{pendingTickets}</div>
        <div style={{ color: "#555", marginTop: 8, fontWeight: 600 }}>Pending Tickets</div>
      </div>
    </div>
  </div>
  {/* Footer */}
  <div style={{ position: "absolute", bottom: 40, left: 32, right: 32, borderTop: "1.5px solid #e0e7ff", paddingTop: 20, display: "flex", justifyContent: "space-between", color: "#888", fontSize: 14, fontWeight: 500 }}>
    <span>&copy; {new Date().getFullYear()} GEWAL Ticket Support System</span>
    <span>Generated by customersupport admin</span>
  </div>
</div>

    </div>

    
  );
};

export default TicketAdminDashboard;
