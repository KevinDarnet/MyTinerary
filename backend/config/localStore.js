const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DB_FILE = path.join(__dirname, ".local-db.json");

const newObjectId = () => crypto.randomBytes(12).toString("hex");

const SEED_CITIES = [
  {
    _id: "62285659fdba39406f642a01",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80",
    city: "Pekin",
    description:
      "The Great Wall of China is a series of fortifications that were built across the historical northern borders of ancient Chinese states. It is the longest structure humans have ever built. It is about 21,196 kilometers long, 9.1 metres (30 feet) wide and 15 metres high.",
    country: "China",
    coin: "Renminbi",
    language: "Mandarin",
    lenguage: "Mandarin",
    flag: "https://flagcdn.com/w320/cn.png",
  },
  {
    _id: "62285659fdba39406f642a02",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80",
    city: "Giza",
    description:
      "The Great Pyramid of Giza (also known as the Pyramid of Khufu or the Pyramid of Cheops) is the oldest and largest of the pyramids in the Giza pyramid complex bordering present-day Giza in Greater Cairo, Egypt. It is the oldest of the Seven Wonders of the Ancient World, and the only one to remain largely intact.",
    country: "Egypt",
    coin: "Egyptian pound",
    language: "Arab",
    lenguage: "Arab",
    flag: "https://flagcdn.com/w320/eg.png",
  },
  {
    _id: "62285659fdba39406f642a03",
    image:
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80",
    city: "Bangkok",
    description:
      "The Grand Palace is a complex of buildings at the heart of Bangkok, Thailand. The palace has been the official residence of the Kings of Siam (and later Thailand) since 1782.",
    country: "Thailand",
    coin: "Baht",
    language: "Thai",
    lenguage: "Thai",
    flag: "https://flagcdn.com/w320/th.png",
  },
  {
    _id: "62285659fdba39406f642a04",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    city: "Fuji",
    description:
      "Rising to 12,388 feet (3,776 metres), Mount Fuji is the tallest mountain in Japan and is known for its graceful conical form. It is the country's sacred symbol, and temples and shrines are located around and on the volcano.",
    country: "Japan",
    coin: "Yen",
    language: "Japanese",
    lenguage: "Japanese",
    flag: "https://flagcdn.com/w320/jp.png",
  },
  {
    _id: "62285659fdba39406f642a05",
    image:
      "https://images.unsplash.com/photo-1485465053475-dd55ed3894b9?auto=format&fit=crop&w=800&q=80",
    city: "Neuschwanstein",
    description:
      "Neuschwanstein Castle, German Schloss Neuschwanstein, elaborate castle near Füssen, Germany, built atop a rock ledge over the Pöllat Gorge in the Bavarian Alps by order of Bavaria's King Louis II.",
    country: "Germany",
    coin: "Euro",
    language: "German",
    lenguage: "German",
    flag: "https://flagcdn.com/w320/de.png",
  },
  {
    _id: "62285659fdba39406f642a06",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    city: "Roma",
    description:
      "The Colosseum is an amphitheatre built in Rome under the Flavian emperors of the Roman Empire. It is also called the Flavian Amphitheatre. It is an elliptical structure made of stone, concrete, and tuff.",
    country: "Italy",
    coin: "Euro",
    language: "Italian",
    lenguage: "Italian",
    flag: "https://flagcdn.com/w320/it.png",
  },
  {
    _id: "62285659fdba39406f642a07",
    image:
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80",
    city: "Chichén Itzá",
    description:
      "Chichén Itzá, ruined ancient Maya city occupying an area of 4 square miles (10 square km) in south-central Yucatán state, Mexico.",
    country: "Mexico",
    coin: "Mexican pesos",
    language: "Spanish",
    lenguage: "Spanish",
    flag: "https://flagcdn.com/w320/mx.png",
  },
  {
    _id: "62285659fdba39406f642a08",
    image:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80",
    city: "Instanbul",
    description:
      "Hagia Sophia, an important Byzantine structure in Istanbul and one of the world's great monuments. It was built as a Christian church in the 6th century CE under the direction of the Byzantine emperor Justinian I.",
    country: "Turkey",
    coin: "Turkish Lira",
    language: "Turkish",
    lenguage: "Turkish",
    flag: "https://flagcdn.com/w320/tr.png",
  },
  {
    _id: "62285659fdba39406f642a09",
    image:
      "https://images.unsplash.com/photo-1566800890932-e89159daf3dc?auto=format&fit=crop&w=800&q=80",
    city: "Seoul",
    description:
      "Originally built in 1395, Gyeongbokgung Palace is the largest and greatest of Seoul's Five Grand Palaces. Today, the palace grounds, filled with lotus ponds, gardens, and ornate statues, offer a lovely place to spend the afternoon.",
    country: "South Korea",
    coin: "Won",
    language: "Korean",
    lenguage: "Korean",
    flag: "https://flagcdn.com/w320/kr.png",
  },
  {
    _id: "62285659fdba39406f642a0a",
    image:
      "https://images.unsplash.com/photo-1566559532224-6d65e9fc0f37?auto=format&fit=crop&w=800&q=80",
    city: "Java",
    description:
      "This famous Buddhist temple, dating from the 8th and 9th centuries, is located in central Java. Around the circular platforms are 72 openwork stupas, each containing a statue of the Buddha.",
    country: "Indonesia",
    coin: "Indonesian Rupiah",
    language: "Indonesian",
    lenguage: "Indonesian",
    flag: "https://flagcdn.com/w320/id.png",
  },
  {
    _id: "62285659fdba39406f642a0b",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    city: "Kilimanjaro",
    description:
      "Mount Kilimanjaro is the tallest mountain on the African continent and the highest free-standing mountain in the world. Kilimanjaro has three volcanic cones, Mawenzi, Shira and Kibo.",
    country: "Tanzania",
    coin: "Tanzanian Shilling",
    language: "Swahili",
    lenguage: "Swahili",
    flag: "https://flagcdn.com/w320/tz.png",
  },
  {
    _id: "62285659fdba39406f642a0c",
    image:
      "https://images.unsplash.com/photo-1543256138-9ef29484868f?auto=format&fit=crop&w=800&q=80",
    city: "Iguaçu Falls",
    description:
      "Iguaçu Falls, series of cataracts on the Iguaçu River, 14 miles above its confluence with the Alto Paraná River, at the Argentina-Brazil border.",
    country: "Argentina",
    coin: "Argentine pesos",
    language: "Spanish",
    lenguage: "Spanish",
    flag: "https://flagcdn.com/w320/ar.png",
  },
  {
    _id: "62285659fdba39406f642a0d",
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80",
    city: "Machu Picchu",
    description:
      "Machu Picchu, Ancient fortress city of the Incas in the Andes Mountains, south-central Peru. Perched near Cuzco in a narrow saddle between two sharp peaks, at an elevation of 7,710 ft.",
    country: "Peru",
    coin: "Peruvian Sol",
    language: "Spanish",
    lenguage: "Spanish",
    flag: "https://flagcdn.com/w320/pe.png",
  },
  {
    _id: "62285659fdba39406f642a0e",
    image:
      "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=800&q=80",
    city: "Acropolis",
    description:
      "The Acropolis of Athens is one of the most famous ancient archaeological sites in the world. Located on a limestone hill high above Athens, Greece, the Acropolis has been inhabited since prehistoric times.",
    country: "Greece",
    coin: "Euro",
    language: "Greek",
    lenguage: "Greek",
    flag: "https://flagcdn.com/w320/gr.png",
  },
  {
    _id: "62285659fdba39406f642a0f",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
    city: "Taj Mahal",
    description:
      "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife.",
    country: "India",
    coin: "Indian Rupee",
    language: "Hindi",
    lenguage: "Hindi",
    flag: "https://flagcdn.com/w320/in.png",
  },
];

const SEED_ITINERARIES = [
  {
    _id: "62285659fdba39406f642aa6",
    image:
      "https://images.unsplash.com/photo-1608037521277-154cd1b89191?auto=format&fit=crop&w=800&q=80",
    name: "Great Wall of China",
    userimage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    username: "Iwao Komiyama",
    details:
      "Few cities in the world have served for so long as the political headquarters and cultural centre of an area as immense as China.",
    price: 4,
    duration: "2h",
    hashtag: ["#Pekin", "#greatwall"],
    likes: [],
    activities: [
      "62285659fdba39406f642b01",
      "62285659fdba39406f642b02",
      "62285659fdba39406f642b03",
    ],
    comments: [],
    cityId: "62285659fdba39406f642a01",
  },
  {
    _id: "62285659fdba39406f642aa7",
    image:
      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&q=80",
    name: "Yonghe Temple & Imperial Beijing",
    userimage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    username: "Ramon Garcia",
    details:
      "Visit to Yonghe Temple, Forbidden City, and Tiananmen Square. One of the greatest historical and Buddhist tours in Beijing.",
    price: 2,
    duration: "1.5h",
    hashtag: ["#YongheTemple", "#Pekin"],
    likes: [],
    activities: [
      "62285659fdba39406f642b04",
      "62285659fdba39406f642b05",
      "62285659fdba39406f642b06",
    ],
    comments: [],
    cityId: "62285659fdba39406f642a01",
  },
  {
    _id: "62285659fdba39406f642aa8",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80",
    name: "Pyramid of Khafre",
    userimage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    username: "Lujan Rodriguez",
    details:
      "Built by Khufu's son Khafre, it at first appears to be larger than his father's earlier pyramid as it stands on a higher piece of land.",
    price: 5,
    duration: "5h",
    hashtag: ["#Chephren", "#Pyramid"],
    likes: [],
    activities: [
      "62285659fdba39406f642b07",
      "62285659fdba39406f642b08",
      "62285659fdba39406f642b09",
    ],
    comments: [],
    cityId: "62285659fdba39406f642a02",
  },
  {
    _id: "62285659fdba39406f642aa9",
    image:
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=800&q=80",
    name: "Solar Boat Museum",
    userimage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
    username: "James Rodriguez",
    details:
      "Excavations on the south and east sides of the Pyramid of Cheops in 1954 brought to light five long cavities for boats, with a Solar Barque broken into more than a thousand pieces as a votive offering.",
    price: 2,
    duration: "1.5h",
    hashtag: ["#Solarboatmuseum", "#Guiza"],
    likes: [],
    activities: [
      "62285659fdba39406f642b0a",
      "62285659fdba39406f642b0b",
      "62285659fdba39406f642b0c",
    ],
    comments: [],
    cityId: "62285659fdba39406f642a02",
  },
];

const SEED_ACTIVITIES = [
  {
    _id: "62285659fdba39406f642b01",
    image:
      "https://images.unsplash.com/photo-1622664687876-01dbb7534227?auto=format&fit=crop&w=600&q=80",
    name: "Hike on the Great Wall at Night",
    description:
      "You may have seen beautiful pictures of the Great Wall below blue sky and white clouds. But have you seen Great Wall glowing at night?",
    itineraryId: "62285659fdba39406f642aa6",
  },
  {
    _id: "62285659fdba39406f642b02",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&q=80",
    name: "Take a Roller Coaster Cart Down from the Great Wall",
    description:
      "The Great Wall was built on mountain ridges. So, to reach the wall, you will usually need to hike up mountain paths for about 1 hour, and you will also need to hike down.",
    itineraryId: "62285659fdba39406f642aa6",
  },
  {
    _id: "62285659fdba39406f642b03",
    image:
      "https://images.unsplash.com/photo-1608037521277-154cd1b89191?auto=format&fit=crop&w=600&q=80",
    name: "The Huangyaguan Great Wall Marathon",
    description:
      "The Huangyaguan Marathon was first held in 1999, and has become very popular for its challenging route, stunning Great Wall scenery, and quiet Chinese villages.",
    itineraryId: "62285659fdba39406f642aa6",
  },
  {
    _id: "62285659fdba39406f642b04",
    image:
      "https://images.unsplash.com/photo-1532690671373-229d09573d2e?auto=format&fit=crop&w=600&q=80",
    name: "Forbidden City",
    description:
      "This once restricted imperial palace is today a public museum showcasing the splendor of ancient China. It is one of the most impressive places in Beijing.",
    itineraryId: "62285659fdba39406f642aa7",
  },
  {
    _id: "62285659fdba39406f642b05",
    image:
      "https://images.unsplash.com/photo-1595553919120-11102b856132?auto=format&fit=crop&w=600&q=80",
    name: "Tiananmen Square",
    description:
      "This place is one of the most famous squares in the world and the very heart of Beijing.",
    itineraryId: "62285659fdba39406f642aa7",
  },
  {
    _id: "62285659fdba39406f642b06",
    image:
      "https://images.unsplash.com/photo-1676084759059-25043026e30b?auto=format&fit=crop&w=600&q=80",
    name: "Heaven Temple",
    description:
      "Behind a high wall is an ancient building once used for sacrifices. This huge, historic place of worship is a tranquil oasis in the middle of Beijing.",
    itineraryId: "62285659fdba39406f642aa7",
  },
  {
    _id: "62285659fdba39406f642b07",
    image:
      "https://images.unsplash.com/photo-1564554860010-304d58f6edb1?auto=format&fit=crop&w=600&q=80",
    name: "The burial chamber of the pyramid of Kafre",
    description: "Giza Plateau",
    itineraryId: "62285659fdba39406f642aa8",
  },
  {
    _id: "62285659fdba39406f642b08",
    image:
      "https://images.unsplash.com/photo-1622232000273-cb708f385d6d?auto=format&fit=crop&w=600&q=80",
    name: "The room with the pointed ceiling",
    description: "The Pyramid of King Khafre",
    itineraryId: "62285659fdba39406f642aa8",
  },
  {
    _id: "62285659fdba39406f642b09",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=600&q=80",
    name: "The top of the pyramid of Khafre",
    description: "Giza Plateau",
    itineraryId: "62285659fdba39406f642aa8",
  },
  {
    _id: "62285659fdba39406f642b0a",
    image:
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=600&q=80",
    name: "Day trip in Giza",
    description:
      "Giza Pyramids Day Trip include enter inside the Great Pyramid and Solar boat",
    itineraryId: "62285659fdba39406f642aa9",
  },
  {
    _id: "62285659fdba39406f642b0b",
    image:
      "https://images.unsplash.com/photo-1636609586443-e0183b5b549b?auto=format&fit=crop&w=600&q=80",
    name: "Half-Day Tour",
    description:
      "Half-Day Tour of the Giza Pyramids and Solar Boat Museum with Lunch and Camel Ride",
    itineraryId: "62285659fdba39406f642aa9",
  },
  {
    _id: "62285659fdba39406f642b0c",
    image:
      "https://images.unsplash.com/photo-1664218018648-cf24224ee376?auto=format&fit=crop&w=600&q=80",
    name: "Private Half-Day Tour",
    description:
      "Private Half-Day Tour to Giza Pyramids & Sphinx Entry Cheops & Camel Ride",
    itineraryId: "62285659fdba39406f642aa9",
  },
];

let storeData = null;

function loadStore() {
  if (storeData) return storeData;
  if (fs.existsSync(DB_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      if (parsed && Array.isArray(parsed.ciudades) && parsed.ciudades.length > 0) {
        storeData = parsed;
        return storeData;
      }
    } catch (err) {
      // ignore corrupted file and re-initialize from seed
    }
  }
  storeData = {
    ciudades: JSON.parse(JSON.stringify(SEED_CITIES)),
    itinerarios: JSON.parse(JSON.stringify(SEED_ITINERARIES)),
    activities: JSON.parse(JSON.stringify(SEED_ACTIVITIES)),
    users: [],
  };
  saveStore();
  return storeData;
}

function saveStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(storeData, null, 2), "utf8");
  } catch (err) {
    console.error("[LocalStore] Error persisting local store:", err.message);
  }
}

function matchesQuery(doc, query = {}) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, val] of Object.entries(query)) {
    if (val === undefined) continue;
    if (key.includes(".")) {
      const [parent, child] = key.split(".");
      const arr = doc[parent];
      if (Array.isArray(arr)) {
        const found = arr.some((item) => item && String(item[child]) === String(val));
        if (!found) return false;
      } else if (arr && typeof arr === "object") {
        if (String(arr[child]) !== String(val)) return false;
      } else {
        return false;
      }
    } else {
      if (String(doc[key]) !== String(val)) return false;
    }
  }
  return true;
}

function attachSaveMethod(collectionName, doc) {
  if (!doc || typeof doc !== "object") return doc;
  Object.defineProperty(doc, "save", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: async function () {
      const db = loadStore();
      const list = db[collectionName];
      if (!this._id) {
        this._id = newObjectId();
      }
      const idx = list.findIndex((item) => String(item._id) === String(this._id));
      const plain = { ...this };
      if (idx >= 0) {
        list[idx] = plain;
      } else {
        list.push(plain);
      }
      saveStore();
      return attachSaveMethod(collectionName, plain);
    },
  });
  return doc;
}

function applyPopulate(docs, populateSpecs) {
  if (!populateSpecs || populateSpecs.length === 0) return docs;
  const db = loadStore();
  const isArray = Array.isArray(docs);
  const items = isArray ? docs : docs ? [docs] : [];

  const cloned = items.map((item) => {
    const copy = JSON.parse(JSON.stringify(item));
    for (const spec of populateSpecs) {
      const pathName = spec.path;
      if (pathName === "activities" && Array.isArray(copy.activities)) {
        copy.activities = copy.activities
          .map((actId) => {
            if (actId && typeof actId === "object") return actId;
            return db.activities.find((a) => String(a._id) === String(actId)) || null;
          })
          .filter(Boolean);
      } else if (pathName === "comments.userID" && Array.isArray(copy.comments)) {
        copy.comments = copy.comments.map((c) => {
          const userId = c.userID && typeof c.userID === "object" ? c.userID._id : c.userID;
          const u = db.users.find((usr) => String(usr._id) === String(userId));
          if (!u) return c;
          const rawPic = (u.photo || u.picture || u.userimage || u.userPhoto || u.image || "").trim();
          const validPic = /^https?:\/\/|^data:image\//i.test(rawPic) ? rawPic : "";
          const fullName = u.fullName || u.name || u.username || "Traveler";
          return {
            ...c,
            userID: {
              _id: u._id,
              id: u._id,
              fullName,
              name: fullName,
              username: fullName,
              picture: validPic,
              photo: validPic,
              userPhoto: validPic,
              image: validPic,
              userimage: validPic,
              email: u.email,
            },
          };
        });
      } else if (pathName === "cityId" && copy.cityId) {
        const cId = typeof copy.cityId === "object" ? copy.cityId._id : copy.cityId;
        const cityObj = db.ciudades.find((c) => String(c._id) === String(cId));
        if (cityObj) copy.cityId = cityObj;
      }
    }
    return copy;
  });

  return isArray ? cloned : cloned[0] || null;
}

function createQueryChain(executor) {
  const populateSpecs = [];
  const promise = new Promise((resolve, reject) => {
    setImmediate(async () => {
      try {
        const raw = await executor();
        const populated = applyPopulate(raw, populateSpecs);
        resolve(populated);
      } catch (err) {
        reject(err);
      }
    });
  });

  promise.populate = function (pathStr, select) {
    populateSpecs.push({ path: pathStr, select });
    return promise;
  };

  promise.lean = function () {
    return promise;
  };

  promise.exec = function () {
    return promise;
  };

  return promise;
}

function patchModelWithLocalStore(Model, collectionName) {
  // Override instance save() on Model.prototype so `new Model(data).save()` uses local store
  Model.prototype.save = async function () {
    const db = loadStore();
    const list = db[collectionName];
    const obj = this.toObject ? this.toObject() : { ...this };
    if (!obj._id) {
      obj._id = newObjectId();
    } else {
      obj._id = String(obj._id);
    }
    if (collectionName === "ciudades") {
      if (obj.language && !obj.lenguage) obj.lenguage = obj.language;
      if (obj.lenguage && !obj.language) obj.language = obj.lenguage;
      if (!obj.city && obj.name) obj.city = obj.name;
    }
    const idx = list.findIndex((item) => String(item._id) === String(obj._id));
    if (idx >= 0) {
      list[idx] = obj;
    } else {
      list.push(obj);
    }
    saveStore();
    return attachSaveMethod(collectionName, obj);
  };

  Model.find = function (query = {}) {
    return createQueryChain(async () => {
      const db = loadStore();
      return db[collectionName]
        .filter((doc) => matchesQuery(doc, query))
        .map((doc) => attachSaveMethod(collectionName, { ...doc }));
    });
  };

  Model.findOne = function (query = {}) {
    return createQueryChain(async () => {
      const db = loadStore();
      const found = db[collectionName].find((doc) => matchesQuery(doc, query));
      return found ? attachSaveMethod(collectionName, { ...found }) : null;
    });
  };

  Model.findById = function (id) {
    return Model.findOne({ _id: id });
  };

  Model.findOneAndDelete = function (query = {}) {
    return createQueryChain(async () => {
      const db = loadStore();
      const list = db[collectionName];
      const idx = list.findIndex((doc) => matchesQuery(doc, query));
      if (idx === -1) return null;
      const [removed] = list.splice(idx, 1);
      saveStore();
      return removed;
    });
  };

  Model.findOneAndUpdate = function (query = {}, update = {}, options = {}) {
    return createQueryChain(async () => {
      const db = loadStore();
      const list = db[collectionName];
      const idx = list.findIndex((doc) => matchesQuery(doc, query));
      if (idx === -1) return null;

      const doc = JSON.parse(JSON.stringify(list[idx]));

      // Handle $push
      if (update.$push) {
        for (const [field, value] of Object.entries(update.$push)) {
          if (!Array.isArray(doc[field])) doc[field] = [];
          if (field === "comments" && value && typeof value === "object") {
            doc[field].push({
              _id: value._id || newObjectId(),
              comment: value.comment,
              userID: String(value.userID),
              userName: value.userName || "",
              userPhoto: value.userPhoto || "",
            });
          } else if (field === "likes") {
            doc[field].push(String(value));
          } else {
            doc[field].push(value);
          }
        }
      }

      // Handle $pull
      if (update.$pull) {
        for (const [field, condition] of Object.entries(update.$pull)) {
          if (Array.isArray(doc[field])) {
            if (condition && typeof condition === "object") {
              doc[field] = doc[field].filter((item) => !matchesQuery(item, condition));
            } else {
              doc[field] = doc[field].filter((item) => String(item) !== String(condition));
            }
          }
        }
      }

      // Handle $set
      if (update.$set) {
        for (const [field, value] of Object.entries(update.$set)) {
          if (field === "comments.$.comment" && query["comments._id"]) {
            const targetId = String(query["comments._id"]);
            if (Array.isArray(doc.comments)) {
              doc.comments = doc.comments.map((c) =>
                String(c._id) === targetId ? { ...c, comment: value } : c
              );
            }
          } else {
            doc[field] = value;
          }
        }
      }

      // Handle direct field updates (when no $ operators used)
      const hasOperator = Object.keys(update).some((k) => k.startsWith("$"));
      if (!hasOperator) {
        Object.assign(doc, update);
      }

      list[idx] = doc;
      saveStore();
      return attachSaveMethod(collectionName, doc);
    });
  };

  Model.countDocuments = async function (query = {}) {
    const db = loadStore();
    return db[collectionName].filter((doc) => matchesQuery(doc, query)).length;
  };
}

function activateLocalFallback(models) {
  const db = loadStore();
  if (models.Ciudades) patchModelWithLocalStore(models.Ciudades, "ciudades");
  if (models.Itinerarios) patchModelWithLocalStore(models.Itinerarios, "itinerarios");
  if (models.Activities) patchModelWithLocalStore(models.Activities, "activities");
  if (models.User) patchModelWithLocalStore(models.User, "users");
  return {
    cities: db.ciudades.length,
    itineraries: db.itinerarios.length,
    activities: db.activities.length,
    users: db.users.length,
  };
}

module.exports = {
  SEED_CITIES,
  SEED_ITINERARIES,
  SEED_ACTIVITIES,
  activateLocalFallback,
  loadStore,
};
