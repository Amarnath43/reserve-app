const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        tableId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table",
            required: true,
        },

        date: {
            type: String, // YYYY-MM-DD
            required: true,
        },

        timeSlot: {
            type: String, // hh:mm AM/PM
            required: true,
        },

        guests: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
            default: "CONFIRMED",
        },

        specialRequest: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

reservationSchema.index(
  { tableId: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "CONFIRMED" },
  }
);


module.exports = mongoose.model("Reservation", reservationSchema);
