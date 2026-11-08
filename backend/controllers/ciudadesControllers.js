const Ciudades = require("../models/ciudades");

const normalizeCity = (doc) => {
  if (!doc) return doc;
  const plain = doc.toObject ? doc.toObject() : { ...doc };
  if (!plain.language && plain.lenguage) plain.language = plain.lenguage;
  if (!plain.lenguage && plain.language) plain.lenguage = plain.language;
  return plain;
};

const ciudadesControllers = {
  consultarCiudades: async (req, res) => {
    let ciudades = [];
    let error = null;
    try {
      const raw = await Ciudades.find();
      ciudades = Array.isArray(raw) ? raw.map(normalizeCity) : [];
    } catch (err) {
      error = err.message || "Error";
      console.error("[Cities] Error fetching cities:", err.message);
    }
    res.json({
      response: error ? "ERROR" : { ciudades },
      success: !error,
      error: error,
    });
  },
  cargarCiudad: async (req, res, next) => {
    try {
      const {
        city,
        name,
        country,
        coin,
        description,
        language,
        lenguage,
        image,
        flag,
      } = req.body;
      const lang = language || lenguage || "English";
      const respuesta = await new Ciudades({
        city: city || name,
        country,
        coin,
        description: description || "",
        language: lang,
        lenguage: lang,
        image,
        flag: flag || "",
      }).save();
      res.json({ success: true, respuesta: normalizeCity(respuesta) });
    } catch (error) {
      next(error);
    }
  },
  borrarCiudad: async (req, res, next) => {
    try {
      const id = req.params.id;
      const respuesta = await Ciudades.findOneAndDelete({ _id: id });
      res.json({
        success: true,
        respuesta: normalizeCity(respuesta),
        recontradatito: "citie morida",
      });
    } catch (error) {
      next(error);
    }
  },
  modificarCiudad: async (req, res, next) => {
    try {
      const id = req.params.id;
      const ciudad = req.body;
      const respuesta = await Ciudades.findOneAndUpdate({ _id: id }, ciudad, {
        new: true,
      });
      res.json({ success: true, respuesta: normalizeCity(respuesta) });
    } catch (error) {
      next(error);
    }
  },
  pedirCity: async (req, res, next) => {
    try {
      const id = req.params.id;
      const respuesta = await Ciudades.findOne({ _id: id });
      if (!respuesta) {
        return res.status(404).json({
          success: false,
          respuesta: null,
          message: "City not found",
        });
      }
      res.json({ success: true, respuesta: normalizeCity(respuesta) });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ciudadesControllers;
