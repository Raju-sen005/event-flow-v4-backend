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
    const unique = Date.now() + "-" + file.fieldname + path.extname(file.originalname);
    cb(null, unique);
  }
});

const upload = multer({ storage });

// ✅ EXPORT fields version
export const uploadProfileImages = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "backgroundImage", maxCount: 1 },
]);

export default upload;