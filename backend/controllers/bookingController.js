import Booking from "../models/bookingModel.js";
import nodemailer from "nodemailer";

// Configure your mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // Your Gmail
    pass: process.env.EMAIL_PASS       // Your App Password (not your Gmail password)
  },
});

// Generate a random zoom link
const generateZoomLink = () => {
  const meetingId = Math.random().toString(36).substring(2, 15);
  const password = Math.random().toString(36).substring(2, 8);
  return {
    link: `https://zoom.us/j/${meetingId}`,
    password: password
  };
};

export const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      meetingType,
      date,
      timeSlot,
      price,
      property,
      userId,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request body" });
    }

    // Generate zoom link if it's a virtual meeting
    let zoomDetails = null;
    if (meetingType === "virtual") {
      zoomDetails = generateZoomLink();
    }

    const booking = await Booking.create({
      name,
      email,
      contact,
      meetingType,
      date,
      timeSlot,
      price,
      property,
      user: userId,
      zoomLink: zoomDetails?.link || null,
      zoomPassword: zoomDetails?.password || null
    });

    // Send email notification to user
    const mailOptions = {
      from: `"GEWAL Real Estate" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Booking Confirmation - GEWAL Real Estate",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; text-align: center;">Booking Confirmed!</h2>
            <p style="font-size: 16px; color: #444; text-align: center;">Hi ${name}, your property viewing appointment has been successfully booked.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Booking Details:</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 10px; color: #334155;">
                  <strong>Meeting Type:</strong> ${meetingType === 'virtual' ? 'Virtual Meeting' : 'Physical Meeting'}
                </li>
                <li style="margin-bottom: 10px; color: #334155;">
                  <strong>Date:</strong> ${new Date(date).toDateString()}
                </li>
                <li style="margin-bottom: 10px; color: #334155;">
                  <strong>Time Slot:</strong> ${timeSlot}
                </li>
                <li style="margin-bottom: 10px; color: #334155;">
                  <strong>Price:</strong> $${price}
                </li>
                ${meetingType === "virtual" ? `
                  <li style="margin-bottom: 10px; color: #334155;">
                    <strong>Zoom Link:</strong> <a href="${zoomDetails.link}" style="color: #2563eb; text-decoration: none;">${zoomDetails.link}</a>
                  </li>
                  <li style="margin-bottom: 10px; color: #334155;">
                    <strong>Zoom Password:</strong> ${zoomDetails.password}
                  </li>
                ` : ''}
              </ul>
            </div>

            ${meetingType === "virtual" ? `
              <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #0369a1; margin: 0;">
                  <strong>Important:</strong> Please save this email as it contains your Zoom meeting details.
                </p>
              </div>
            ` : ''}

            <p style="font-size: 15px; color: #666; text-align: center;">
              Thank you for choosing GEWAL Real Estate. We look forward to assisting you with your property needs!
            </p>
            
            <p style="text-align: center; margin-top: 30px; color: #64748b;">
              Warm regards,<br>
              <strong>Team GEWAL Real Estate</strong>
            </p>
          </div>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email Error:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({ 
      success: true,
      booking,
      zoomDetails: meetingType === "virtual" ? zoomDetails : null
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error creating booking", 
      error: error.message || error 
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from auth middleware

    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate('property', 'type location price images')
      .populate('user', 'name email profilePic')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching bookings", 
      error: error.message || error 
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ booking });
  } catch (error) {
    console.error("Update Booking Error:", error);
    res.status(500).json({ message: "Error updating booking", error: error.message || error });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    res.status(500).json({ message: "Error deleting booking", error: error.message || error });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { date } = req.query;

    let query = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      query.date = { $gte: start, $lt: end };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email profilePic')
      .populate('property', 'type location price images')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message || error,
    });
  }
};

export const adminDeleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
};

export const getBookingCount = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from auth middleware

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User ID not found" 
      });
    }

    const count = await Booking.countDocuments({ user: userId });
    res.json({ 
      success: true, 
      count 
    });
  } catch (error) {
    console.error("Error getting booking count:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error getting booking count", 
      error: error.message || error 
    });
  }
};
