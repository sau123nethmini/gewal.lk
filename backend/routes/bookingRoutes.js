import express from "express";
import { createBooking, getUserBookings, updateBooking,deleteBooking,getAllBookings,adminDeleteBooking, getBookingCount } from "../controllers/bookingController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/", authUser, createBooking);
router.get("/", authUser, getUserBookings);
router.put("/:id", authUser, updateBooking);
router.delete("/:id", authUser, deleteBooking);
router.get("/all",  getAllBookings);
router.delete("/admin/:id", adminDeleteBooking);
router.get("/count", authUser, getBookingCount);




export default router;
