import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/portfolio",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
    );
  }
});

const fileFilter = (req, file, cb) => {

  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("video")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images or videos allowed"));
  }
};

const uploadPortfolio = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

export default uploadPortfolio;