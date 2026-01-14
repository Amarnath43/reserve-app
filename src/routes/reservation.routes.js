const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const { createReservation, getMyReservations,cancelMyReservation } = require("../controllers/reservation.controller");

const router = express.Router();

router.post("/", authMiddleware, requireRole("USER"),createReservation);
router.get("/me", authMiddleware, getMyReservations);

router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelMyReservation
);

module.exports = router;
