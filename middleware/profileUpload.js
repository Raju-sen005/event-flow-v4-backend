// middleware/profileUpload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const createFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = "uploads/profile";
    createFolder(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  }
});

export default multer({ storage });