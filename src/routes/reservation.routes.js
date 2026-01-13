const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { createReservation } = require("../controllers/reservation.controller");

const router = express.Router();

router.post("/", authMiddleware, createReservation);

module.exports = router;
