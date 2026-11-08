const mongoose = require("mongoose");
const Ciudades = require("../models/ciudades");
const Itinerarios = require("../models/itineraries");
const Activities = require("../models/activities");
const User = require("../models/usersModel");
const {
  SEED_CITIES,
  SEED_ITINERARIES,
  SEED_ACTIVITIES,
  activateLocalFallback,
  loadStore,
} = require("./localStore");

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let dbStatus = {
  connected: false,
  mode: "initializing",
  uri: null,
  details: null,
};

async function seedMongoIfNeeded() {
  try {
    const localData = loadStore();

    let cityCount = await Ciudades.countDocuments();
    if (cityCount === 0) {
      await Ciudades.insertMany(SEED_CITIES);
      cityCount = SEED_CITIES.length;
      console.log(
        `[Database] Seeded ${SEED_CITIES.length} cities into MongoDB Atlas.`
      );
    }

    let actCount = await Activities.countDocuments();
    if (actCount === 0) {
      await Activities.insertMany(SEED_ACTIVITIES);
      actCount = SEED_ACTIVITIES.length;
      console.log(
        `[Database] Seeded ${SEED_ACTIVITIES.length} activities into MongoDB Atlas.`
      );
    }

    let userCount = await User.countDocuments();
    if (
      userCount === 0 &&
      Array.isArray(localData.users) &&
      localData.users.length > 0
    ) {
      const sanitizedUsers = localData.users.map((u) => {
        const rawPic = (u.photo || u.picture || "").trim();
        const isImg =
          /^https?:\/\/|^data:image\//i.test(rawPic) &&
          !/youtube\.com\/channel\//i.test(rawPic);
        return {
          ...u,
          picture: isImg ? rawPic : "",
          photo: isImg ? rawPic : "",
        };
      });
      await User.insertMany(sanitizedUsers);
      userCount = sanitizedUsers.length;
      console.log(
        `[Database] Seeded ${sanitizedUsers.length} users into MongoDB Atlas.`
      );
    }

    let itinCount = await Itinerarios.countDocuments();
    if (itinCount === 0) {
      const itinerariesToSeed =
        Array.isArray(localData.itinerarios) &&
        localData.itinerarios.length > 0
          ? localData.itinerarios
          : SEED_ITINERARIES;
      await Itinerarios.insertMany(itinerariesToSeed);
      itinCount = itinerariesToSeed.length;
      console.log(
        `[Database] Seeded ${itinerariesToSeed.length} itineraries into MongoDB Atlas.`
      );
    }

    return {
      cities: cityCount,
      itineraries: itinCount,
      activities: actCount,
      users: userCount,
    };
  } catch (err) {
    console.warn("[Database] Seed check warning:", err.message);
    return null;
  }
}

function enableFallback(reason) {
  mongoose.set("bufferCommands", false);
  const counts = activateLocalFallback({
    Ciudades,
    Itinerarios,
    Activities,
    User,
  });
  dbStatus = {
    connected: true,
    mode: "local-persistence",
    reason,
    counts,
  };
  console.log(
    `Database connected (Local Persistence Engine active: ${counts.cities} cities, ${counts.itineraries} itineraries, ${counts.activities} activities)`
  );
}

async function connectDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    dbStatus.connected = true;
    dbStatus.mode = "mongodb-atlas";
    return dbStatus;
  }

  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/MyTinerary";

  if (process.env.USE_LOCAL_STORE === "true") {
    enableFallback("USE_LOCAL_STORE=true");
    return dbStatus;
  }

  mongoose.connection.on("connected", () => {
    dbStatus.connected = true;
    dbStatus.mode = "mongodb-atlas";
  });

  mongoose.connection.on("disconnected", () => {
    if (dbStatus.mode === "mongodb-atlas") {
      console.warn("[Database] MongoDB disconnected.");
    }
  });

  mongoose.connection.on("error", (err) => {
    if (dbStatus.mode === "mongodb-atlas") {
      console.error("[Database] MongoDB connection error:", err.message);
    }
  });

  try {
    if (!cached.promise) {
      const opts = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      };
      cached.promise = mongoose.connect(mongoUri, opts);
    }

    cached.conn = await cached.promise;
    const counts = await seedMongoIfNeeded();
    dbStatus = {
      connected: true,
      mode: "mongodb-atlas",
      cluster: "cluster0.ejehvtx.mongodb.net",
      database: mongoose.connection.name || "MyTinerary",
      counts,
    };
    console.log(
      `Database connected (MongoDB Atlas: ${dbStatus.database} @ ${
        dbStatus.cluster
      } | Cities: ${counts?.cities ?? 0}, Itineraries: ${
        counts?.itineraries ?? 0
      }, Activities: ${counts?.activities ?? 0}, Users: ${counts?.users ?? 0})`
    );
    return dbStatus;
  } catch (err) {
    cached.promise = null;
    console.warn(
      `[Database] External MongoDB unreachable (${err.message}). Switching to local persistent store.`
    );
    enableFallback(err.message);
    return dbStatus;
  }
}

function getDatabaseStatus() {
  return dbStatus;
}

module.exports = {
  connectDatabase,
  getDatabaseStatus,
};
