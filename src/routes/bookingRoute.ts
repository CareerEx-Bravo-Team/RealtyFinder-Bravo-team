import express from "express";
import { createBooking, updateBooking } from "../controllers/bookingController";

const router = express.Router();

router.post("/create-booking", createBooking);
router.patch("/update-booking/:id", updateBooking);

export default router;
