import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet styles!
import L from 'leaflet';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedProperty from '../comonents/RelatedProperty';

// Dummy images for property gallery
const dummyImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80"
];

// Fix default marker icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="bg-white rounded-xl shadow-xl p-8 min-w-[320px] max-w-[90vw]">
      {children}
      <button
        className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-full transition-all"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-8 right-8 z-50 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg animate-fadeIn">
    {message}
    <button className="ml-5 text-white font-bold" onClick={onClose}>×</button>
  </div>
);

const Appointment = () => {
  const { propId } = useParams();
  const { properties, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [propInfo, setPropInfo] = useState(null);
  const [propSlots, setPropSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(''); // For gallery

  const fetchPropInfo = () => {
    const propInfo = properties.find(prop => prop._id === propId);
    setPropInfo(propInfo);
    setMainImg(propInfo?.image || '');
    setLoading(false);
  };

  const getAvailableSlots = () => {
    setPropSlots([]);
    let today = new Date();
    let updatedSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(19, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 8 ? currentDate.getHours() + 1 : 8);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(8);
        currentDate.setMinutes(30);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 60);
      }

      updatedSlots.push(timeSlots);
    }
    setPropSlots(updatedSlots);
  };

  useEffect(() => {
    setLoading(true);
    fetchPropInfo();
    // eslint-disable-next-line
  }, [properties, propId]);

  useEffect(() => {
    if (propInfo) {
      getAvailableSlots();
    }
    // eslint-disable-next-line
  }, [propInfo]);

  // Clear slot time when changing the day
  useEffect(() => {
    setSlotTime('');
  }, [slotIndex]);

  if (loading || !propInfo) {
    return (
      <div className="animate-pulse space-y-6 p-10">
        <div className="w-full max-w-[370px] h-60 bg-gray-200 rounded-3xl mb-4" />
        <div className="h-8 w-1/2 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
    );
  }

  const handleBook = () => {
    if (!slotTime) {
      setToast("Please select a time slot.");
      return;
    }
    setShowConfirm(true);
  };
  const confirmBooking = () => {
    setShowConfirm(false);
    setToast("Appointment booked successfully!");
  };

  // Combine the main image with dummy images, remove duplicates
  const galleryImages = [
    propInfo.image,
    ...dummyImages.filter(img => img !== propInfo.image)
  ];

  // Property latitude and longitude (dummy fallback if not present)
  const latitude = propInfo.location?.lat || 6.9271;
  const longitude = propInfo.location?.lng || 79.8612;

  return (
    <div>
      {/* Property Details */}
      <div className="flex flex-col md:flex-row gap-10 mt-14 md:items-start">
        {/* Property Images Gallery */}
        <div className="w-full md:w-[370px] flex-shrink-0">
          <div className="relative">
            <img
              className="bg-gradient-to-br from-indigo-200 via-purple-100 to-white w-full rounded-3xl shadow-2xl object-cover aspect-[4/3] border border-indigo-100"
              src={mainImg}
              alt={propInfo.name || 'Property'}
            />
            {/* More Images Thumbnails */}
            <div className="flex gap-3 mt-4 justify-center">
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Property view ${idx + 1}`}
                  onClick={() => setMainImg(img)}
                  className={`w-16 h-16 object-cover rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${mainImg === img ? 'border-purple-500 scale-105 shadow-lg' : 'border-gray-200 hover:border-purple-300'}`}
                  style={{ background: "rgba(230,230,250,0.2)" }}
                />
              ))}
            </div>
          </div>
          {/* Map Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Property Location</h2>
            <div className="rounded-2xl overflow-hidden border border-indigo-100 shadow-lg">
              <MapContainer
                center={[latitude, longitude]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "330px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                  <Popup>
                    {propInfo.name}<br />{propInfo.location.line1}, {propInfo.location.line2}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Property Info Section */}
        <div className="flex-1 border border-gray-100 rounded-3xl p-8 bg-white/90 md:-mt-8 shadow-2xl relative">
          {/* Property Name */}
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-purple-700">{propInfo.name}</h2>
            <img className="w-8 h-8" src={assets.verify} alt='Verified' />
          </div>
          {/* Property Type and Since */}
          <div className="flex flex-wrap items-center gap-3 text-base mt-3 text-gray-700">
            <span className="font-medium px-3 py-1 bg-purple-50 rounded-full shadow-sm border border-purple-100">{propInfo.type}</span>
            <span className="py-1 px-4 border border-gray-200 text-sm rounded-full bg-gray-50">Since - {propInfo.since}</span>
          </div>
          {/* Price */}
          <div className="mt-7 flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900">Price:</span>
            <span className="text-2xl font-bold text-purple-600 tracking-wide">{currencySymbol} {propInfo.price}</span>
          </div>
          <div className="my-6 border-t border-dashed border-gray-200"></div>
          {/* Description */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold text-gray-900">Description</span>
              <span className="inline-block w-1 h-1 rounded-full bg-purple-300"></span>
            </div>
            <p className="text-base text-gray-600 leading-relaxed">{propInfo.description}</p>
          </div>
          {/* Location */}
          <div className="mb-5">
            <p className="text-lg font-semibold text-gray-900 mb-1">Location</p>
            <p className="text-base text-gray-500">{propInfo.location.line1}, {propInfo.location.line2}</p>
          </div>
          {/* Features */}
          <div>
            <p className="text-lg font-semibold text-gray-900 mb-1">Features</p>
            <ul className="flex flex-wrap gap-2 mt-2">
              {propInfo.features.map((feature, index) => (
                <li key={index} className="px-4 py-1 bg-purple-100 rounded-full text-sm text-purple-700 border border-purple-200 shadow-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="flex flex-col items-center justify-center mt-12 font-medium text-gray-700">
        <p className="text-2xl mb-3 font-semibold tracking-tight">Booking Slots</p>
        <div className="flex gap-5 items-center w-full overflow-x-auto mt-3 pb-2 scrollbar-thin scrollbar-thumb-purple-200">
          {propSlots.length > 0 ? (
            propSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                className={`flex flex-col items-center justify-center py-6 px-5 min-w-[5.2rem] rounded-2xl cursor-pointer transition-all duration-200 border-2 font-semibold tracking-wide shadow-sm
                  ${slotIndex === index
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-purple-500 shadow-lg scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-purple-50 hover:border-purple-300'
                  }`}
                key={index}
                tabIndex={0}
                role="button"
                aria-label={`Select ${item[0] && daysOfWeek[item[0].datetime.getDay()]} ${item[0] && item[0].datetime.getDate()}`}
              >
                <span className="text-sm uppercase tracking-wider">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</span>
                <span className="text-2xl font-bold">{item[0] && item[0].datetime.getDate()}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm py-6">No slots available</div>
          )}
        </div>
      </div>

      {/* Time Slots */}
      {propSlots.length > 0 && (
        <div className="flex items-center gap-4 w-full overflow-x-auto mt-6 justify-center pb-2 scrollbar-thin scrollbar-thumb-purple-200">
          {propSlots[slotIndex].map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSlotTime(item.time)}
              className={`text-base font-semibold flex-shrink-0 px-7 py-2.5 rounded-full transition-all duration-150 shadow
                ${item.time === slotTime
                  ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg scale-105"
                  : "text-gray-600 border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-400"
                }`}
              aria-pressed={item.time === slotTime}
            >
              {item.time}
            </button>
          ))}
        </div>
      )}

      {/* Book Button */}
      <button
        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-lg font-bold px-16 py-4 rounded-full my-10 shadow-lg transition-all duration-200 block mx-auto tracking-wide"
        onClick={handleBook}
      >
        Book an Appointment
      </button>

      {/* Booking Confirmation Modal */}
      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)}>
          <h3 className="text-xl font-bold mb-2">Confirm Your Appointment</h3>
          <div className="text-gray-700 mb-4">
            <div><b>Property:</b> {propInfo.name}</div>
            <div>
              <b>Date:</b> {propSlots[slotIndex][0] ? daysOfWeek[propSlots[slotIndex][0].datetime.getDay()] : ''} {propSlots[slotIndex][0] ? propSlots[slotIndex][0].datetime.getDate() : ''}
            </div>
            <div><b>Time:</b> {slotTime}</div>
          </div>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-full transition-all mr-4"
            onClick={confirmBooking}
          >
            Confirm
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-2 rounded-full transition-all"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </button>
        </Modal>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}

      {/* Listing Related Properties */}
      <RelatedProperty propId={propId} type={propInfo?.type} />
    </div>
  );
};

export default Appointment;