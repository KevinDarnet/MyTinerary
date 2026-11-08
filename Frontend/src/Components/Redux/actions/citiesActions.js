import axios from "axios";

const API_URL =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1" &&
  (process.env.REACT_APP_API_URL || "").includes("localhost")
    ? ""
    : (process.env.REACT_APP_API_URL || "").replace(/\/api\/?$/, "");

const citiesActions = {
  fetchearCities: () => {
    return async (dispatch) => {
      try {
        const res = await axios.get(`${API_URL}/api/allcities`);
        const ciudades = res.data?.response?.ciudades || [];
        dispatch({ type: "fetch", send: ciudades });
      } catch (err) {
        console.error("Error fetching cities:", err);
        dispatch({ type: "fetch", send: [] });
      }
    };
  },
  findOneCity: (id) => {
    return async (dispatch) => {
      try {
        const res = await axios.get(`${API_URL}/api/allcities/${id}`);
        dispatch({ type: "fetchOne", send: res.data?.respuesta || {} });
      } catch (err) {
        console.error("Error fetching city details:", err);
        dispatch({ type: "fetchOne", send: {} });
      }
    };
  },
  deleteCities: (id) => {
    return async (dispatch) => {
      try {
        const res = await axios.delete(`${API_URL}/api/allcities/${id}`);
        dispatch({ type: "delete", send: res.data?.response?.ciudades || [] });
      } catch (err) {
        console.error("Error deleting city:", err);
      }
    };
  },
  filterCity: (cities, value) => {
    return (dispatch) => {
      dispatch({ type: "filtro", send: { cities: cities || [], value: value || "" } });
    };
  },
  chargeCities: (name, ciudad) => {
    return async (dispatch) => {
      try {
        const res = await axios.post(`${API_URL}/api/allcities`, {
          name,
          ciudad,
        });
        dispatch({
          type: "chargeCities",
          send: res.data?.response?.ciudades || res.data?.respuesta,
        });
      } catch (err) {
        console.error("Error creating city:", err);
      }
    };
  },
};

export default citiesActions;
