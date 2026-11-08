import axios from "axios";
import { API_URL } from "../../../config/api";

const normalizeUserObject = (raw) => {
  if (!raw || typeof raw !== "object") return null;
  const fullName = raw.fullName || raw.name || "Traveler";
  const photoUrl = (
    raw.photo ||
    raw.picture ||
    raw.userPhoto ||
    raw.image ||
    raw.userimage ||
    ""
  ).trim();

  return {
    ...raw,
    id: String(raw.id || raw._id || ""),
    _id: String(raw._id || raw.id || ""),
    fullName,
    name: fullName,
    picture: photoUrl,
    photo: photoUrl,
    userPhoto: photoUrl,
    image: photoUrl,
    userimage: photoUrl,
  };
};

const persistUserSession = (token, userObj) => {
  try {
    if (token) {
      localStorage.setItem("token", token);
    }
    if (userObj) {
      localStorage.setItem("user", JSON.stringify(userObj));
    }
  } catch (e) {
    // ignore storage errors
  }
};

const clearUserSession = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (e) {
    // ignore storage errors
  }
};

const userActions = {
  signUpUser: (userData) => {
    return async (dispatch) => {
      try {
        const res = await axios.post(`${API_URL}/api/auth/signup`, {
          userData,
        });
        dispatch({
          type: "message",
          payload: {
            view: true,
            message: res.data.message,
            success: res.data.success,
          },
        });
        return {
          success: Boolean(res.data?.success),
          data: res.data,
        };
      } catch (error) {
        console.error("Error in signUpUser:", error);
        dispatch({
          type: "message",
          payload: {
            view: true,
            message: "Unable to connect to server",
            success: false,
          },
        });
        return {
          success: false,
          data: null,
        };
      }
    };
  },

  signInUser: (loggedUser) => {
    return async (dispatch) => {
      try {
        const user = await axios.post(`${API_URL}/api/auth/login`, {
          loggedUser,
        });
        if (user.data.success) {
          const rawUserData =
            user.data?.response?.userData ||
            user.data?.response?.user ||
            user.data?.user;
          const normalizedUser = normalizeUserObject(rawUserData);
          persistUserSession(user.data?.response?.token, normalizedUser);
          dispatch({ type: "user", payload: normalizedUser });
        }
        dispatch({
          type: "message",
          payload: {
            view: true,
            message: user.data.message,
            success: user.data.success,
          },
        });
        return {
          success: Boolean(user.data?.success),
          data: user.data,
        };
      } catch (error) {
        console.error("Error in signInUser:", error);
        dispatch({
          type: "message",
          payload: {
            view: true,
            message: "Unable to connect to server",
            success: false,
          },
        });
        return {
          success: false,
          data: null,
        };
      }
    };
  },

  SignOutUser: (closeuser) => {
    return async (dispatch) => {
      try {
        if (closeuser) {
          await axios.post(`${API_URL}/api/auth/signout`, { closeuser });
        }
      } catch (error) {
        // Ignore network error on signout cleanup
      }
      clearUserSession();
      dispatch({ type: "user", payload: null });
    };
  },

  verificarToken: (token) => {
    return async (dispatch) => {
      try {
        const user = await axios.get(`${API_URL}/api/auth/signInToken`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (user.data.success) {
          const rawUser = user.data.response || user.data.user;
          const normalizedUser = normalizeUserObject(rawUser);
          persistUserSession(token, normalizedUser);
          dispatch({ type: "user", payload: normalizedUser });
          dispatch({
            type: "message",
            payload: {
              view: true,
              message: user.data.message,
              success: user.data.success,
            },
          });
        } else {
          clearUserSession();
          dispatch({ type: "user", payload: null });
        }
      } catch (error) {
        clearUserSession();
        dispatch({ type: "user", payload: null });
      }
    };
  },
};

export default userActions;
