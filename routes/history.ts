import { Router } from "express";
import {
  getHistoryPassenger,
  getHistoryDriver,
  getHistoryCustomPassenger,
  getHistoryCustomDriver,
  getHistoryWeb,
  getHistoryCustomWeb,
  insertFrecuentPlace,
  getFrecuentPlace,
  deletePlace,
} from "../controllers/history";
let multer = require("multer");
let formdata = multer();
const router = Router();

router.post("/gethistorypassenger", [formdata.fields([])], getHistoryPassenger);
router.post("/gethistorydriver", [formdata.fields([])], getHistoryDriver);
router.post("/gethistorycustomdriver", [formdata.fields([])], getHistoryCustomDriver);
router.post("/gethistorycustompassenger", [formdata.fields([])], getHistoryCustomPassenger);
router.post("/gethistoryweb", [formdata.fields([])], getHistoryWeb);
router.post("/gethistorycustomweb", [formdata.fields([])], getHistoryCustomWeb);
router.post("/placefrecuent", [formdata.fields([])], insertFrecuentPlace);
router.post("/getplacesfrecuent", [formdata.fields([])], getFrecuentPlace);
router.post("/deleteplace", [formdata.fields([])], deletePlace);
export default router;
