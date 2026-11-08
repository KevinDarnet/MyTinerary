const getInitialUser = () => {
  try {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (e) {
    // ignore storage parse errors
  }
  return null;
};

const initialState = {
  user: getInitialUser(),
  snackbar: { view: false, message: "", success: false },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "user":
      return {
        ...state,
        user: action.payload,
      };
    case "message":
      return {
        ...state,
        snackbar: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
