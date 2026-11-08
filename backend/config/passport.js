const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/usersModel");

module.exports = passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY || "MyPassword",
    },
    (jwt_payload, done) => {
      User.findOne({ _id: jwt_payload.id })
        .then((user) => {
          if (user) {
            if (!user.id && user._id) {
              user.id = String(user._id);
            }
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          console.error("[Passport] JWT verification error:", err.message);
          return done(err, false);
        });
    }
  )
);
