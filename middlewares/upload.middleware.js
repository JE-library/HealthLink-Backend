const multer = require("multer");
const path = require("path");

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const myFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Unsupported file type. Only images and documents are allowed."
      ),
      false
    );
  }
  cb(null, true);
};

//defining file parser middleware
const upload = multer({
  storage,
  fileFilter: myFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// creating instances UserRegistration and ProviderRegistration
const handleFile = {
  // UserRegistration
  handleProfilePic: upload.single("profilePhoto"),
  // ProviderRegistration
  handleDocsAndProfilePic: upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "certifications", maxCount: 5 },
  ]),
};

module.exports = handleFile;
