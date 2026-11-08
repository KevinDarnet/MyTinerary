const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  itineraryId: { type: mongoose.Types.ObjectId, ref: "itinerarios" },
});

const Activities =
  mongoose.models.activities || mongoose.model("activities", activitySchema);
module.exports = Activities;
