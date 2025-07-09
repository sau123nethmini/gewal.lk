import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";

export default function TenantMaintenanceForm() {
  const [form, setForm] = useState({
    property: "",
    unit: "",
    tenantName: "",
    title: "",
    description: "",
    priority: "medium",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Field-by-field validation
  const validate = () => {
    const newError = {};
    if (!form.property.trim()) newError.property = "Property is required.";
    if (!form.unit.trim()) newError.unit = "Unit is required.";
    if (!form.tenantName.trim()) newError.tenantName = "Your name is required.";
    if (!form.title.trim()) newError.title = "Title is required.";
    else if (form.title.length < 3) newError.title = "Title must be at least 3 characters.";
    if (!form.description.trim()) newError.description = "Description is required.";
    else if (form.description.length < 10) newError.description = "Description must be at least 10 characters.";
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError((prev) => ({ ...prev, [name]: undefined }));
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError({});
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:4000/api/maintenance", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setLoading(false);
      if (res.ok) {
        setSuccess(true);
        setForm({
          property: "",
          unit: "",
          tenantName: "",
          title: "",
          description: "",
          priority: "medium",
          image: null,
        });
        setPreview(null);
        setTimeout(() => {
          navigate("/my-requests");
        }, 2500);
      } else {
        const err = await res.json();
        setError({ form: err.error || "Error submitting request" });
      }
    } catch {
      setLoading(false);
      setError({ form: "Network error." });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white border border-black rounded-2xl px-10 py-8 shadow-lg space-y-6 mb-10"
    >
      <h2 className="text-2xl font-bold text-black mb-1 text-center tracking-tight">Submit Maintenance Request</h2>
      {error.form && <div className="mb-2 text-red-600 text-center">{error.form}</div>}
      {success && (
        <div className="mb-4 text-green-700 text-center bg-green-100 border border-green-400 rounded p-3 font-semibold flex flex-col items-center">
          <span className="text-3xl mb-2">✅</span>
          Ticket submitted successfully!<br />
          Waiting for admin to approve the request...
        </div>
      )}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <input
            name="property"
            value={form.property}
            onChange={handleChange}
            required
            placeholder="Property"
            className={`w-full border-b border-black bg-transparent p-3 focus:outline-none text-base ${error.property ? "border-red-500" : ""}`}
          />
          {error.property && <div className="text-xs text-red-600 mt-1">{error.property}</div>}
        </div>
        <div>
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            required
            placeholder="Unit"
            className={`w-full border-b border-black bg-transparent p-3 focus:outline-none text-base ${error.unit ? "border-red-500" : ""}`}
          />
          {error.unit && <div className="text-xs text-red-600 mt-1">{error.unit}</div>}
        </div>
      </div>
      <div>
        <input
          name="tenantName"
          value={form.tenantName}
          onChange={handleChange}
          required
          placeholder="Your Name"
          className={`w-full border-b border-black bg-transparent p-3 focus:outline-none text-base ${error.tenantName ? "border-red-500" : ""}`}
        />
        {error.tenantName && <div className="text-xs text-red-600 mt-1">{error.tenantName}</div>}
      </div>
      <div>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Title"
          minLength={3}
          maxLength={50}
          className={`w-full border-b border-black bg-transparent p-3 focus:outline-none text-base ${error.title ? "border-red-500" : ""}`}
        />
        {error.title && <div className="text-xs text-red-600 mt-1">{error.title}</div>}
      </div>
      <div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="Description"
          minLength={10}
          maxLength={500}
          className={`w-full border-b border-black bg-transparent p-3 focus:outline-none text-base ${error.description ? "border-red-500" : ""}`}
          rows={3}
        />
        {error.description && <div className="text-xs text-red-600 mt-1">{error.description}</div>}
      </div>
      <div className="flex gap-4 justify-center">
        {["low", "medium", "high"].map((p) => (
          <label key={p} className="flex items-center gap-1 text-sm cursor-pointer">
            <input
              type="radio"
              name="priority"
              value={p}
              checked={form.priority === p}
              onChange={handleChange}
              className="accent-black"
            />
            <span className="text-black capitalize">{p}</span>
          </label>
        ))}
      </div>
      <label className="block border-2 border-dashed border-black rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100 transition relative">
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center">
          <FiPlusCircle className="mx-auto text-3xl text-black mb-1" />
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-24 object-contain rounded shadow mt-2"
            />
          ) : (
            <span className="text-black text-sm">Click to upload an image (optional)</span>
          )}
        </div>
      </label>
      <button
        type="submit"
        disabled={loading || success}
        className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition text-base font-semibold"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
