import "./Components/Styles/App.css";
import NavBar from "./Components/NavBar/NavBar";
import Home from "./Components/Home/Home";
import Cities from "./Components/Cities/Cities";
import ScrollToTop from "./Components/Scrolltotop/Scrolltotop";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DetailsCityId from "./Components/DetailsCityId/DetailsCityId";
import LogIn from "./Components/SignUp/SignIn";
import SignUp from "./Components/SignUp/SignUp";
import { useEffect } from "react";
import { connect } from "react-redux";
import userActions from "./Components/Redux/actions/userActions";
import Snackbar from "./Components/SignUp/Snackbar";

function App(props) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      props.VerificarToken(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <NavBar />
      <Snackbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Cities" element={<Cities />} />
        <Route path="/Details/:id" element={<DetailsCityId />} />
        <Route
          path="/login"
          element={props.user ? <Navigate to="/" replace /> : <LogIn />}
        />
        <Route
          path="/signin"
          element={props.user ? <Navigate to="/" replace /> : <LogIn />}
        />
        <Route
          path="/signup"
          element={props.user ? <Navigate to="/" replace /> : <SignUp />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

const mapDispatchToProps = {
  VerificarToken: userActions.verificarToken,
  SignOutUser: userActions.SignOutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
