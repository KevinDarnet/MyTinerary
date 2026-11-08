require("dotenv").config({ path: require("path").join(__dirname, "..", ".env"), override: true });
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { connectDatabase } = require("../config/database");
const Ciudades = require("../models/ciudades");
const Itinerarios = require("../models/itineraries");
const Activities = require("../models/activities");

const LOCAL_DB_PATH = path.join(__dirname, "..", "config", ".local-db.json");

// High-resolution Unsplash curated itinerary and activities templates for all cities
const CITY_TEMPLATES = {
  bangkok: {
    itinerary: {
      name: "Grand Palace, Floating Markets & Sacred Temples of Bangkok",
      username: "Somchai Prasert",
      userimage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
      details: "Discover Bangkok's timeless royal heritage, gilded Buddhist shrines, and aromatic boat canals along the majestic Chao Phraya River.",
      price: 3,
      duration: "4.5h",
      hashtag: ["#Bangkok", "#FloatingMarket", "#Temples"],
    },
    activities: [
      {
        name: "Wat Phra Kaew & Grand Palace",
        description: "Marvel at the sacred Emerald Buddha and the gold-gilded stupas of Thailand's royal court.",
        image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Wat Arun (Temple of Dawn)",
        description: "Climb the porcelain-encrusted prang rising majestically over the Chao Phraya River.",
        image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Damnoen Saduak Floating Market",
        description: "Taste mango sticky rice and fresh coconut water from wooden boats along winding canals.",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  fuji: {
    itinerary: {
      name: "Mount Fuji Summit & Lake Kawaguchiko Panoramic Trail",
      username: "Kenji Takahashi",
      userimage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80",
      details: "An inspiring journey across alpine lakes and ancient shrines framed by Japan's most sacred snow-capped volcano.",
      price: 4,
      duration: "5h",
      hashtag: ["#Fuji", "#Japan", "#Kawaguchiko"],
    },
    activities: [
      {
        name: "Chureito Pagoda Viewpoint",
        description: "Iconic five-story pagoda framed by blooming cherry blossoms and Mount Fuji.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Lake Kawaguchiko Shore Walk",
        description: "Tranquil reflections of the snow-capped peak across serene mirror-like waters.",
        image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Oshino Hakkai Sacred Springs",
        description: "Eight crystal-clear ponds fed by melted snow filtered through Mount Fuji's volcanic rock.",
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  neuschwanstein: {
    itinerary: {
      name: "Fairytale Castles & Bavarian Alpine Trail",
      username: "Lukas Weber",
      userimage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
      details: "Immerse yourself in King Ludwig II's fairytale palace perched high above alpine forests and pristine lakes.",
      price: 3,
      duration: "4h",
      hashtag: ["#Neuschwanstein", "#Bavaria", "#Castles"],
    },
    activities: [
      {
        name: "Marienbrücke (Mary's Bridge)",
        description: "The ultimate vantage point suspended above the Pöllat Gorge overlooking Neuschwanstein.",
        image: "https://images.unsplash.com/photo-1485465053475-dd55ed3894b9?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "King Ludwig II Throne Room",
        description: "Intricate Byzantine-inspired gold mosaics and dramatic gothic halls inside the castle.",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Alpsee Lake Promenade",
        description: "Crystal alpine waters nestled at the foot of Hohenschwangau Castle and towering pines.",
        image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  roma: {
    itinerary: {
      name: "Imperial Rome, Colosseum Arena & Vatican Wonders",
      username: "Matteo Rossi",
      userimage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
      details: "Walk through three millennia of civilization across gladiatorial amphitheaters, baroque piazzas, and imperial forums.",
      price: 4,
      duration: "3.5h",
      hashtag: ["#Roma", "#Colosseum", "#Vatican"],
    },
    activities: [
      {
        name: "Colosseum Gladiators Arena",
        description: "Walk in the footsteps of ancient gladiators inside Rome's legendary amphitheater.",
        image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Roman Forum & Palatine Hill",
        description: "Explore the epic ruins of temples, triumphal arches, and imperial palaces.",
        image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Trevi Fountain Coin Toss",
        description: "Baroque masterpiece in marble where tossing a coin guarantees your return to Rome.",
        image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  "chichén itzá": {
    itinerary: {
      name: "Sacred Mayan Wonders, El Castillo & Cenote Ik Kil",
      username: "Ximena Canché",
      userimage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80",
      details: "Unravel ancient astronomy, sacred ball courts, and natural limestone cenotes in the mystical heart of the Yucatan.",
      price: 3,
      duration: "4h",
      hashtag: ["#ChichenItza", "#Maya", "#Yucatan"],
    },
    activities: [
      {
        name: "El Castillo (Temple of Kukulcán)",
        description: "Astronomical step pyramid where the serpent shadow descends during equinox.",
        image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Great Ball Court of the Gods",
        description: "The largest Mesoamerican ritual ball court with resonant acoustics and relief carvings.",
        image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Cenote Ik Kil Underworld Dive",
        description: "Sublime natural sinkhole surrounded by hanging vine curtains and azure groundwater.",
        image: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  instanbul: {
    itinerary: {
      name: "Bosphorus Crossroad: Hagia Sophia, Blue Mosque & Grand Bazaar",
      username: "Emre Demir",
      userimage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
      details: "Where East meets West across glistening straits, Ottoman architecture, and vibrant aromatic spice bazaars.",
      price: 3,
      duration: "4.5h",
      hashtag: ["#Istanbul", "#HagiaSophia", "#Bosphorus"],
    },
    activities: [
      {
        name: "Hagia Sophia Grand Mosque",
        description: "Sixth-century Byzantine dome with celestial golden mosaics and soaring minarets.",
        image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Blue Mosque (Sultan Ahmed)",
        description: "Cascading domes lined with tens of thousands of handmade Iznik blue tiles.",
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Grand Bazaar Spice Discovery",
        description: "Wander through 4,000 historic vaulted stalls rich in saffron, lamps, and Turkish delight.",
        image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  seoul: {
    itinerary: {
      name: "Royal Dynasties & High-Tech Neon Streets of Seoul",
      username: "Min-ho Park",
      userimage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1566800890932-e89159daf3dc?auto=format&fit=crop&w=800&q=80",
      details: "Experience Seoul's dual spirit from Joseon royal palaces and historic hanok villages to futuristic neon skylines.",
      price: 3,
      duration: "3.5h",
      hashtag: ["#Seoul", "#Korea", "#Gyeongbokgung"],
    },
    activities: [
      {
        name: "Gyeongbokgung Royal Palace",
        description: "Watch the changing of the royal guard in traditional colorful Joseon robes.",
        image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Bukchon Hanok Traditional Village",
        description: "Preserved tile-roofed wooden alleys dating back 600 years overlooking Seoul's skyline.",
        image: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "N Seoul Tower & Namsan Sunset",
        description: "Panoramic observatory with breathtaking views across the Han River.",
        image: "https://images.unsplash.com/photo-1506854199527-3105151a6688?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  java: {
    itinerary: {
      name: "Sunrise Over Borobudur & Mount Bromo Volcanic Trail",
      username: "Budi Santoso",
      userimage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1566559532224-6d65e9fc0f37?auto=format&fit=crop&w=800&q=80",
      details: "Witness mist rising over stone stupas at sunrise and trek across the otherworldly sea of sand on smoking volcanic calderas.",
      price: 3,
      duration: "5h",
      hashtag: ["#Java", "#Borobudur", "#Indonesia"],
    },
    activities: [
      {
        name: "Borobudur Temple Stupas",
        description: "World's largest Buddhist temple crowned with seventy-two perforated bell stupas.",
        image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Prambanan Hindu Sanctuary",
        description: "Towering ninth-century spires honoring Shiva, Brahma, and Vishnu.",
        image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Mount Bromo Sea of Sand",
        description: "Trek through smoking volcanic calderas in an otherworldly desert landscape.",
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  kilimanjaro: {
    itinerary: {
      name: "Rooftop of Africa: Marangu Rainforest & Alpine Safari Trail",
      username: "Emanuel Mollel",
      userimage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      details: "Ascend through pristine montane rainforests and high moorlands towards the legendary snow-covered summit of Kilimanjaro.",
      price: 5,
      duration: "6h",
      hashtag: ["#Kilimanjaro", "#Tanzania", "#Safari"],
    },
    activities: [
      {
        name: "Marangu Gate Rain Forest Trek",
        description: "Encounter blue monkeys and exotic orchids along the lush lower slopes.",
        image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Mandara Hut Moorland Ridge",
        description: "Ascend above the cloud line to volcanic heather fields and panoramic viewpoints.",
        image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Moshi Coffee Plantation Walk",
        description: "Sample fresh Arabica coffee harvested on rich volcanic mountain soil.",
        image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  "iguaçu falls": {
    itinerary: {
      name: "Devil's Throat & Subtropical Rainforest Boat Safari",
      username: "Carolina Farias",
      userimage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1543256138-9ef29484868f?auto=format&fit=crop&w=800&q=80",
      details: "Feel the immense geological power of nearly three hundred roaring waterfalls surrounded by lush Atlantic rainforest.",
      price: 4,
      duration: "4h",
      hashtag: ["#Iguacu", "#DevilsThroat", "#Waterfalls"],
    },
    activities: [
      {
        name: "Garganta del Diablo (Devil's Throat)",
        description: "Feel the roaring mist of fourteen thunderous falls plunging into the abyss.",
        image: "https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Upper Circuit Catwalks",
        description: "Suspended walkways crossing cascading streams right over the edge of the falls.",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Macuco Jungle Boat Experience",
        description: "Power directly under the refreshing cascades inside the Atlantic rainforest.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  "machu picchu": {
    itinerary: {
      name: "Lost City of the Incas, Sun Gate & Huayna Picchu Trail",
      username: "Inti Quispe",
      userimage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80",
      details: "Trek high into the Andes to the enigmatic Incan sanctuary perched between cloud forests and sacred granite peaks.",
      price: 5,
      duration: "5.5h",
      hashtag: ["#MachuPicchu", "#IncaTrail", "#Peru"],
    },
    activities: [
      {
        name: "Intihuatana Sacred Sun Stone",
        description: "Carved granite sundial and astronomic shrine of the Incan high priests.",
        image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Sun Gate (Inti Punku) Panorama",
        description: "First dramatic viewpoint of the lost citadel shrouded in morning mountain mist.",
        image: "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Terraced Agricultural Enclaves",
        description: "Verdant stone terraces where llamas graze above the rushing Urubamba River.",
        image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  acropolis: {
    itinerary: {
      name: "The Golden Age: Parthenon, Acropolis & Plaka Alleyways",
      username: "Elena Apostolou",
      userimage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=800&q=80",
      details: "Step into the cradle of Western philosophy, theatrical arts, and classical Greek architecture on the sacred rock of Athens.",
      price: 3,
      duration: "3.5h",
      hashtag: ["#Acropolis", "#Athens", "#Parthenon"],
    },
    activities: [
      {
        name: "The Parthenon Temple",
        description: "Fifth-century BC marble sanctuary dedicated to Athena Parthenos overlooking the Aegean.",
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Erechtheion & Porch of Caryatids",
        description: "Six maiden marble statues supporting the ancient roof of King Erechtheus' shrine.",
        image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Odeon of Herodes Atticus",
        description: "Roman stone theatre still hosting world-class performances under the stars.",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  "taj mahal": {
    itinerary: {
      name: "Monuments of Eternal Love & Mughal Heritage in Agra",
      username: "Aarav Sharma",
      userimage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
      details: "Behold the ethereal poetry in white marble, Mughal Persian gardens, and royal sandstone palaces along the sacred Yamuna River.",
      price: 4,
      duration: "4h",
      hashtag: ["#TajMahal", "#Agra", "#India"],
    },
    activities: [
      {
        name: "Taj Mahal Reflecting Pools",
        description: "Pure white marble mausoleum reflecting in the Charbagh Persian water gardens at dawn.",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Agra Red Fort Palaces",
        description: "Massive red sandstone fortress where Mughal emperors governed and beheld the Taj Mahal.",
        image: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Mehtab Bagh Moonlight Garden",
        description: "Tranquil riverside park across the Yamuna offering the best sunset silhouette of the dome.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
};

function normalizeKey(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function findTemplate(cityName) {
  const norm = normalizeKey(cityName);
  for (const [key, tpl] of Object.entries(CITY_TEMPLATES)) {
    if (normalizeKey(key) === norm || norm.includes(normalizeKey(key)) || normalizeKey(key).includes(norm)) {
      return tpl;
    }
  }
  return null;
}

async function main() {
  console.log("=== Starting Itinerary & Activity Population for MongoDB Atlas ===");
  const status = await connectDatabase();
  console.log("Database Status:", JSON.stringify(status, null, 2));

  if (status.mode !== "mongodb-atlas") {
    console.warn("[Notice] Operating on mode:", status.mode);
  }

  const allCitiesRaw = await Ciudades.find();
  const allCities = [...allCitiesRaw].sort((a, b) => (a.city || "").localeCompare(b.city || ""));
  console.log(`\nFound ${allCities.length} total cities in collection 'ciudades'. Auditing itineraries...\n`);

  let addedItinerariesCount = 0;
  let addedActivitiesCount = 0;

  for (const cityDoc of allCities) {
    const existingItineraries = await Itinerarios.find({ cityId: cityDoc._id });

    if (existingItineraries.length > 0) {
      console.log(
        `✓ [${cityDoc.city}] Already has ${existingItineraries.length} itinerary/ies. Keeping intact.`
      );
      continue;
    }

    // City lacks itineraries: populate
    console.log(`➜ [${cityDoc.city}] (ID: ${cityDoc._id}) has 0 itineraries. Generating full itinerary + 3 activities...`);

    const tpl = findTemplate(cityDoc.city);
    if (!tpl) {
      console.error(`  ✖ No template defined for city: "${cityDoc.city}"! Skipping.`);
      continue;
    }

    const newItineraryId = new mongoose.Types.ObjectId();
    const createdActivityIds = [];

    // Create the 3 activities
    for (const act of tpl.activities) {
      const actDoc = new Activities({
        name: act.name,
        description: act.description,
        image: act.image,
        itineraryId: newItineraryId,
      });
      await actDoc.save();
      createdActivityIds.push(actDoc._id);
      addedActivitiesCount++;
    }

    // Create the itinerary
    const itinDoc = new Itinerarios({
      _id: newItineraryId,
      name: tpl.itinerary.name,
      username: tpl.itinerary.username,
      userimage: tpl.itinerary.userimage,
      image: tpl.itinerary.image,
      details: tpl.itinerary.details,
      price: tpl.itinerary.price,
      duration: tpl.itinerary.duration,
      hashtag: tpl.itinerary.hashtag,
      likes: [],
      comments: [],
      activities: createdActivityIds,
      cityId: cityDoc._id,
    });

    await itinDoc.save();
    addedItinerariesCount++;

    console.log(
      `  ✓ Created Itinerary "${itinDoc.name}" (${itinDoc.duration}, Price ${itinDoc.price}/5) with ${createdActivityIds.length} activities.`
    );
  }

  console.log("\n=== Atlas Population Complete ===");
  console.log(`- New Itineraries created: ${addedItinerariesCount}`);
  console.log(`- New Activities created: ${addedActivitiesCount}`);

  // Synchronize local JSON fallback as well
  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      const localData = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf8"));
      const atlasItineraries = await Itinerarios.find();
      const atlasActivities = await Activities.find();

      localData.itineraries = JSON.parse(JSON.stringify(atlasItineraries));
      localData.activities = JSON.parse(JSON.stringify(atlasActivities));

      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localData, null, 2), "utf8");
      console.log(`✓ Synchronized ${LOCAL_DB_PATH} with ${atlasItineraries.length} itineraries and ${atlasActivities.length} activities.`);
    } catch (err) {
      console.warn("Could not sync local JSON database:", err.message);
    }
  }

  // Final Audit of all 15 cities
  console.log("\n=== Final Audit: All 15 Cities Status in MongoDB Atlas ===");
  const auditCitiesRaw = await Ciudades.find();
  const auditCities = [...auditCitiesRaw].sort((a, b) => (a.city || "").localeCompare(b.city || ""));
  for (const c of auditCities) {
    const itins = await Itinerarios.find({ cityId: c._id });
    let totalActs = 0;
    for (const itin of itins) {
      const acts = await Activities.find({ itineraryId: itin._id });
      totalActs += acts.length;
    }
    console.log(
      `• ${c.city.padEnd(16)} | Itineraries: ${itins.length} | Activities: ${totalActs} | First Itinerary: "${itins[0]?.name || 'NONE'}"`
    );
  }

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB Atlas successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal Error during population:", err);
  process.exit(1);
});
