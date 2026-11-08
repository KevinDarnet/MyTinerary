import axios from "axios";

const API_URL =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1" &&
  (process.env.REACT_APP_API_URL || "").includes("localhost")
    ? ""
    : (process.env.REACT_APP_API_URL || "").replace(/\/api\/?$/, "");

const dataInicial = {
  cambio: false,
};

const MENSAJE_CARGADO = "fetchAddComments";

export default function comentarioReducer(state = dataInicial, action) {
  switch (action.type) {
    case MENSAJE_CARGADO:
      return {
        ...state,
        cambio: action.payload,
      };
    default:
      return state;
  }
}

export const cargarComentario =
  (comentario, unCambio) => async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/itineraries/comment`,
        { comentario },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: MENSAJE_CARGADO, payload: !unCambio });
      return res;
    } catch (error) {
      console.error("Error adding comment:", error);
      return null;
    }
  };

export const actualizarComentario =
  (comentario, unCambio) => async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/itineraries/comment/modify`,
        { comentario },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: MENSAJE_CARGADO, payload: !unCambio });
      return res;
    } catch (error) {
      console.error("Error updating comment:", error);
      return null;
    }
  };

export const eliminarComentario =
  (id, unCambio) => async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/itineraries/comment/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch({ type: MENSAJE_CARGADO, payload: !unCambio });
      return res;
    } catch (error) {
      console.error("Error deleting comment:", error);
      return null;
    }
  };
