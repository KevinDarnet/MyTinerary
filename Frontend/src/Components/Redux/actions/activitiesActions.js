import axios from "axios";

const API_URL =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1" &&
  (process.env.REACT_APP_API_URL || "").includes("localhost")
    ? ""
    : (process.env.REACT_APP_API_URL || "").replace(/\/api\/?$/, "");

const activitiesActions = {
  activities: () => {
    return async (dispatch) => {
      try {
        const res = await axios.get(`${API_URL}/api/activities`);
        dispatch({ type: "fetchActivities", payload: res.data.response || [] });
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
  },
  findOneActivityPerItinerary: (id) => {
    return async () => {
      try {
        const res = await axios.get(`${API_URL}/api/itineraryActivities/${id}`);
        return { success: true, response: res.data.response || [] };
      } catch (error) {
        console.error("Error fetching itinerary activities:", error);
        return { success: false, response: [] };
      }
    };
  },
};

export default activitiesActions;
