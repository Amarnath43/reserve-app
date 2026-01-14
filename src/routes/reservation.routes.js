const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { createReservation, getMyReservations,cancelMyReservation } = require("../controllers/reservation.controller");

const router = express.Router();

router.post("/", authMiddleware, createReservation);
router.post("/my", authMiddleware, getMyReservations);

router.patch(
  "/reservations/:id/cancel",
  authMiddleware,
  cancelMyReservation
);

module.exports = router;
