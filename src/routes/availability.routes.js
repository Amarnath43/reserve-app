const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { getAvailability } = require("../controllers/availability.controller");

const router = express.Router();

router.post("/", authMiddleware, getAvailability);

module.exports = router;
