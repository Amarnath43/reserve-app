const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

const createReservation = async (req, res, next) => {
  try {
    const { tableId, date, timeSlot, guests, specialRequest } = req.body;

    if (!tableId || !date || !timeSlot || !guests) {
      const err = new Error("tableId, date, timeSlot and guests are required");
      err.statusCode = 400;
      throw err;
    }

    // 1. Validate table
    const table = await Table.findById(tableId);

    if (!table || !table.isActive) {
      const err = new Error("Invalid or inactive table");
      err.statusCode = 400;
      throw err;
    }

    // Optional safety check (availability is advisory)
    if (table.capacity < guests || table.capacity > guests + 1) {
      const err = new Error("Selected table does not match guest count");
      err.statusCode = 400;
      throw err;
    }

    // 2. Create reservation
    const reservation = await Reservation.create({
      userId: req.user.id,
      tableId,
      date,
      timeSlot,
      guests,
      specialRequest,
    });

    return res.status(201).json(reservation);
  } catch (err) {
    // 3. Handle double booking (DB-level protection)
    if (err.code === 11000) {
      err.message = "This slot has already been booked";
      err.statusCode = 409;
    }

    next(err);
  }
};

module.exports = { createReservation };
