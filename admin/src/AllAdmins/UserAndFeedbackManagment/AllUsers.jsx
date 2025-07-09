import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss"; // Optional: if you want to style SweetAlert2

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/user/all");
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑️ Delete user with SweetAlert2
  const deleteUser = async (id, name) => {
    const result = await Swal.fire({
      title: `Delete ${name}?`,
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4000/api/user/delete/${id}`);
        const updatedUsers = users.filter((user) => user._id !== id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);

        Swal.fire({
          title: "Deleted!",
          text: `"${name}" has been deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Delete Error:", err);
        Swal.fire("Error", "Something went wrong while deleting the user.", "error");
      }
    }
  };

  // 🔍 Search by name
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-4">
          All Registered Users
        </h1>

        {/* 🔍 Search and Count */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-gray-700 text-lg font-medium">
            Total Users:{" "}
            <span className="text-blue-700 font-bold">
              {filteredUsers.length}
            </span>
          </p>
        </div>

        {/* 🧍 User Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No users found.
            </p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-xl p-5 relative group transition-all"
              >
                <img
                  src={user.profilePic || "https://via.placeholder.com/150"}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-300 shadow"
                />
                <h2 className="text-xl font-semibold text-center mt-4 text-gray-800">
                  {user.name}
                </h2>
                <p className="text-center text-gray-500 mb-4">{user.email}</p>
                <button
                  onClick={() => deleteUser(user._id, user.name)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
                  title="Delete user"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
