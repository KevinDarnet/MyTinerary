require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const { connectDatabase } = require("../config/database");
const Ciudades = require("../models/ciudades");
const Itinerarios = require("../models/itineraries");
const Activities = require("../models/activities");
const User = require("../models/usersModel");

async function main() {
  const status = await connectDatabase();
  console.log("Connection Status:", JSON.stringify(status, null, 2));

  if (status.mode !== "mongodb-atlas") {
    console.error("Failed to connect to MongoDB Atlas:", status.reason);
    process.exit(1);
  }

  const cities = await Ciudades.find();
  const itineraries = await Itinerarios.find()
    .populate("activities")
    .populate("comments.userID", "fullName name picture photo email");
  const activities = await Activities.find();
  const users = await User.find({}, { password: 0, uniqueString: 0 });

  console.log("Verified Atlas Collections:");
  console.log(`- ciudades: ${cities.length} documents (first: ${cities[0]?.city})`);
  console.log(
    `- itinerarios: ${itineraries.length} documents (first: ${itineraries[0]?.name}, comments: ${itineraries[0]?.comments?.length})`
  );
  console.log(`- activities: ${activities.length} documents`);
  console.log(
    `- users: ${users.length} documents (${users.map((u) => u.email).join(", ")})`
  );

  // Verify /api/allcities controller response directly from MongoDB Atlas
  const datosController = require("../controllers/ciudadesControllers");
  await new Promise((resolve) => {
    datosController.consultarCiudades(
      {},
      {
        json: (payload) => {
          console.log(
            `[API /api/allcities] HTTP 200 -> returned ${
              payload?.response?.ciudades?.length || 0
            } cities from MongoDB Atlas`
          );
          resolve();
        },
      }
    );
  });

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
