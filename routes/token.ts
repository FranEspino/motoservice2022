import { Router } from "express";
import {
  putToken,
  getTokenDrivers,
  pushNotification,
  getDriverEmergency,
  driverStateEmergency,
} from "../controllers/token";
let multer = require("multer");
let formdata = multer();

const router = Router();

router.get("/token/drivers", getTokenDrivers);
router.post("/token", [formdata.fields([])], putToken);
router.post("/driveremergency", [formdata.fields([])], driverStateEmergency);
router.get("/getdriveremergency", getDriverEmergency);
router.post("/pushNotification", [formdata.fields([])], pushNotification);


export default router;
