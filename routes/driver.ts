import {Router} from 'express';
import { getDriver,postDriver,getDriverID 
  ,getCurrentDriver,postUpdateDriver,getCurrentLocations,
  setStateActive,setStateInactive,blockDriver,updateDriverWithPhoto,
  updateDriverNotPhoto,activeDriverWeb,searchDriverPhone,getVehiculeDriver,updateVehiculeDriver} from '../controllers/driver';
import uploadImage from '../middlewares/imagemulter'
import { validateFields } from "../middlewares/fieldvalidate";
import { check } from "express-validator";
const fs = require("fs");
const path = require("path");
let multer = require('multer');
let formdata = multer();
const router = Router();
router.get(
  "/conductor",
  getDriver

);

router.post(
  "/updateinfoconductorfoto",
  multer({}).single('avatar'), function(req, res) {
      req.body.avatar = saveImage(req.file);
      updateDriverWithPhoto(req,res)
    }
)
router.post(
  "/updateinfoconductornofoto",
  [formdata.fields([])],
  updateDriverNotPhoto
)
router.get(
  "/getvehicledriver/:id_conductor",
  getVehiculeDriver
)

router.post(
  "/updatevehiculedriver",
  [formdata.fields([])],
  updateVehiculeDriver
)
router.get(
  "/conductor/:id_persona",
  getDriverID
);


router.get(
  "/conductornow",
  getCurrentLocations
)

router.get(
  "/conductornow/:id_conductor",
  getCurrentDriver
);

router.post(
  "/conductornow",
  [formdata.fields([])],
  postUpdateDriver
);

router.post(
  "/conductoractivo",
  [formdata.fields([])],
  setStateActive
);
router.post(
  "/conductorinactivo",
  [formdata.fields([])],
  setStateInactive
);

router.post(
  "/conductorbloqueado",
  [formdata.fields([])],
  blockDriver
);


router.post(
  "/conductoractivadoweb",
  [formdata.fields([])],
  activeDriverWeb
);

router.post(
  "/searchdriver",
  [formdata.fields([])],
  searchDriverPhone
);

router.post(
  "/conductor",
  [  
      uploadImage,
      check("nombres", "Debe ingresar sus nombres.").not().isEmpty(),
      check("apellidos", "Debe ingresar sus apellidos.").not().isEmpty(),
      check("nmr_documento", "Debe ingresar el numero de documento.").not().isEmpty(),
      check("telefono", "Debe ingresar un número de contacto valido.").not().isEmpty(),
      validateFields
  ],
  postDriver
)

function saveImage  (data:any) {
  const {originalname, buffer}  = data
  console.log(originalname, buffer)
  const fileName = originalname.replace(/\s/g, "");
  let finalName = Date.now() + "-image-" + fileName ;
  fs.writeFile(path.join(__dirname, "../public/images/" + finalName),  buffer, (error:any) => {})
  return finalName
}

export default router;