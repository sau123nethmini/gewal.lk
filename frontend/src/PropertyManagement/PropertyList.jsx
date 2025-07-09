import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/properties");
        setProperties(response.data.properties);
        setFilteredProperties(response.data.properties);
      } catch (error) {
        console.error("Error fetching properties", error);
        toast.error("Error fetching properties");
      }
    };

    fetchAllProperties();
  }, []);

  // Function to open Google Maps with the given location
  const openGoogleMaps = (location) => {
    const formattedLocation = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${formattedLocation}`, "_blank");
  };

  // Function to handle search by location
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = properties.filter(property =>
      property.location.toLowerCase().includes(query)
    );

    setFilteredProperties(filtered);
  };

  // Function to handle filtering by property type
  const handleFilterByType = (event) => {
    const type = event.target.value;
    setSelectedType(type);

    if (type === "") {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(property => property.type === type);
      setFilteredProperties(filtered);
    }
  };

  // Function to handle sorting by price
  const handleSortByPrice = (event) => {
    const order = event.target.value;
    setSortOrder(order);

    let sortedProperties = [...filteredProperties];
    if (order === "low-to-high") {
      sortedProperties.sort((a, b) => a.price - b.price);
    } else if (order === "high-to-low") {
      sortedProperties.sort((a, b) => b.price - a.price);
    }

    setFilteredProperties(sortedProperties);
  };

  // Function to handle property card click
  const handlePropertyClick = (propertyId) => {
    navigate(`/product/${propertyId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        All Available Properties
      </h2>

      {/* Search and Filter Options */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by location..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <select
          value={selectedType}
          onChange={handleFilterByType}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        >
          <option value="">Filter by Property Type</option>
          {[...new Set(properties.map(p => p.type))].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={handleSortByPrice}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        >
          <option value="">Sort by Price</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>
      </div>

      {/* Property Listings */}
      {filteredProperties.length === 0 ? (
        <p className="text-center text-gray-600">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-100">
          {filteredProperties.map((property) => (
            <div
              key={property._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handlePropertyClick(property._id)}
            >
              <img
                src={property.images[0]}
                alt="Property"
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800">{property.type}</h3>
                <p className="text-gray-600 mt-2">{property.description}</p>
                <p className="text-gray-700 mt-2 font-medium">{property.location}</p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  LKR {property.price.toLocaleString()}
                </p>

                {/* Buttons: Book Appointment, View Location & Finance Assistance */}
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${property._id}`);
                    }}
                    className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition duration-300"
                  >
                    Book Appointment
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openGoogleMaps(property.location);
                      }}
                      className="w-1/2 bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                    >
                      View Location
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/finance/${property._id}`);
                      }}
                      className="w-1/2 bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition duration-300"
                    >
                      Finance Assistance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
