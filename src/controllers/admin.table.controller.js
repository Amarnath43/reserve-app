const Table = require("../models/Table");

const createTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity } = req.body;

    if (!tableNumber || !capacity) {
      const err = new Error("tableNumber and capacity are required");
      err.statusCode = 400;
      throw err;
    }

    const existing = await Table.findOne({ tableNumber });
    if (existing) {
      const err = new Error("Table number already exists");
      err.statusCode = 409;
      throw err;
    }

    const table = await Table.create({
      tableNumber,
      capacity,
    });

    return res.status(201).json(table);
  } catch (err) {
    next(err);
  }
};

const getAllTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    return res.json(tables);
  } catch (err) {
    next(err);
  }
};


const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity } = req.body;

    const table = await Table.findById(id);
    if (!table) {
      const err = new Error("Table not found");
      err.statusCode = 404;
      throw err;
    }

    if (tableNumber !== undefined) {
      table.tableNumber = tableNumber;
    }

    if (capacity !== undefined) {
      table.capacity = capacity;
    }

    await table.save();
    return res.json(table);
  } catch (err) {
    next(err);
  }
};

const disableTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const table = await Table.findById(id);
    if (!table) {
      const err = new Error("Table not found");
      err.statusCode = 404;
      throw err;
    }

    table.isActive = isActive;
    await table.save();

    return res.json({ message: "Table disabled successfully" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createTable,
  getAllTables,
  updateTable,
  disableTable,
};