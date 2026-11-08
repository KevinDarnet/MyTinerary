const Activity = require("../models/activities");

const activityController = {
  getAllActivities: async (req, res, next) => {
    try {
      const data = await Activity.find();
      res.json({
        success: true,
        response: data,
      });
    } catch (error) {
      next(error);
    }
  },
  getItineraryActivities: async (req, res) => {
    try {
      const activityPerItinerary = await Activity.find({
        itineraryId: req.params.id,
      });
      res.json({
        success: true,
        response: activityPerItinerary,
      });
    } catch (error) {
      console.error("[Activities] Error fetching itinerary activities:", error.message);
      res.status(500).json({
        success: false,
        response: [],
        message: "Error fetching itinerary activities",
      });
    }
  },
  getOneActivity: async (req, res, next) => {
    try {
      const id = req.params.id;
      let data = await Activity.findOne({ itineraryId: id });
      if (!data) {
        data = await Activity.findOne({ _id: id });
      }
      res.json({ success: true, response: data });
    } catch (error) {
      next(error);
    }
  },
  uploadActivity: async (req, res, next) => {
    try {
      const { image, name, description, itineraryId } = req.body;
      const respuesta = await new Activity({
        image,
        name,
        description,
        itineraryId,
      }).save();
      res.json({ success: true, respuesta });
    } catch (error) {
      next(error);
    }
  },
  deleteActivity: async (req, res, next) => {
    try {
      const id = req.params.id;
      const respuesta = await Activity.findOneAndDelete({ _id: id });
      res.json({ success: true, respuesta });
    } catch (error) {
      next(error);
    }
  },
  modifyActivity: async (req, res, next) => {
    try {
      const id = req.params.id;
      const itinerary = req.body;
      const respuesta = await Activity.findOneAndUpdate({ _id: id }, itinerary, {
        new: true,
      });
      res.json({ success: true, respuesta });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = activityController;
