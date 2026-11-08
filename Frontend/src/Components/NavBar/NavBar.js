import React, { useState, useEffect, useRef } from "react";
import { Link as LinkRouter, useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Logomytinerary from "../Assests/Logomytinerary.png";
import userActions from "../Redux/actions/userActions";
import UserAvatar from "../Common/UserAvatar";
import "./NavBar.css";

function ResponsiveAppBar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const pathname = location.pathname;
  const isHomeActive = pathname === "/" || pathname === "/Home";
  const isCitiesActive =
    pathname.toLowerCase().startsWith("/cities") ||
    pathname.toLowerCase().startsWith("/details");

  const userName =
    props.user?.fullName || props.user?.name || props.user?.username || "User";
  const userPhoto = (
    props.user?.photo ||
    props.user?.picture ||
    props.user?.userPhoto ||
    props.user?.image ||
    props.user?.userimage ||
    ""
  ).trim();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMobileDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    setMenuOpen(false);
    setMobileDrawerOpen(false);
    await props.SignOutUser(props.user?.email);
    navigate("/login", { replace: true });
  }

  return (
    <header className={`mytinerary-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="mytinerary-header__inner">
        {/* Left: Brand Logo & Typography */}
        <LinkRouter to="/" className="mytinerary-header__brand">
          <img
            className="mytinerary-header__logo-img"
            src={Logomytinerary}
            alt="MyTinerary"
          />
          <div className="mytinerary-header__brand-text">
            <span className="mytinerary-header__brand-name">MyTinerary</span>
            <span className="mytinerary-header__brand-tagline">
              Insider Travel
            </span>
          </div>
        </LinkRouter>

        {/* Center: Navigation Links with Active Indicator */}
        <nav className="mytinerary-header__nav" aria-label="Main Navigation">
          <LinkRouter
            to="/"
            className={`mytinerary-header__nav-link ${
              isHomeActive ? "is-active" : ""
            }`}
          >
            {isHomeActive && <span className="mytinerary-header__nav-dot" />}
            <span>Home</span>
          </LinkRouter>

          <LinkRouter
            to="/Cities"
            className={`mytinerary-header__nav-link ${
              isCitiesActive ? "is-active" : ""
            }`}
          >
            {isCitiesActive && <span className="mytinerary-header__nav-dot" />}
            <span>Cities</span>
          </LinkRouter>
        </nav>

        {/* Right: User Menu / Avatar */}
        <div className="mytinerary-header__user" ref={dropdownRef}>
          {props.user ? (
            <button
              type="button"
              className="mytinerary-header__profile-btn"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-label="User menu"
            >
              <UserAvatar src={userPhoto} name={userName} size={38} />

              <span className="mytinerary-header__username">{userName}</span>

              <span
                className="material-icons mytinerary-header__chevron"
                style={{
                  transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                expand_more
              </span>
            </button>
          ) : (
            <>
              <div className="mytinerary-header__auth-links">
                <LinkRouter
                  to="/login"
                  className={`mytinerary-header__btn-login ${
                    pathname === "/login" || pathname === "/signin"
                      ? "is-active"
                      : ""
                  }`}
                >
                  Sign In
                </LinkRouter>
                <LinkRouter
                  to="/signup"
                  className="mytinerary-header__btn-signup"
                >
                  Sign Up
                </LinkRouter>
              </div>
              <button
                type="button"
                className="mytinerary-header__profile-btn"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-label="Account options"
              >
                <span className="mytinerary-header__avatar-box">
                  <span
                    className="material-icons"
                    style={{ fontSize: "1.15rem", color: "#fff" }}
                  >
                    person
                  </span>
                </span>
              </button>
            </>
          )}

          {menuOpen && (
            <div className="mytinerary-header__dropdown" role="menu">
              {props.user ? (
                <>
                  <div className="mytinerary-header__dropdown-user">
                    <UserAvatar src={userPhoto} name={userName} size={38} />
                    <div className="mytinerary-header__dropdown-meta">
                      <span className="mytinerary-header__dropdown-name">
                        {userName}
                      </span>
                      {props.user.email && (
                        <span className="mytinerary-header__dropdown-email">
                          {props.user.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <LinkRouter
                    to="/"
                    className="mytinerary-header__dropdown-item"
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: "1.1rem" }}
                    >
                      home
                    </span>
                    <span>Home</span>
                  </LinkRouter>
                  <LinkRouter
                    to="/Cities"
                    className="mytinerary-header__dropdown-item"
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: "1.1rem" }}
                    >
                      explore
                    </span>
                    <span>Cities</span>
                  </LinkRouter>
                  <button
                    type="button"
                    className="mytinerary-header__dropdown-item is-danger"
                    onClick={handleSignOut}
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: "1.1rem" }}
                    >
                      logout
                    </span>
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <LinkRouter
                    to="/login"
                    className="mytinerary-header__dropdown-item"
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: "1.1rem" }}
                    >
                      login
                    </span>
                    <span>Sign In</span>
                  </LinkRouter>
                  <LinkRouter
                    to="/signup"
                    className="mytinerary-header__dropdown-item"
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: "1.1rem" }}
                    >
                      person_add
                    </span>
                    <span>Sign Up</span>
                  </LinkRouter>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="mytinerary-header__hamburger"
          onClick={() => setMobileDrawerOpen((prev) => !prev)}
          aria-label={mobileDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileDrawerOpen}
        >
          <span className="material-icons">
            {mobileDrawerOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop & Sheet (bg-[#090a0f]/95 backdrop-blur-xl) */}
      {mobileDrawerOpen && (
        <div
          className="mytinerary-mobile-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      <aside
        className={`mytinerary-mobile-drawer ${
          mobileDrawerOpen ? "is-open" : ""
        }`}
        aria-hidden={!mobileDrawerOpen}
      >
        <div className="mytinerary-mobile-drawer__top">
          <LinkRouter
            to="/"
            className="mytinerary-header__brand"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <img
              className="mytinerary-header__logo-img"
              src={Logomytinerary}
              alt="MyTinerary"
            />
            <span className="mytinerary-header__brand-name">MyTinerary</span>
          </LinkRouter>
          <button
            type="button"
            className="mytinerary-mobile-drawer__close"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close menu"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* User Card inside Mobile Drawer */}
        <div className="mytinerary-mobile-drawer__user-section">
          {props.user ? (
            <div className="mytinerary-mobile-drawer__user-card">
              <UserAvatar src={userPhoto} name={userName} size={48} />
              <div className="mytinerary-mobile-drawer__user-info">
                <span className="mytinerary-mobile-drawer__user-name">
                  {userName}
                </span>
                {props.user.email && (
                  <span className="mytinerary-mobile-drawer__user-email">
                    {props.user.email}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="mytinerary-mobile-drawer__guest-card">
              <span className="mytinerary-mobile-drawer__guest-title">
                Welcome Traveler
              </span>
              <p className="mytinerary-mobile-drawer__guest-sub">
                Sign in to save favorite destinations and share insider comments.
              </p>
              <div className="mytinerary-mobile-drawer__auth-actions">
                <LinkRouter
                  to="/login"
                  className="mytinerary-mobile-drawer__btn-login"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <span className="material-icons">login</span>
                  <span>Sign In</span>
                </LinkRouter>
                <LinkRouter
                  to="/signup"
                  className="mytinerary-mobile-drawer__btn-signup"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <span className="material-icons">person_add</span>
                  <span>Sign Up</span>
                </LinkRouter>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links inside Mobile Drawer */}
        <nav className="mytinerary-mobile-drawer__nav">
          <LinkRouter
            to="/"
            className={`mytinerary-mobile-drawer__nav-link ${
              isHomeActive ? "is-active" : ""
            }`}
            onClick={() => setMobileDrawerOpen(false)}
          >
            <span className="material-icons">home</span>
            <span>Home</span>
          </LinkRouter>

          <LinkRouter
            to="/Cities"
            className={`mytinerary-mobile-drawer__nav-link ${
              isCitiesActive ? "is-active" : ""
            }`}
            onClick={() => setMobileDrawerOpen(false)}
          >
            <span className="material-icons">travel_explore</span>
            <span>Cities</span>
          </LinkRouter>
        </nav>

        {/* Bottom Actions inside Mobile Drawer */}
        {props.user && (
          <div className="mytinerary-mobile-drawer__footer">
            <button
              type="button"
              className="mytinerary-mobile-drawer__signout-btn"
              onClick={handleSignOut}
            >
              <span className="material-icons">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>
    </header>
  );
}

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = {
  SignOutUser: userActions.SignOutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveAppBar);
