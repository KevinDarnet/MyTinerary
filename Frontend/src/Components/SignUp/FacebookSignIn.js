import React from "react";
import FacebookLogin from "react-facebook-login";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import userActions from "../Redux/actions/userActions";
import "./styleSign.css";

function FacebookSignIn(props) {
  const navigate = useNavigate();

  const responseFacebook = async (res) => {
    if (!res || !res.email) return;
    const loggedUser = {
      email: res.email,
      password: res.id,
      from: "facebook",
    };
    const result = await props.signInUser(loggedUser);
    if (result && result.success) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="auth-social-wrap">
      <FacebookLogin
        cssClass="buttonsocial my-facebook-button-class"
        icon="fa-facebook"
        textButton=" Continue with Facebook"
        appId="3004491136510685"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
      />
    </div>
  );
}

const mapDispatchToProps = {
  signInUser: userActions.signInUser,
};

export default connect(null, mapDispatchToProps)(FacebookSignIn);
