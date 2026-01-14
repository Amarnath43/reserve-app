const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const {
  createTable,
  getAllTables,
  updateTable,
  disableTable,
} = require("../controllers/admin.table.controller");

const router = express.Router();

router.post("/tables", authMiddleware, adminMiddleware, createTable);
router.get("/tables", authMiddleware, adminMiddleware, getAllTables);
router.patch("/tables/:id", authMiddleware, adminMiddleware, updateTable);
router.patch("/tables/:id/disable", authMiddleware, adminMiddleware, disableTable);

module.exports = router;
