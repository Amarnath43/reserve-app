const Table = require("../models/Table");
const Reservation = require("../models/Reservation");

const CAPACITY_TOLERANCE = 1;

const getAvailability = async (req, res, next) => {
  try {
    const { date, timeSlot, guests } = req.body;

    if (!date || !timeSlot || !guests) {
      const err = new Error("date, timeSlot and guests are required");
      err.statusCode = 400;
      throw err;
    }

    // 1. Find active tables within capacity tolerance
    const eligibleTables = await Table.find({
      isActive: true,
      capacity: {
        $gte: guests,
        $lte: guests + CAPACITY_TOLERANCE,
      },
    }).lean();

    if (!eligibleTables.length) {
      return res.json([]);
    }

    // 2. Find CONFIRMED reservations for same date & slot
    const bookedReservations = await Reservation.find({
      date,
      timeSlot,
      status: "CONFIRMED",
      tableId: { $in: eligibleTables.map(t => t._id) },
    }).select("tableId");

    const bookedTableIds = new Set(
      bookedReservations.map(r => r.tableId.toString())
    );

    // 3. Exclude booked tables
    const availableTables = eligibleTables.filter(
      table => !bookedTableIds.has(table._id.toString())
    );

    return res.json(availableTables);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAvailability };
