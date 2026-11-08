const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", "..", ".env"),
});
require("dotenv").config({
  path: path.join(__dirname, "..", "..", "backend", ".env"),
});
const { connectDatabase, getDatabaseStatus } = require("../../backend/config/database");
const mongoose = require("mongoose");

async function connectToDatabase() {
  const status = await connectDatabase();
  return status;
}

module.exports = {
  connectToDatabase,
  getDatabaseConnectionStatus: getDatabaseStatus,
  mongoose,
};
