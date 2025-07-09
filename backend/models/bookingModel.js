import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  meetingType: String,
  date: String,
  timeSlot: String,
  price: Number,
  property: { type: mongoose.Schema.Types.ObjectId,ref: "Property"  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  zoomLink: String,
  zoomPassword: String
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
