import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUpload, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { assets } from "../../../admin/src/assets/assets";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const AddProperty = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [email, setEmail] = useState("");
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState("");
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null); // property to be edited
  const { products, setProducts } = useContext(ShopContext);
  const [showContactHint, setShowContactHint] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const propertyTypes = [
    "Apartment",
    "House",
    "Villa",
    "Land",
    "Commercial",
    "Office",
    "Shop",
    "Warehouse"
  ];

  const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya"
  ];

  // Add predefined time slots
  const predefinedSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM"
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/properties/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setProperties(response.data.properties);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching properties.");
      }
    };
    fetchProperties();
  }, [token]);

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Property deleted successfully!");
      fetchProperties(); // Refresh the list of properties
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the property.");
    }
  };

  const handleSlotSelection = (slot) => {
    setSlots(prevSlots => 
      prevSlots.includes(slot)
        ? prevSlots.filter(s => s !== slot)
        : [...prevSlots, slot]
    );
  };

  const handleContactNumberChange = (e) => {
    const value = e.target.value;
    // Allow only digits and ensure it starts with 0
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly === "" || (digitsOnly.startsWith("0") && digitsOnly.length <= 10)) {
      setContactNumber(digitsOnly);
      if (digitsOnly.length === 10) {
        setContactNumberError("");
      } else {
        setContactNumberError("Contact number must be exactly 10 digits starting with 0");
      }
    } else {
      setContactNumberError("Contact number must start with 0 and contain only numbers");
    }
  };

  const handleAddSlot = () => {
    if (newSlot.trim() && !slots.includes(newSlot.trim())) {
      setSlots([...slots, newSlot.trim()]);
      setNewSlot("");
    }
  };

  const handleRemoveSlot = (slotToRemove) => {
    setSlots(slots.filter(slot => slot !== slotToRemove));
  };

  const onsubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    if (slots.length === 0) {
      toast.error("Please add at least one time slot");
      return;
    }

    // Validate contact number
    if (!contactNumber.startsWith("0") || contactNumber.length !== 10) {
      setContactNumberError("Contact number must be exactly 10 digits starting with 0");
      return;
    }

    // Validation Regex
    const onlyLetters = /^[A-Za-z\s]+$/;
    const alphanumeric = /^[A-Za-z0-9\s]+$/;
    const phoneNumber = /^[0-9]{9}$/; // Updated regex to check for 9 digits
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Frontend Validations
    if (!onlyLetters.test(type)) {
      toast.error("Property Type must contain only letters.");
      return;
    }

    if (!alphanumeric.test(description)) {
      toast.error("Description can only contain letters and numbers.");
      return;
    }

    if (Number(price) <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    


    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("contactNumber", "0" + contactNumber);
      formData.append("email", email);
      slots.forEach((slot, idx) => formData.append(`slots[${idx}]`, slot));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        `http://localhost:4000/api/properties/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Property added successfully!");

        // Update local state
        const fetchProperties = async () => {
          try {
            const response = await axios.get(
              "http://localhost:4000/api/properties/user",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.data.success) {
              setProperties(response.data.properties);
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            console.error(error);
            toast.error("An error occurred while fetching properties.");
          }
        };

        // Update global state in ShopContext
        const fetchAllProperties = async () => {
          try {
            const response = await axios.get("http://localhost:4000/api/properties");
            if (response.data.success) {
              setProducts(response.data.properties);
            }
          } catch (error) {
            console.error("Error fetching all properties:", error);
          }
        };

        await Promise.all([fetchProperties(), fetchAllProperties()]);

        // Reset form
        setType("");
        setDescription("");
        setPrice("");
        setLocation("");
        setContactNumber("");
        setEmail("");
        setSlots([]);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the property.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Add Property Form */}
          <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Add New Property
            </h2>

            <form onSubmit={onsubmitHandler} className="space-y-6">
              {/* Upload Images */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Property Images
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[setImage1, setImage2, setImage3, setImage4].map(
                    (setImage, index) => (
                      <label
                        key={index}
                        htmlFor={`image${index + 1}`}
                        className="group relative aspect-square cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-500 transition-all duration-200"
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          <FaUpload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2" />
                          <span className="text-xs text-gray-500 text-center">
                            Click to upload
                          </span>
                        </div>
                        {[image1, image2, image3, image4][index] && (
                          <img
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                            src={URL.createObjectURL(
                              [image1, image2, image3, image4][index]
                            )}
                            alt="Upload Preview"
                          />
                        )}
                        <input
                          type="file"
                          id={`image${index + 1}`}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            [setImage1, setImage2, setImage3, setImage4][index](
                              e.target.files[0]
                            )
                          }
                        />
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    required
                  >
                    <option value="">Select Property Type</option>
                    {propertyTypes.map((propertyType) => (
                      <option key={propertyType} value={propertyType}>
                        {propertyType}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (District)
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="0XXXXXXXXX"
                    className={`w-full px-4 py-2 border ${
                      contactNumberError ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                    value={contactNumber}
                    onChange={handleContactNumberChange}
                    onFocus={() => setShowContactHint(false)}
                    onBlur={() => setShowContactHint(contactNumber === '')}
                    maxLength={10}
                    required
                  />
                  {showContactHint && (
                    <p className="mt-1 text-xs text-gray-500">
                      Please enter a 10-digit phone number starting with 0 (e.g., 0XXXXXXXXX)
                    </p>
                  )}
                  {contactNumberError && (
                    <p className="text-red-500 text-xs mt-1">{contactNumberError}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter property description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email (e.g., example@domain.com)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    title="Please enter a valid email address (e.g., example@domain.com)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Please enter a valid email address (e.g., example@domain.com)
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {predefinedSlots.map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center p-2 border rounded cursor-pointer ${
                        slots.includes(slot)
                          ? "bg-blue-100 border-blue-500"
                          : "bg-white border-gray-300"
                      } hover:bg-gray-50`}
                    >
                      <input
                        type="checkbox"
                        checked={slots.includes(slot)}
                        onChange={() => handleSlotSelection(slot)}
                        className="mr-2"
                      />
                      <span className="text-sm">{slot}</span>
                    </label>
                  ))}
                </div>
                {slots.length === 0 && (
                  <p className="text-red-500 text-xs italic mt-1">
                    Please select at least one time slot
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-lg"
              >
                Add Property
              </button>
            </form>
          </div>

          {/* Property List */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              My Properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {properties.map((property, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-200"
                >
                  <div className="relative">
                    <img
                      src={property.images[0]}
                      alt="Property"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => setEditingProperty(property)}
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition"
                      >
                        <FaEdit className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(property._id)}
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition"
                      >
                        <FaTrash className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {property.type}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {property.description.slice(0, 50)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-blue-600 font-medium">
                        LKR {property.price.toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-sm">{property.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Property
                </h2>
                <button
                  onClick={() => setEditingProperty(null)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  // Validation Regex
                  const onlyLetters = /^[A-Za-z\s]+$/;
                  const alphanumeric = /^[A-Za-z0-9\s]+$/;
                  const phoneNumber = /^[0-9]{9}$/;
                  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                  // Frontend Validations
                  if (!phoneNumber.test(editingProperty.contactNumber)) {
                    toast.error("Please enter a valid 9-digit phone number.");
                    return;
                  }

                  if (!emailRegex.test(editingProperty.email)) {
                    toast.error("Please enter a valid email address.");
                    return;
                  }

                  const formData = new FormData();
                  formData.append("type", editingProperty.type);
                  formData.append("description", editingProperty.description);
                  formData.append("price", editingProperty.price);
                  formData.append("location", editingProperty.location);
                  formData.append("contactNumber", "0" + editingProperty.contactNumber);
                  formData.append("email", editingProperty.email);

                  if (editingProperty.image1) {
                    formData.append("image1", editingProperty.image1);
                  }

                  try {
                    const res = await axios.put(
                      `http://localhost:4000/api/properties/${editingProperty._id}`,
                      formData,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    if (res.data.success) {
                      toast.success("Property updated successfully!");
                      setEditingProperty(null);
                      const updatedList = await axios.get(
                        "http://localhost:4000/api/properties/user",
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      setProperties(updatedList.data.properties);
                    } else {
                      toast.error(res.data.message);
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error("Update failed.");
                  }
                }}
                className="space-y-6"
              >
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={editingProperty.type}
                    onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    required
                  >
                    <option value="">Select Property Type</option>
                    {propertyTypes.map((propertyType) => (
                      <option key={propertyType} value={propertyType}>
                        {propertyType}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={editingProperty.price}
                    onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value })}
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (District)
                  </label>
                  <select
                    value={editingProperty.location}
                    onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="XXXXXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={editingProperty.contactNumber}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '');
                      setEditingProperty({ ...editingProperty, contactNumber: digitsOnly.slice(0, 9) });
                    }}
                    pattern="[0-9]{9}"
                    title="Please enter a 9-digit phone number (excluding the leading 0)"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Please enter a 9-digit phone number (e.g., XXXXXXXXXX)
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter property description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-32"
                    value={editingProperty.description}
                    onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={editingProperty.email}
                    onChange={(e) => setEditingProperty({ ...editingProperty, email: e.target.value })}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                    {editingProperty.image1 ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(editingProperty.image1)}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setEditingProperty({ ...editingProperty, image1: null })}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setEditingProperty({ ...editingProperty, image1: e.target.files[0] })}
                          />
                        </label>
                        <p className="mt-2 text-xs text-gray-500">
                          JPEG, PNG or JPG format. Max size 5MB.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-lg"
                >
                  Update Property
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProperty;
