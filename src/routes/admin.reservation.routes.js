const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const {
  getAllReservations,
  adminCancelReservation,
  adminCompleteReservation
} = require("../controllers/admin.reservation.controller");

const router = express.Router();

router.get(
  "/reservations",
  authMiddleware,
  adminMiddleware,
  getAllReservations
);

router.patch(
  "/reservations/:id/cancel",
  authMiddleware,
  adminMiddleware,
  adminCancelReservation
);

router.patch(
  "/reservations/:id/complete",
  authMiddleware,
  adminMiddleware,
  adminCompleteReservation
);


module.exports = router;
