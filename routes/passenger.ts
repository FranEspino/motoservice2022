import {Router} from 'express';
import { postPassenger, getPassanger,getPassengerID,
  searchPassengerPhone ,blockPassenger,activePassengerWev} from '../controllers/passenger';
import { check } from "express-validator";
import { validateFields } from "../middlewares/fieldvalidate";
import uploadImage from '../middlewares/imagemulter'
let multer = require('multer');
let formdata = multer();

const router = Router();
router.get(
    "/pasajero",
    getPassanger,
);
router.get(
    "/pasajero/:id_persona",
    getPassengerID
  );

  router.post(
    "/searchpassenger",
    [formdata.fields([])],
    searchPassengerPhone
  );


  router.post(
    "/pasajerobloqueado",
    [formdata.fields([])],
    blockPassenger
  );

  router.post(
    "/pasajeroactivadoweb",
    [formdata.fields([])],
    activePassengerWev
  );

router.post(
    "/pasajero",

    [  
        uploadImage,
        check("nombres", "Debe ingresar sus nombres.").not().isEmpty(),
        check("apellidos", "Debe ingresar sus apellidos.").not().isEmpty(),
        check("nmr_documento", "Debe ingresar su numero de documento.").not().isEmpty(),
        check("telefono", "Debe ingresar un número de contacto valido.").not().isEmpty(),
        validateFields
    ],
    postPassenger
)

export default router;