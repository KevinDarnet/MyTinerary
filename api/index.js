const path = require("path");
// Ensure environment variables are loaded if present in local or root
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", "backend", ".env") });

const app = require("../backend/server");
const { connectToDatabase } = require("./lib/db");

// Export as Vercel Serverless Function handler
module.exports = async (req, res) => {
  // Ensure database connection is active before processing request
  await connectToDatabase();
  return app(req, res);
};
