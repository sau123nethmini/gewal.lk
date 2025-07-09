import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import RelatedProduct from '../components/RelatedProduct';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/properties/${productId}`);
        
        if (response.data && response.data.success && response.data.property) {
          const propertyData = response.data.property;
          
          // Validate required fields
          if (!propertyData.type || !propertyData.description || !propertyData.price || 
              !propertyData.location || !propertyData.contactNumber || !propertyData.email) {
            throw new Error('Required property data is missing');
          }

          // Ensure images array exists and has at least one image
          if (!propertyData.images || !Array.isArray(propertyData.images) || propertyData.images.length === 0) {
            propertyData.images = ['/path/to/default-image.jpg']; // Add a default image
          }

          setProperty(propertyData);
          setSelectedImage(propertyData.images[0]);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message || 'Failed to fetch property details');
        toast.error(err.message || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error || 'Property not found'}</h2>
        <button
          onClick={() => navigate('/properties')}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Property Container */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Images Section */}
        <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-1/2">
          {/* Thumbnails */}
          {property.images && property.images.length > 0 && (
            <div className="flex lg:flex-col gap-4 overflow-x-auto">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property view ${index + 1}`}
                  onClick={() => setSelectedImage(image)}
                  className={`w-48 h-16 object-cover border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
                    selectedImage === image ? 'border-blue-500' : 'border-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
          {/* Main Image */}
          <div className="flex-grow">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Property"
                className="w-full h-auto object-cover rounded-lg shadow-md border"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
        </div>

        {/* Property Info Section */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold">{property.type}</h1>
          <p className="text-xl font-bold text-gray-900">
            LKR {property.price.toLocaleString()}
          </p>
          <p className="text-gray-700 font-medium">{property.location}</p>
          <p className="text-gray-600 leading-relaxed">{property.description}</p>

          {/* Contact Information */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-600">Phone: {property.contactNumber}</p>
            <p className="text-gray-600">Email: {property.email}</p>
          </div>
        </div>
      </div>

      {/* Property Description */}
      <div className="mt-16">
        <div className="border px-6 py-6 text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Property Description</h4>
          <p className="mb-4">{property.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Property Type</h4>
              <p>{property.type}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Location</h4>
              <p>{property.location}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Price</h4>
              <p>LKR {property.price.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <p>{property.contactNumber}</p>
              <p>{property.email}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Related Products */}
      <RelatedProduct category={property.category} subCategory={property.subCategory} />
    </div>
  );
};

export default Product;
