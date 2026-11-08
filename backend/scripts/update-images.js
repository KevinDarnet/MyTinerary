/**
 * Curated, high-resolution Unsplash CDN image dataset for MyTinerary
 * - Cities: w=800&q=80 (auto=format&fit=crop)
 * - Itineraries: w=800&q=80 (featured tour image) & w=250&q=80 (local guide portrait)
 * - Activities: w=600&q=80 (monument/experience photo)
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env"), override: true });
const fs = require("fs");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");
const Ciudades = require("../models/ciudades");
const Itinerarios = require("../models/itineraries");
const Activities = require("../models/activities");

const LOCAL_DB_PATH = path.join(__dirname, "..", "config", ".local-db.json");

const CITY_IMAGES = {
  "62285659fdba39406f642a01": {
    city: "Pekin",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a02": {
    city: "Giza",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a03": {
    city: "Bangkok",
    image:
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a04": {
    city: "Fuji",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a05": {
    city: "Neuschwanstein",
    image:
      "https://images.unsplash.com/photo-1485465053475-dd55ed3894b9?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a06": {
    city: "Roma",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a07": {
    city: "Chichén Itzá",
    image:
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a08": {
    city: "Instanbul",
    image:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a09": {
    city: "Seoul",
    image:
      "https://images.unsplash.com/photo-1566800890932-e89159daf3dc?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a0a": {
    city: "Java",
    image:
      "https://images.unsplash.com/photo-1566559532224-6d65e9fc0f37?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a0b": {
    city: "Kilimanjaro",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a0c": {
    city: "Iguaçu Falls",
    image:
      "https://images.unsplash.com/photo-1543256138-9ef29484868f?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a0d": {
    city: "Machu Picchu",
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a0e": {
    city: "Acropolis",
    image:
      "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=800&q=80",
  },
  "62285659fdba39406f642a0f": {
    city: "Taj Mahal",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
  },
};

const ITINERARY_IMAGES = {
  "62285659fdba39406f642aa6": {
    name: "Great Wall of China",
    image:
      "https://images.unsplash.com/photo-1608037521277-154cd1b89191?auto=format&fit=crop&w=800&q=80",
    userimage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
  },
  "62285659fdba39406f642aa7": {
    name: "Yonghe Temple & Imperial Beijing",
    image:
      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&q=80",
    userimage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
  },
  "62285659fdba39406f642aa8": {
    name: "Pyramid of Khafre",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80",
    userimage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
  },
  "62285659fdba39406f642aa9": {
    name: "Solar Boat Museum",
    image:
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=800&q=80",
    userimage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
  },
};

const ACTIVITY_IMAGES = {
  "62285659fdba39406f642b01": {
    name: "Hike on the Great Wall at Night",
    image:
      "https://images.unsplash.com/photo-1622664687876-01dbb7534227?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b02": {
    name: "Take a Roller Coaster Cart Down from the Great Wall",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b03": {
    name: "The Huangyaguan Great Wall Marathon",
    image:
      "https://images.unsplash.com/photo-1608037521277-154cd1b89191?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b04": {
    name: "Forbidden City",
    image:
      "https://images.unsplash.com/photo-1532690671373-229d09573d2e?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b05": {
    name: "Tiananmen Square",
    image:
      "https://images.unsplash.com/photo-1595553919120-11102b856132?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b06": {
    name: "Heaven Temple",
    image:
      "https://images.unsplash.com/photo-1676084759059-25043026e30b?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b07": {
    name: "The burial chamber of the pyramid of Kafre",
    image:
      "https://images.unsplash.com/photo-1564554860010-304d58f6edb1?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b08": {
    name: "The room with the pointed ceiling",
    image:
      "https://images.unsplash.com/photo-1622232000273-cb708f385d6d?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b09": {
    name: "The top of the pyramid of Khafre",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b0a": {
    name: "Day trip in Giza",
    image:
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b0b": {
    name: "Half-Day Tour",
    image:
      "https://images.unsplash.com/photo-1636609586443-e0183b5b549b?auto=format&fit=crop&w=600&q=80",
  },
  "62285659fdba39406f642b0c": {
    name: "Private Half-Day Tour",
    image:
      "https://images.unsplash.com/photo-1664218018648-cf24224ee376?auto=format&fit=crop&w=600&q=80",
  },
};

function checkUrlStatus(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: "HEAD", timeout: 8000 }, (res) => {
      resolve({ url, statusCode: res.statusCode });
    });
    req.on("error", (err) => resolve({ url, statusCode: 0, error: err.message }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ url, statusCode: 0, error: "timeout" });
    });
    req.end();
  });
}

async function updateLocalStore() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    console.warn("[LocalStore] .local-db.json not found at", LOCAL_DB_PATH);
    return;
  }
  const data = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf8"));

  if (Array.isArray(data.ciudades)) {
    data.ciudades = data.ciudades.map((c) => {
      const match = CITY_IMAGES[String(c._id)] || Object.values(CITY_IMAGES).find((item) => item.city === c.city);
      return match ? { ...c, image: match.image } : c;
    });
  }

  if (Array.isArray(data.itinerarios)) {
    data.itinerarios = data.itinerarios.map((it) => {
      const match = ITINERARY_IMAGES[String(it._id)] || Object.values(ITINERARY_IMAGES).find((item) => item.name === it.name);
      return match
        ? { ...it, image: match.image, userimage: match.userimage }
        : it;
    });
  }

  if (Array.isArray(data.activities)) {
    data.activities = data.activities.map((act) => {
      const match = ACTIVITY_IMAGES[String(act._id)] || Object.values(ACTIVITY_IMAGES).find((item) => item.name === act.name);
      return match ? { ...act, image: match.image } : act;
    });
  }

  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  console.log("[LocalStore] Updated .local-db.json with curated Unsplash CDN URLs.");
}

async function main() {
  await updateLocalStore();

  const allUrls = [
    ...Object.values(CITY_IMAGES).map((x) => x.image),
    ...Object.values(ITINERARY_IMAGES).flatMap((x) => [x.image, x.userimage]),
    ...Object.values(ACTIVITY_IMAGES).map((x) => x.image),
  ];

  console.log(`Checking HTTP status for ${allUrls.length} Unsplash CDN URLs...`);
  const checks = await Promise.all(allUrls.map(checkUrlStatus));
  const failed = checks.filter((c) => c.statusCode < 200 || c.statusCode >= 400);
  if (failed.length > 0) {
    console.warn("Some URLs did not return 200/302:", failed);
  } else {
    console.log(`All ${allUrls.length} Unsplash CDN URLs verified HTTP 200 OK!`);
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.log("No MONGO_URI found, skipping remote Atlas update.");
    return;
  }

  console.log("Connecting to MongoDB Atlas to update collections...");
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  let updatedCities = 0;
  for (const [id, info] of Object.entries(CITY_IMAGES)) {
    const res = await Ciudades.updateOne(
      { $or: [{ _id: id }, { city: info.city }] },
      { $set: { image: info.image } }
    );
    updatedCities += res.modifiedCount || res.matchedCount || 0;
  }

  let updatedItineraries = 0;
  for (const [id, info] of Object.entries(ITINERARY_IMAGES)) {
    const res = await Itinerarios.updateOne(
      { $or: [{ _id: id }, { name: info.name }] },
      { $set: { image: info.image, userimage: info.userimage } }
    );
    updatedItineraries += res.modifiedCount || res.matchedCount || 0;
  }

  let updatedActivities = 0;
  for (const [id, info] of Object.entries(ACTIVITY_IMAGES)) {
    const res = await Activities.updateOne(
      { $or: [{ _id: id }, { name: info.name }] },
      { $set: { image: info.image } }
    );
    updatedActivities += res.modifiedCount || res.matchedCount || 0;
  }

  console.log(
    `[MongoDB Atlas] Successfully updated -> Cities: ${updatedCities}, Itineraries: ${updatedItineraries}, Activities: ${updatedActivities}`
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error in update-images:", err.message);
  process.exit(1);
});
