import React from "react";
import FacebookLogin from "react-facebook-login";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import userActions from "../Redux/actions/userActions";
import "./styleSign.css";

function FacebookSignUp(props) {
  const navigate = useNavigate();

  const responseFacebook = async (res) => {
    if (!res || !res.email) return;
    const photoUrl = res.picture?.data?.url || "";
    const userData = {
      fullName: res.name,
      email: res.email,
      password: res.id,
      picture: photoUrl,
      photo: photoUrl,
      country: props.country || "Argentina",
      from: "facebook",
    };
    const result = await props.signUpUser(userData);
    if (result && result.success) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="auth-social-wrap">
      <FacebookLogin
        cssClass="buttonsocial my-facebook-button-class"
        icon="fa-facebook"
        textButton=" Sign Up with Facebook"
        appId="3004491136510685"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
      />
    </div>
  );
}

const mapDispatchToProps = {
  signUpUser: userActions.signUpUser,
};

export default connect(null, mapDispatchToProps)(FacebookSignUp);
