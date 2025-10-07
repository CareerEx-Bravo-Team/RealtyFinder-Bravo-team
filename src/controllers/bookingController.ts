import { Request, Response } from "express";
import Booking from "../models/booking";

// POST /api/bookings → request visit
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { propertyId, userId, ownerId, date } = req.body;

    const newBooking = new Booking({ propertyId, userId, ownerId, date });
    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

// PATCH /api/bookings/:id → accept/reject
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "accepted" or "rejected"

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating booking", error: error.message });
  }
};
