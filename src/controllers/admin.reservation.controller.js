const Reservation = require("../models/Reservation");
const User = require("../models/User");
const Table = require("../models/Table");


const getAllReservations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      date,
    } = req.query;

    const filter = {};

    /* ---------------- Status filter ---------------- */
    if (status) {
      filter.status = status;
    }

    /* ---------------- Date filter ---------------- */
    if (date) {
      filter.date = date; // YYYY-MM-DD
    }

    /* ---------------- Search filter ---------------- */
    if (search) {
  const orConditions = [];

  // Search by user email
  const users = await User.find({
    email: { $regex: search, $options: "i" },
  }).select("_id");

  if (users.length) {
    orConditions.push({ userId: { $in: users.map(u => u._id) } });
  }

  // Search by table number
  if (!isNaN(search)) {
    const tables = await Table.find({
      tableNumber: Number(search),
    }).select("_id");

    if (tables.length) {
      orConditions.push({ tableId: { $in: tables.map(t => t._id) } });
    }
  }

  // 🔴 THIS IS THE FIX
  if (!orConditions.length) {
    return res.json({
      data: [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: 0,
        totalPages: 0,
      },
    });
  }

  filter.$or = orConditions;
}


    /* ---------------- Pagination ---------------- */
    const skip = (page - 1) * limit;

    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .populate("userId", "name email")
        .populate("tableId", "tableNumber capacity specialRequest")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Reservation.countDocuments(filter),
    ]);

    return res.json({
      data: reservations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};



const adminCancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      const err = new Error("Reservation not found");
      err.statusCode = 404;
      throw err;
    }

    if (reservation.status !== "CONFIRMED") {
      const err = new Error("Only confirmed reservations can be cancelled");
      err.statusCode = 400;
      throw err;
    }

    reservation.status = "CANCELLED";
    await reservation.save();

    return res.json({ message: "Reservation cancelled" });
  } catch (err) {
    next(err);
  }
};

const adminCompleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      const err = new Error("Reservation not found");
      err.statusCode = 404;
      throw err;
    }

    if (reservation.status !== "CONFIRMED") {
      const err = new Error("Only confirmed reservations can be completed");
      err.statusCode = 400;
      throw err;
    }

    reservation.status = "COMPLETED";
    await reservation.save();

    return res.json({ message: "Reservation completed" });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getAllReservations,
  adminCancelReservation,
  adminCompleteReservation
};  
