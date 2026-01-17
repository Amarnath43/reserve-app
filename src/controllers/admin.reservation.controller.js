const Reservation = require("../models/Reservation");
const User = require("../models/User");
const Table = require("../models/Table");


const getAllReservations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search, date } = req.query;

    /* ---------------- 1. Build Filter for the Table ---------------- */
    const filter = {};
    if (status) filter.status = status;
    if (date) filter.date = date;

    if (search) {
      const orConditions = [];
      const users = await User.find({ email: { $regex: search, $options: "i" } }).select("_id");
      if (users.length) orConditions.push({ userId: { $in: users.map(u => u._id) } });

      if (!isNaN(search)) {
        const tables = await Table.find({ tableNumber: Number(search) }).select("_id");
        if (tables.length) orConditions.push({ tableId: { $in: tables.map(t => t._id) } });
      }

      if (!orConditions.length) {
        // Return empty table data but STILL include global stats below
        return res.json(await getResponseWithStats([], 0, page, limit));
      }
      filter.$or = orConditions;
    }

    /* ---------------- 2. Fetch Paginated Data & Global Stats ---------------- */
    const skip = (page - 1) * limit;

    const [reservations, total, totalAll, confirmedCount, cancelledCount, activeTablesCount] = await Promise.all([
      // Paginated table data
      Reservation.find(filter)
        .populate("userId", "name email")
        .populate("tableId", "tableNumber capacity")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      
      // Count for the current filters (for pagination)
      Reservation.countDocuments(filter),

      // GLOBAL STATS (No filter applied)
      Reservation.countDocuments({}), 
      Reservation.countDocuments({ status: "CONFIRMED" }),
      Reservation.countDocuments({ status: "CANCELLED" }),
      Table.countDocuments({ isActive: true })
    ]);

    return res.json({
      data: reservations,
      stats: {
        total: totalAll,
        confirmed: confirmedCount,
        cancelled: cancelledCount,
        activeTables: activeTablesCount
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total, // Total matching the filter
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
