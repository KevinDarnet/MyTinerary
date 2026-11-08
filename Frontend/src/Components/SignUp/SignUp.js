import React, { useState } from "react";
import { connect } from "react-redux";
import { Link as LinkRouter, useNavigate } from "react-router-dom";
import userActions from "../Redux/actions/userActions";
import FacebookSignUp from "./FacebookSignUp";
import "./styleSign.css";

const COUNTRIES = [
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "Chile",
  "Colombia",
  "France",
  "Germany",
  "Italy",
  "Japan",
  "Mexico",
  "Paraguay",
  "Peru",
  "Spain",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Venezuela",
  "Other",
];

function SignUp(props) {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("Argentina");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const fullName = formElements.fullName
      ? formElements.fullName.value.trim()
      : "";
    const email = formElements.email ? formElements.email.value.trim() : "";
    const password = formElements.password ? formElements.password.value : "";
    const rawPicture = formElements.Picture
      ? formElements.Picture.value.trim()
      : "";

    const userData = {
      fullName,
      email,
      password,
      country: selectedCountry || "Argentina",
      picture: rawPicture,
      photo: rawPicture,
      from: "form-Signup",
    };

    const result = await props.signUpUser(userData);
    if (result && result.success) {
      navigate("/login", { replace: true });
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
                public
              </span>
              <span>Join the Community</span>
            </span>
            <h1 className="auth-card__title">Create an Account</h1>
            <p className="auth-card__subtitle">
              Start your journey and share insider travel experiences around the
              world.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-field__label" htmlFor="signup-fullname">
                Full Name
              </label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">
                  person_outline
                </span>
                <input
                  id="signup-fullname"
                  name="fullName"
                  className="auth-input"
                  placeholder="John Doe"
                  type="text"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="signup-email">
                Email Address
              </label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">
                  mail_outline
                </span>
                <input
                  id="signup-email"
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
              <label className="auth-field__label" htmlFor="signup-password">
                Password
              </label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">
                  lock_outline
                </span>
                <input
                  id="signup-password"
                  name="password"
                  className="auth-input"
                  placeholder="At least 8 alphanumeric characters"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
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

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="signup-country">
                Country
              </label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">public</span>
                <select
                  id="signup-country"
                  name="country"
                  className="auth-select"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  aria-label="Select your country"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <span className="material-icons auth-select-chevron">
                  expand_more
                </span>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-field__label" htmlFor="signup-picture">
                Profile Photo URL{" "}
                <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
                  (Optional)
                </span>
              </label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">
                  photo_camera
                </span>
                <input
                  id="signup-picture"
                  name="Picture"
                  className="auth-input"
                  placeholder="https://example.com/avatar.jpg"
                  type="url"
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              <span>Create Account</span>
              <span className="material-icons" style={{ fontSize: "1.1rem" }}>
                arrow_forward
              </span>
            </button>
          </form>

          <div className="auth-divider">or sign up with</div>

          <FacebookSignUp country={selectedCountry} />

          <div className="auth-switch">
            <span>Already have an account?</span>
            <LinkRouter className="auth-switch__link" to="/login">
              Sign In
            </LinkRouter>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  signUpUser: userActions.signUpUser,
};

const mapStateToProps = (state) => ({
  message: state.userReducer.message,
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
