const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const {
  registrar,
  login,
  verificar,
  leerDataToken,
} = require("../controllers/cognitoController");
const router = Router();

router.post(
  "/registrar",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check("direccion", "La direccion es obligatoria").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      next();
    },
  ],
  registrar
);
router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      next();
    },
  ],

  login
);
router.post(
  "/verificar",
  [
    check("codigo", "El codigo es obligatorio").not().isEmpty(),
    check("codigo", "El codigo debe ser un numero").isNumeric(),
    check("email", "El email es obligatorio").isEmail(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      next();
    },
  ],

  verificar
);

router.post("/decode", leerDataToken);

module.exports = router;