import Ticket from "../models/ticketModel.js";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";
import path from "path";

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// CREATE a new ticket
export const createTicket = async (req, res) => {
  try {
    const { productCategory, product, subject, inquiry } = req.body;
    const userId = req.userId; // set by authUser middleware

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "tickets",
      });
      imageUrl = uploadResult.secure_url;
    }

    const ticket = new Ticket({
      userId,
      productCategory,
      product,
      subject,
      inquiry,
      image: imageUrl,
      replies: [],
    });

    await ticket.save();
    res.status(201).json({ success: true, message: "Ticket Raised Successfully", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all tickets (admin)
export const getAllTickets = async (req, res) => {
  try {
    // Populate name, email, and profilePic from userId
    const tickets = await Ticket.find().populate("userId", "name email profilePic");
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET tickets for a specific user
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.userId;
    const tickets = await Ticket.find({ userId });
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN REPLY to a ticket, send email to user with logo
export const replyTicket = async (req, res) => {
  try {
    const { ticketId, reply } = req.body;
    const ticket = await Ticket.findById(ticketId).populate("userId", "name email");
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket Not Found" });

    ticket.replies.push({ message: reply });
    await ticket.save();

    // Email notification to user
    const userEmail = ticket.userId.email;
    const userName = ticket.userId.name;
    const subject = ticket.subject;
    const inquiry = ticket.inquiry;

    // Path to your logo (adjust as needed)
    const logoPath = path.resolve("assets/gewal.png");

    // Compose HTML email
    const htmlMsg = `
      <div style="font-family: Arial, sans-serif; padding: 24px; background: #f8fafc;">
        <div style="text-align:center;">
          <img src="cid:gewalLogo" alt="GEWAL Logo" style="height:60px;margin-bottom:16px;" />
        </div>
        <h2 style="color:#4f46e5;">Your Maintenance Ticket Has Been Resolved!</h2>
        <p>Dear <b>${userName}</b>,</p>
        <p>Your ticket regarding <b>${subject}</b> has been resolved by our support team.</p>
        <div style="background:#f1f5f9;padding:16px;border-radius:8px;margin:16px 0;">
          <b>Your Inquiry:</b><br/>
          <span>${inquiry}</span>
        </div>
        <div style="background:#e0f2fe;padding:16px;border-radius:8px;margin:16px 0;">
          <b>Admin Reply:</b><br/>
          <span>${reply}</span>
        </div>
        <p>Thank you for using GEWAL Real Estate Management. If you have further issues, please contact us again.</p>
        <div style="margin-top:32px;color:#888;font-size:12px;">&copy; ${new Date().getFullYear()} GEWAL Real Estate Management</div>
      </div>
    `;

    await transporter.sendMail({
      from: `"GEWAL Real Estate" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your Ticket Has Been Resolved - GEWAL Real Estate",
      html: htmlMsg,
      attachments: [
        {
          filename: "gewal.png",
          path: logoPath,
          cid: "gewalLogo", // same as in the HTML img src
        },
      ],
    });

    res.status(200).json({ success: true, message: "Reply Sent and Email Notified", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a ticket
export const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket Not Found" });

    res.status(200).json({ success: true, message: "Ticket Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE ticket (only inquiry, subject, product, productCategory) with 24-hour restriction
export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { inquiry, subject, product, productCategory } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket Not Found" });

    // Restrict edits if last edit was within 24 hours
    const lastEditTime = new Date(ticket.updatedAt);
    const now = new Date();
    const diffHours = (now - lastEditTime) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return res.status(400).json({ success: false, message: "You can only edit a ticket once every 24 hours." });
    }

    if (inquiry) ticket.inquiry = inquiry;
    if (subject) ticket.subject = subject;
    if (product) ticket.product = product;
    if (productCategory) ticket.productCategory = productCategory;
    ticket.updatedAt = now;
    await ticket.save();

    res.status(200).json({ success: true, message: "Ticket Updated Successfully", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
