import axios from "axios";
import { API_URL } from "../../../config/api";

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
