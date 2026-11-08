const Itinerarios = require("../models/itineraries");

const USER_POPULATE_FIELDS =
  "fullName name username picture photo userPhoto image userimage email";

const itineraryController = {
  getItinerary: async (req, res, next) => {
    try {
      const data = await Itinerarios.find()
        .populate("activities")
        .populate("comments.userID", USER_POPULATE_FIELDS);
      res.json({
        success: true,
        response: data,
      });
    } catch (error) {
      next(error);
    }
  },
  cargarCiudadItinerary: async (req, res) => {
    try {
      const itineraryPerCity = await Itinerarios.find({
        cityId: req.query.cityId,
      })
        .populate("activities")
        .populate("comments.userID", USER_POPULATE_FIELDS);
      res.json({
        success: true,
        response: Array.isArray(itineraryPerCity) ? itineraryPerCity : [],
      });
    } catch (error) {
      console.error(
        "[Itineraries] Error fetching city itineraries:",
        error.message
      );
      res.status(500).json({
        success: false,
        response: [],
        message: "Error fetching itineraries for city",
      });
    }
  },
  getOneItinerary: async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await Itinerarios.findOne({ _id: id })
        .populate("activities")
        .populate("comments.userID", USER_POPULATE_FIELDS);
      res.json({ success: true, response: data });
    } catch (error) {
      next(error);
    }
  },
  subirItinerary: async (req, res, next) => {
    try {
      const {
        image,
        name,
        username,
        userimage,
        details,
        price,
        duration,
        hashtag,
        likes,
        comments,
        cityId,
      } = req.body;

      const respuesta = await new Itinerarios({
        image,
        name,
        username,
        userimage,
        details,
        price,
        duration,
        hashtag,
        likes: likes || [],
        comments: comments || [],
        cityId,
      }).save();

      res.json({ success: true, respuesta });
    } catch (error) {
      next(error);
    }
  },

  borrarItinerary: async (req, res, next) => {
    try {
      const id = req.params.id;
      const respuesta = await Itinerarios.findOneAndDelete({ _id: id });
      res.json({ success: true, respuesta });
    } catch (error) {
      next(error);
    }
  },
  modificarItinerary: async (req, res, next) => {
    try {
      const id = req.params.id;
      const itinerary = req.body;
      const respuesta = await Itinerarios.findOneAndUpdate(
        { _id: id },
        itinerary,
        { new: true }
      );
      res.json({ success: true, respuesta });
    } catch (error) {
      next(error);
    }
  },
  likeDislike: async (req, res) => {
    const id = req.params.id;
    const user = String(req.user?._id || req.user?.id || "");
    try {
      const itinerary = await Itinerarios.findOne({ _id: id });
      if (!itinerary) {
        return res.status(404).json({
          success: false,
          message: "Itinerary not found",
        });
      }

      const currentLikes = Array.isArray(itinerary.likes)
        ? itinerary.likes.map(String)
        : [];

      if (currentLikes.includes(user)) {
        const response = await Itinerarios.findOneAndUpdate(
          { _id: id },
          { $pull: { likes: user } },
          { new: true }
        );
        return res.json({
          success: true,
          response: response ? response.likes : [],
        });
      } else {
        const response = await Itinerarios.findOneAndUpdate(
          { _id: id },
          { $push: { likes: user } },
          { new: true }
        );
        return res.json({
          success: true,
          response: response ? response.likes : [],
        });
      }
    } catch (error) {
      console.error("[Itineraries] Error toggling like:", error.message);
      res.json({ success: false, response: error.message });
    }
  },
  prueba: async (req, res, next) => {
    try {
      const data = await Itinerarios.find();
      res.json({
        success: true,
        response: data,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = itineraryController;
