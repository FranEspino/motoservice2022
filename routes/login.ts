import { Router } from "express";
import { getLogin, loginSystem } from "../controllers/login";
import { check } from "express-validator";
let multer = require("multer");
let upload = multer();

const router = Router();
router.post(
  "/login",

  [
    upload.fields([
      check("usuario", "Debe ingresar el usuario.").not().isEmpty(),
      check("clave", "Debe ingresar la contraseña.").not().isEmpty(),
    ]),
  ],

  getLogin
);

router.post(
  "/loginsystem",

  [
    upload.fields([
      check("usuario", "Debe ingresar el usuario.").not().isEmpty(),
      check("clave", "Debe ingresar la contraseña.").not().isEmpty(),
    ]),
  ],

  loginSystem
);

export default router;
