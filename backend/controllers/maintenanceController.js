// src/controllers/maintenanceController.js
import Maintenance from "../models/Maintenance.js";
import { v2 as cloudinary } from "cloudinary";

// CREATE
export const createMaintenance = async (req, res) => {
  try {
    let imageData = {};
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageData = { public_id: result.public_id, url: result.secure_url };
    }
    const newRequest = await Maintenance.create({
      ...req.body,
      image: imageData,
      createdBy: req.userId,
    });
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ ALL
export const getAllMaintenance = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        error: "Authentication required" 
      });
    }

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    
    console.log("Fetching maintenance requests with filter:", filter);
    console.log("User ID:", req.userId);
    
    const requests = await Maintenance.find(filter)
      .populate("createdBy", "name email profilePic")
      .sort({ createdAt: -1 });

    console.log(`Found ${requests.length} maintenance requests`);

    if (!requests) {
      return res.status(404).json({ 
        success: false,
        error: "No maintenance requests found" 
      });
    }

    res.json(requests);
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch maintenance requests",
      details: error.message 
    });
  }
};

// READ ONE
export const getMaintenance = async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateMaintenance = async (req, res) => {
  try {
    let imageData = {};
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageData = { public_id: result.public_id, url: result.secure_url };
    }
    const updated = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...(req.file && { image: imageData }) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
export const deleteMaintenance = async (req, res) => {
  try {
    const deleted = await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTenantRequests = async (req, res) => {
    try {
      const requests = await Maintenance.find({ createdBy: req.userId }).sort({ createdAt: -1 });
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };