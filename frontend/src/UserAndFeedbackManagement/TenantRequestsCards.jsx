import React, { useEffect, useState } from "react";

export default function TenantRequestsCards() {
  const [requests, setRequests] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch user's requests
  const fetchRequests = async () => {
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:4000/api/maintenance/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        setRequests([]);
        setError(data.error || "Failed to fetch requests.");
      }
    } catch (err) {
      setRequests([]);
      setError("Network error.");
    }
  };

  useEffect(() => {
    fetchRequests();
    window.addEventListener("refreshRequests", fetchRequests);
    return () => window.removeEventListener("refreshRequests", fetchRequests);
  }, []);

  // Open edit modal
  const openEdit = (req) => {
    setEditing(req._id);
    setForm({
      title: req.title,
      description: req.description,
      priority: req.priority,
      image: null,
    });
    setPreview(req.image?.url || null);
    setModalOpen(true);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit edit
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));
    try {
      const res = await fetch(`http://localhost:4000/api/maintenance/${editing}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setLoading(false);
      if (res.ok) {
        setEditing(null);
        setModalOpen(false);
        fetchRequests();
        alert("Request updated!");
      } else {
        const err = await res.json();
        setError(err.error || "Error updating request");
      }
    } catch {
      setLoading(false);
      setError("Network error.");
    }
  };
  

  // Delete request
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:4000/api/maintenance/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchRequests();
        alert("Deleted!");
      } else {
        const err = await res.json();
        setError(err.error || "Error deleting request");
      }
    } catch {
      setError("Network error.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-2">
      <h2 className="text-2xl font-bold text-black mb-6 text-center">My Maintenance Requests</h2>
      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
      <div className="grid gap-6 md:grid-cols-2">
        {(requests || []).map(req => (
          <div key={req._id} className="bg-white border border-black rounded-xl shadow-lg p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-black">{req.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold border ${req.priority === "high"
                  ? "bg-red-100 border-red-400 text-red-700"
                  : req.priority === "medium"
                  ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                  : "bg-green-100 border-green-400 text-green-700"
                  }`}>
                  {req.priority}
                </span>
              </div>
              <div className="text-gray-700 mb-2">{req.description}</div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="font-semibold">Status:</span>
                <span className="capitalize">{req.status}</span>
              </div>
              {req.image?.url && (
                <img src={req.image.url} alt="" className="w-full h-32 object-cover rounded mt-2 border" />
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => openEdit(req)}
                className="flex-1 bg-black text-white py-1 rounded hover:bg-gray-800 transition"
              >Update</button>
              <button
                onClick={() => handleDelete(req._id)}
                className="flex-1 bg-white text-black border border-black py-1 rounded hover:bg-gray-100 transition"
              >Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleEdit}
            className="bg-white border border-black p-6 rounded shadow w-full max-w-md space-y-4"
          >
            <h3 className="text-xl font-bold mb-2 text-black">Edit Request</h3>
            {error && <div className="mb-2 text-red-600">{error}</div>}
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Title"
              className="w-full border-b border-black bg-transparent p-2 focus:outline-none"
              minLength={3}
              maxLength={50}
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Description"
              className="w-full border-b border-black bg-transparent p-2 focus:outline-none"
              minLength={10}
              maxLength={500}
            />
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border-b border-black bg-transparent p-2 focus:outline-none"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <label className="block border-2 border-dashed border-black rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition">
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto h-32 object-contain rounded"
                />
              ) : (
                <span className="text-black">Click to upload an image (optional)</span>
              )}
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >{loading ? "Saving..." : "Save"}</button>
              <button
                type="button"
                onClick={() => { setEditing(null); setModalOpen(false); }}
                className="bg-gray-300 px-4 py-2 rounded"
              >Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
