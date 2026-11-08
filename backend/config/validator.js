const joi = require("joi");

const stripHtml = (val) =>
  typeof val === "string" ? val.replace(/<[^>]*>?/gm, "").trim() : val;

const validator = (req, res, next) => {
  if (!req.body || !req.body.userData || typeof req.body.userData !== "object") {
    return res.status(400).json({
      success: false,
      from: "validator",
      message: [{ message: "User data is required" }],
    });
  }

  // Basic input sanitization & normalize photo/picture field
  const raw = req.body.userData;
  const rawPhoto =
    raw.picture || raw.photo || raw.userPhoto || raw.image || raw.userimage || "";
  const sanitizedPhoto = typeof rawPhoto === "string" ? rawPhoto.trim() : "";

  req.body.userData = {
    ...raw,
    fullName: stripHtml(raw.fullName),
    email:
      typeof raw.email === "string" ? raw.email.trim().toLowerCase() : raw.email,
    country: stripHtml(raw.country),
    picture: sanitizedPhoto,
    photo: sanitizedPhoto,
    from: stripHtml(raw.from),
  };

  const schema = joi.object({
    fullName: joi
      .string()
      .max(50)
      .min(3)
      .trim()
      .pattern(new RegExp("[a-zA-Z]"))
      .required()
      .messages({
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 3 characters long",
        "string.max": "Full name must be at most 50 characters long",
        "string.pattern.base": "Full name must contain letters",
      }),

    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email address is required",
        "string.email": "Please enter a valid email address",
      }),
    password: joi
      .string()
      .pattern(new RegExp("[a-zA-Z0-9]"))
      .required()
      .trim()
      .min(8)
      .max(30)
      .messages({
        "string.empty": "Password is required",
        "string.min":
          "Password must be at least 8 characters long and contain letters and numbers",
        "string.pattern.base":
          "Password must be alphanumeric and contain letters and numbers",
      }),
    country: joi.string().required().messages({
      "string.empty": "Please select your country",
    }),
    picture: joi.string().allow("").optional(),
    photo: joi.string().allow("").optional(),
    from: joi.string(),
  });

  const validation = schema.validate(req.body.userData, { abortEarly: false });

  if (validation.error) {
    return res.json({
      success: false,
      from: "validator",
      message: validation.error.details,
    });
  }

  next();
};

module.exports = validator;
