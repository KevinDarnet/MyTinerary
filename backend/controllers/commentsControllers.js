const Itineraries = require("../models/itineraries");

const sanitizeComment = (text) =>
  typeof text === "string" ? text.replace(/<[^>]*>?/gm, "").trim() : "";

const USER_POPULATE_FIELDS =
  "fullName name username picture photo userPhoto image userimage email";

const commentsControllers = {
  addComment: async (req, res) => {
    try {
      const comentarioObj = req.body?.comentario || {};
      const itineraryID = comentarioObj.itineraryID;
      const comments = sanitizeComment(comentarioObj.comments);
      const userID = req.user?._id || req.user?.id;
      const userName = (
        req.user?.fullName ||
        req.user?.name ||
        req.user?.username ||
        ""
      ).trim();
      const userPhoto = (
        req.user?.photo ||
        req.user?.picture ||
        req.user?.userimage ||
        req.user?.userPhoto ||
        req.user?.image ||
        ""
      ).trim();

      if (!itineraryID || !comments) {
        return res.status(400).json({
          success: false,
          message: "Comment cannot be empty",
        });
      }

      const nuevoComment = await Itineraries.findOneAndUpdate(
        { _id: itineraryID },
        {
          $push: {
            comments: {
              comment: comments,
              userID: userID,
              userName: userName,
              userPhoto: userPhoto,
            },
          },
        },
        { new: true }
      ).populate("comments.userID", USER_POPULATE_FIELDS);

      res.json({
        success: true,
        response: { nuevoComment },
        message: "Thank you for leaving a comment",
      });
    } catch (error) {
      console.error("[Comments] Error adding comment:", error.message);
      res.json({
        success: false,
        message: "Something went wrong, please try again in a few minutes",
      });
    }
  },

  modifyComment: async (req, res) => {
    try {
      const comentarioObj = req.body?.comentario || {};
      const _id = comentarioObj._id;
      const comments = sanitizeComment(comentarioObj.comments);

      const modifyComment = await Itineraries.findOneAndUpdate(
        { "comments._id": _id },
        { $set: { "comments.$.comment": comments } },
        { new: true }
      ).populate("comments.userID", USER_POPULATE_FIELDS);

      res.json({
        success: true,
        response: { modifyComment },
        message: "Your comment has been updated",
      });
    } catch (error) {
      console.error("[Comments] Error modifying comment:", error.message);
      res.json({
        success: false,
        message: "Something went wrong, please try again",
      });
    }
  },

  deleteComment: async (req, res) => {
    const id = req.params.id;
    try {
      const deleteComment = await Itineraries.findOneAndUpdate(
        { "comments._id": id },
        {
          $pull: {
            comments: {
              _id: id,
            },
          },
        },
        { new: true }
      ).populate("comments.userID", USER_POPULATE_FIELDS);

      res.json({
        success: true,
        response: { deleteComment },
        message: "Comment deleted",
      });
    } catch (error) {
      console.error("[Comments] Error deleting comment:", error.message);
      res.json({
        success: false,
        message: "Something went wrong, please try again in a few minutes",
      });
    }
  },
};

module.exports = commentsControllers;
