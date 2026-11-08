const mongoose = require("mongoose");

const ciudadesSchema = new mongoose.Schema({
  image: {
    type: String,
    default:
      "https://tipsparatuviaje.com/wp-content/uploads/2019/08/coliseo-roma-italia.jpg",
  },
  city: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  country: { type: String, required: true, trim: true },
  coin: { type: String, required: true, trim: true },
  language: { type: String, default: "English" },
  lenguage: { type: String, default: "English" },
  flag: { type: String, default: "" },
});

const Ciudades =
  mongoose.models.ciudades || mongoose.model("ciudades", ciudadesSchema);
module.exports = Ciudades;
