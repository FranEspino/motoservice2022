import { Router } from "express";
import { updateInfo } from "../controllers/user";
import {
  postPassengerApp,
  postPassengerAppNotPhoto,
  stateUser,
  versionApp,
  updateInfoNotPhoto,
} from "../controllers/user";
import multer from "multer";
const fs = require("fs");
const path = require("path");
let formdata = multer();
const router = Router();

router.post(
  "/user/updateinfo",
  multer({}).single("avatar"),
  function (req, res) {
    req.body.avatar = saveImage(req.file);
    updateInfo(req, res);
  }
);

router.post(
  "/user/registerpassenger",
  multer({}).single("avatar"),
  function (req, res) {
    req.body.avatar = saveImage(req.file);
    postPassengerApp(req, res);
  }
);
router.post("/stateuuser", [formdata.fields([])], stateUser);
router.post("/updatinfonotphoto", [formdata.fields([])], updateInfoNotPhoto);

router.get("/versionapp", [formdata.fields([])], versionApp);

router.post(
  "/user/registerpassengernotphoto",
  [formdata.fields([])],
  postPassengerAppNotPhoto
);

function saveImage(data: any) {
  const { originalname, buffer } = data;
  console.log(originalname, buffer);
  const fileName = originalname.replace(/\s/g, "");
  let finalName = Date.now() + "-image-" + fileName;
  fs.writeFile(
    path.join(__dirname, "../public/images/" + finalName),
    buffer,
    (error: any) => {}
  );
  return finalName;
}

export default router;
