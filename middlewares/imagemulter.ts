import path from "path";
import multer from "multer";
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/images"),
  filename: (req, file, cb) => {
    //quitar espacios
    console.log(req)
    const fileName = file.originalname.replace(/\s/g, "");
    let extension = Date.now() + "-image-" + fileName ;
    cb(null, extension);
    req.body.avatar = `${extension}`;
  },
});
const uploadImage = multer({
  fileFilter: (req, file, cb) => {

    var filetypes = /jpeg|jpg|png|svg/;
    var mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      cb(null, true);
    } else {
      req.body.avatar = null;
      cb(null, false);
    }
  },
  storage,
}).single("avatar");

export default uploadImage;
