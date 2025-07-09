// src/models/Maintenance.js
import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    property: { type: String, required: true },
    unit: { type: String, required: true },
    tenantName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    image: { public_id: String, url: String },
    assignedTo: { type: String },
    dueDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("Maintenance", maintenanceSchema);
