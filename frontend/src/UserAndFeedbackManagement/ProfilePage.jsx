import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserPropList from "../PropertyManagement/UserPropList";
import {
  FiEdit,
  FiTrash2,
  FiLogOut,
  FiCalendar,
  FiUpload,
  FiKey,
  FiMail,
  FiLock,
  FiX
} from "react-icons/fi";
import   TenantRequestsCards from "../UserAndFeedbackManagement/TenantRequestsCards"

const ProfilePage = () => {
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [totalListings, setTotalListings] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();
  const savedToken = token || localStorage.getItem("token");

  useEffect(() => {
    if (!savedToken) return navigate("/login");

    axios
      .get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          setEditData({ name: res.data.user.name, email: res.data.user.email });
        } else toast.error("Failed to fetch profile");
      })
      .catch(() => toast.error("Error fetching profile"))
      .finally(() => setLoading(false));

    // Fetch booking count
    axios
      .get(`${backendUrl}/api/bookings/count`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
      .then((res) => {
        if (res.data.success) {
          setBookingCount(res.data.count);
        } else {
          console.error("Failed to fetch booking count:", res.data.message);
          setBookingCount(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching booking count:", error);
        setBookingCount(0);
      });
  }, [savedToken, backendUrl, navigate]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("email", editData.email);
      if (profilePicFile) formData.append("profilePic", profilePicFile);

      const res = await axios.put(
        `${backendUrl}/api/user/update/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Profile updated!");
        setUser(res.data.user);
        setEditData({ name: res.data.user.name, email: res.data.user.email });
        setProfilePicFile(null);
        setShowEditModal(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Error updating profile");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const res = await axios.delete(
        `${backendUrl}/api/user/delete/${user._id}`,
        { headers: { Authorization: `Bearer ${savedToken}` } }
      );

      if (res.data.success) {
        toast.success("Account deleted");
        setToken("");
        localStorage.removeItem("token");
        navigate("/register");
      } else toast.error("Failed to delete account");
    } catch {
      toast.error("Error deleting account");
    }
  };

  const handleSendOtp = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/send-otp`, { email: forgotEmail });
      if (res.data.success) {
        toast.success("OTP sent to your email!");
        setOtpSent(true);
      } else toast.error("Failed to send OTP");
    } catch {
      toast.error("Error sending OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/reset-password`, {
        email: forgotEmail,
        otp: enteredOtp,
        newPassword,
      });
      if (res.data.success) {
        toast.success("Password updated successfully!");
        setShowForgotModal(false);
        setOtpSent(false);
        setEnteredOtp("");
        setNewPassword("");
        setForgotEmail("");
      } else toast.error(res.data.message || "Failed to reset password");
    } catch {
      toast.error("Error resetting password");
    }
  };

  if (loading) return <div className="text-center mt-10 text-xl font-medium">Loading profile...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-6 py-10 w-full">
      <div className="w-full max-w-6xl bg-white rounded-lg p-8 flex flex-col lg:flex-row relative shadow-md">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 p-6 border-r">
          <h2 className="text-xl font-bold text-gray-700 mb-4">User Details</h2>
          <div className="relative flex flex-col items-center">
            <img
              src={user.profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-gray-300 object-cover cursor-pointer shadow-md hover:scale-105 transition"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-64 bg-white shadow-xl rounded-md p-4 z-50">
                <h2 className="text-lg font-bold text-center">{user.name}</h2>
                <p className="text-sm text-center text-gray-600 mb-4">{user.email}</p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setShowEditModal(true)} 
                    className="flex items-center gap-2 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    <FiEdit className="w-4 h-4" /> Edit Profile
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className="flex items-center gap-2 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    <FiTrash2 className="w-4 h-4" /> Delete Account
                  </button>
                  <button 
                    onClick={() => setShowForgotModal(true)} 
                    className="flex items-center gap-2 w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                  >
                    <FiKey className="w-4 h-4" /> Forgot Password
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  >
                    <FiLogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
            
            {/* User Details Card */}
            <div className="w-full mt-6 bg-white rounded-lg shadow-md p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span className="text-gray-600">{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Phone:</span>
                    <span className="text-gray-600">{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Address:</span>
                    <span className="text-gray-600">{user.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-2/3 p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Active Listings</h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <UserPropList setTotalListings={setTotalListings} />
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Total Listings" value={totalListings} color="blue" />
              <StatCard label="Pending Requests" value={user.pendingRequests || 0} color="yellow" />
              <StatCard label="Sold Properties" value={user.soldListings || 0} color="green" />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">My Bookings</h2>
            <div
              onClick={() => navigate("/book")}
              className="cursor-pointer bg-blue-100 hover:bg-blue-200 transition-all shadow-md p-6 rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Bookings</h3>
                <p className="text-sm text-gray-600">View and manage your bookings</p>
              </div>
              <div className="flex items-center gap-x-4">
                <span className="text-xl font-bold text-blue-600">{bookingCount}</span>
                <FiCalendar size={24} color="#2563eb" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title="Edit Profile" onClose={() => setShowEditModal(false)}>
          <div className="flex flex-col items-center mb-4">
            <img
              src={profilePicFile ? URL.createObjectURL(profilePicFile) : user.profilePic || "https://via.placeholder.com/150"}
              alt="Preview"
              className="w-24 h-24 rounded-full border-4 border-blue-300 object-cover shadow-md mb-3"
            />
            <label className="cursor-pointer text-sm text-blue-500 hover:underline">
              Change Picture
              <input type="file" accept="image/*" hidden onChange={(e) => setProfilePicFile(e.target.files[0])} />
            </label>
          </div>
          <input
            type="text"
            placeholder="Name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            className="input"
          />
          <div className="flex justify-between mt-4">
            <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleEditSave}>Save</button>
          </div>
        </Modal>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <Modal title="Forgot Password" onClose={() => setShowForgotModal(false)}>
          {!otpSent ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                className="input"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              <button className="btn-primary mt-4 w-full" onClick={handleSendOtp}>
                <FiMail /> Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="input"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter New Password"
                className="input mt-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button className="btn-primary mt-4 w-full" onClick={handleResetPassword}>
                <FiLock /> Update Password
              </button>
            </>
          )}
        </Modal>
      )}

  <TenantRequestsCards/>
    </div>
  );
};

// Reusable Modal Component
const Modal = ({ title, onClose, children }) => (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <button className="absolute top-3 right-3 text-gray-600 hover:text-red-500" onClick={onClose}>
        <FiX size={20} />
      </button>
      <h2 className="text-xl font-bold text-center mb-4">{title}</h2>
      {children}
    </div>
  </div>
);

// Reusable Stat Card
const StatCard = ({ label, value, color }) => (
  <div className={`bg-white shadow-md p-6 rounded-md text-center border-t-4 border-${color}-500`}>
    <h3 className={`text-2xl font-bold text-${color}-500`}>{value}</h3>
    <p className="text-gray-600">{label}</p>
  </div>
);

export default ProfilePage;
