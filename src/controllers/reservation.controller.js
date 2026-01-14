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

const getMyReservations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      pastPage = 1,
      pastLimit = 5,
    } = req.query;

    const page = Number(pastPage);
    const limit = Number(pastLimit);

    // 1️⃣ Upcoming reservations (NO pagination)
    const upcoming = await Reservation.find({
      userId,
      status: "CONFIRMED",
    })
      .populate("tableId", "tableNumber capacity")
      .sort({ date: 1, timeSlot: 1 });

    // 2️⃣ Past reservations (WITH pagination)
    const pastFilter = {
      userId,
      status: { $in: ["CANCELLED", "COMPLETED"] },
    };

    const totalPast = await Reservation.countDocuments(pastFilter);

    const past = await Reservation.find(pastFilter)
      .populate("tableId", "tableNumber capacity")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      upcoming,
      past: {
        data: past,
        pagination: {
          page,
          limit,
          total: totalPast,
          totalPages: Math.ceil(totalPast / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};


const cancelMyReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1️⃣ Find reservation belonging to logged-in user
    const reservation = await Reservation.findOne({
      _id: id,
      userId,
    });

    if (!reservation) {
      const err = new Error("Reservation not found");
      err.statusCode = 404;
      throw err;
    }

    // 2️⃣ Only CONFIRMED reservations can be cancelled
    if (reservation.status !== "CONFIRMED") {
      const err = new Error(
        "Only confirmed reservations can be cancelled"
      );
      err.statusCode = 400;
      throw err;
    }

    // 3️⃣ Cancel reservation
    reservation.status = "CANCELLED";
    await reservation.save();

    return res.json({
      message: "Reservation cancelled successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createReservation, getMyReservations, cancelMyReservation };