import axios from "axios";
import { ITINERARIES_GET } from "./types";
import { API_BASE_URL } from "../../../config/api";

const itinerariesActions = {
  itinerarioPorCiudad: (id) => {
    return async (dispatch) => {
      try {
        const res = await axios.get(`${API_BASE_URL}/cityItineraries?cityId=${id}`);
        dispatch({ type: ITINERARIES_GET, payload: res.data?.response || [] });
      } catch (error) {
        console.error("Error fetching itineraries by city:", error);
        dispatch({ type: ITINERARIES_GET, payload: [] });
      }
    };
  },
  getOneItinerary: (id) => {
    return async (dispatch) => {
      try {
        const res = await axios.get(`${API_BASE_URL}/itineraries/${id}`);
        dispatch({ type: "oneItineraryAndActivities", payload: res });
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };
  },
  likeDislike: (id) => {
    const token = localStorage.getItem("token");
    return async () => {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/like/${id}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        return {
          success: true,
          response: response,
        };
      } catch (error) {
        console.error("Error toggling like:", error);
        return {
          success: false,
          response: null,
        };
      }
    };
  },
};

export default itinerariesActions;
