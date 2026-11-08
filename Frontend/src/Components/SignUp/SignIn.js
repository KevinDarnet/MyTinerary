import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link as LinkRouter, useNavigate } from "react-router-dom";
import userActions from "../Redux/actions/userActions";
import FacebookSignIn from "./FacebookSignIn";
import "./styleSign.css";

function SignIn(props) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (props.user) {
      navigate("/", { replace: true });
    }
  }, [props.user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const email = formElements.email ? formElements.email.value.trim() : "";
    const password = formElements.password ? formElements.password.value : "";

    const loggedUser = {
      email,
      password,
      from: "form-Signup",
    };
    const result = await props.signInUser(loggedUser);
    if (result && result.success) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="auth-page min-h-screen w-full bg-[#070b12] pb-20">
      <div className="auth-page__bg" />
      <div className="auth-page__overlay" />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <span className="auth-card__badge">
              <span className="material-icons" style={{ fontSize: "0.95rem" }}>
                flight_takeoff
              </span>
              <span>MyTinerary Account</span>
            </span>
            <h1 className="auth-card__title">Welcome Back</h1>
            <p className="auth-card__subtitle">
              Sign in to access your saved itineraries and join the travel
              community.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-field__label" htmlFor="signin-email">
                Email Address
              </label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">
                  mail_outline
                </span>
                <input
                  id="signin-email"
                  name="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="signin-password">
                Password
              </label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">
                  lock_outline
                </span>
                <input
                  id="signin-password"
                  name="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-pwd-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span
                    className="material-icons"
                    style={{ fontSize: "1.15rem" }}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              <span>Sign In</span>
              <span className="material-icons" style={{ fontSize: "1.1rem" }}>
                arrow_forward
              </span>
            </button>
          </form>

          <div className="auth-divider">or continue with</div>

          <FacebookSignIn />

          <div className="auth-switch">
            <span>Don't have an account?</span>
            <LinkRouter className="auth-switch__link" to="/signup">
              Sign Up
            </LinkRouter>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = {
  signInUser: userActions.signInUser,
  SignOutUser: userActions.SignOutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
