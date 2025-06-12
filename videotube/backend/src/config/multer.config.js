import multer from "multer";
import crypto from "crypto"; // included in node by-default
import path from "path"; // included in node by-default

// DiskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads"); // upload location
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, name) {
      const fileName = name.toString("hex") + path.extname(file.originalname); // random name generator with original "file extension"
      cb(null, fileName);
    });
  },
});

// export upload variable
export const upload = multer({ storage: storage });
