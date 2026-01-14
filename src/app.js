const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const reservationRoutes = require("./routes/reservation.routes");
const availabilityRoutes = require("./routes/availability.routes");
// const adminRoutes = require("./routes/admin.routes");

const errorHandler = require("./middlewares/error.middleware");

const app = express();

/* -------------------- Middlewares -------------------- */
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// /* -------------------- Routes -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/availability", availabilityRoutes);
// app.use("/api/admin", adminRoutes);

/* -------------------- Health Check -------------------- */
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* -------------------- Error Handler -------------------- */
app.use(errorHandler);

module.exports = app;
