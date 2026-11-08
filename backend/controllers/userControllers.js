const User = require("../models/usersModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const buildUserPayload = (userDoc, fromSource) => {
  const idStr = String(userDoc._id || userDoc.id || "");
  const fullName = userDoc.fullName || userDoc.name || "Traveler";
  const photoUrl = (
    userDoc.picture ||
    userDoc.photo ||
    userDoc.userPhoto ||
    userDoc.image ||
    userDoc.userimage ||
    ""
  ).trim();

  return {
    id: idStr,
    _id: idStr,
    fullName,
    name: fullName,
    email: userDoc.email,
    picture: photoUrl,
    photo: photoUrl,
    userPhoto: photoUrl,
    image: photoUrl,
    userimage: photoUrl,
    country: userDoc.country,
    from: fromSource || userDoc.from,
  };
};

const sendEmail = async (email, uniqueString) => {
  const verifyUrl = `${
    process.env.BACKEND_URL || "http://localhost:4000"
  }/api/verify/${uniqueString}`;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(
      `[Auth] Local mode (no SMTP configured). Verification URL for ${email}: ${verifyUrl}`
    );
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify your MyTinerary email",
      html: `
        <div>
          <h1 style="color:black">Welcome and thank you for registering on MyTinerary.</h1>
          <h2 style="color:black">Click <a style="color:blue" href="${verifyUrl}">here</a> to confirm your email.</h2>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("[Auth] Verification email sent to:", email);
  } catch (error) {
    console.warn("[Auth] Could not send verification email:", error.message);
  }
};

const usersControllers = {
  verifyEmail: async (req, res) => {
    try {
      const { uniqueString } = req.params;
      const user = await User.findOne({ uniqueString });
      if (user) {
        user.emailVerificado = true;
        await user.save();
        return res.redirect(
          process.env.FRONTEND_URL || "http://localhost:3000/"
        );
      } else {
        return res.json({
          success: false,
          response: "Your email could not be verified",
        });
      }
    } catch (error) {
      console.error("[Auth] Error verifying email:", error.message);
      return res.status(500).json({
        success: false,
        response: "Error verifying email",
      });
    }
  },

  signUpUsers: async (req, res) => {
    try {
      const {
        fullName,
        email,
        password,
        country,
        picture,
        photo,
        userPhoto,
        image,
        userimage,
      } = req.body.userData;

      const resolvedPicture = (
        picture ||
        photo ||
        userPhoto ||
        image ||
        userimage ||
        ""
      ).trim();

      const requireEmailVerification =
        process.env.REQUIRE_EMAIL_VERIFICATION === "true";

      const usuarioExiste = await User.findOne({ email });
      if (usuarioExiste) {
        return res.json({
          success: false,
          from: "signup",
          message:
            "An account with this email already exists. Please Sign In.",
        });
      }

      const contraseñaHasheada = bcryptjs.hashSync(password, 10);
      const nuevoUsuario = new User({
        fullName,
        email,
        password: [contraseñaHasheada],
        emailVerificado: !requireEmailVerification,
        country: Array.isArray(country) ? country : [country],
        picture: resolvedPicture,
        photo: resolvedPicture,
        uniqueString: crypto.randomBytes(15).toString("hex"),
        from: ["form-Signup"],
      });

      await nuevoUsuario.save();

      if (requireEmailVerification) {
        await sendEmail(email, nuevoUsuario.uniqueString);
        return res.json({
          success: true,
          from: "signup",
          user: buildUserPayload(nuevoUsuario),
          message:
            "We sent you an email to validate it, please check your inbox to complete Sign Up.",
        });
      } else {
        return res.json({
          success: true,
          from: "signup",
          user: buildUserPayload(nuevoUsuario),
          message: "Account created successfully! Please Sign In to continue.",
        });
      }
    } catch (error) {
      console.error("[Auth] Error in signUpUsers:", error.message);
      return res.json({
        success: false,
        message: "Something went wrong, please try again in a few minutes",
      });
    }
  },

  signInUser: async (req, res) => {
    try {
      const loggedUser = req.body?.loggedUser || {};
      const email =
        typeof loggedUser.email === "string"
          ? loggedUser.email.trim().toLowerCase()
          : "";
      const password = loggedUser.password || "";

      if (!email || !password) {
        return res.json({
          success: false,
          message: "Please enter both email and password",
        });
      }

      const usuarioExiste = await User.findOne({ email });

      if (!usuarioExiste) {
        return res.json({
          success: false,
          message: "No account found with this email. Please Sign Up first.",
        });
      }

      const requireEmailVerification =
        process.env.REQUIRE_EMAIL_VERIFICATION === "true";

      if (requireEmailVerification && !usuarioExiste.emailVerificado) {
        return res.json({
          success: false,
          message: "Please verify your email address before signing in.",
        });
      }

      const contraseñaCoincide = usuarioExiste.password.filter((pass) =>
        bcryptjs.compareSync(password, pass)
      );

      if (contraseñaCoincide.length > 0) {
        const secretKey = process.env.SECRET_KEY || "MyPassword";
        const userData = buildUserPayload(usuarioExiste);
        const token = jwt.sign({ ...userData }, secretKey, {
          expiresIn: 60 * 60 * 24,
        });

        return res.json({
          success: true,
          response: { token, userData, user: userData },
          user: userData,
          message: "Welcome back, " + userData.fullName,
        });
      } else {
        return res.json({
          success: false,
          message: "Invalid email or password",
        });
      }
    } catch (error) {
      console.error("[Auth] Error in signInUser:", error.message);
      return res.json({
        success: false,
        message: "Something went wrong, please try again in a few minutes",
      });
    }
  },

  signOutUser: async (req, res) => {
    try {
      const email = req.body?.closeuser;
      if (email) {
        const user = await User.findOne({ email });
        if (user) {
          await user.save();
        }
      }
      return res.json({
        success: true,
        message: "Signed out successfully",
      });
    } catch (error) {
      console.error("[Auth] Error in signOutUser:", error.message);
      return res.json({
        success: false,
        message: "Error closing session",
      });
    }
  },

  verificarToken: (req, res) => {
    if (req.user && !req.err) {
      const userData = buildUserPayload(req.user, "token");
      return res.json({
        success: true,
        response: userData,
        user: userData,
        message: "Welcome back, " + userData.fullName,
      });
    } else {
      return res.json({
        success: false,
        message: "Session expired, please Sign In again",
      });
    }
  },
};

module.exports = usersControllers;
