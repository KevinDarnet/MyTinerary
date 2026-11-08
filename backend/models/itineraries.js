const mongoose = require("mongoose");

const itinerariesSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true },
  userimage: { type: String, required: true },
  details: { type: String, required: true },
  price: { type: Number, required: true, min: 1, max: 5 },
  duration: { type: String, required: true },
  hashtag: [{ type: String }],
  likes: { type: Array, default: [] },
  activities: [{ type: mongoose.Types.ObjectId, ref: "activities" }],
  comments: [
    {
      comment: { type: String, trim: true },
      userID: { type: mongoose.Types.ObjectId, ref: "users" },
      userName: { type: String, default: "" },
      userPhoto: { type: String, default: "" },
    },
  ],
  cityId: { type: mongoose.Types.ObjectId, ref: "ciudades" },
});

const Itineraries =
  mongoose.models.itinerarios ||
  mongoose.model("itinerarios", itinerariesSchema);
module.exports = Itineraries;
