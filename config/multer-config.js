const multer = require('multer');
const path= require('path');

// Multer setup for memory storage
const uploading = multer.memoryStorage();


const fileFilter = function (req, file, cb) {
    const fileTypes = [".jpg", ".png", ".jpeg", ".webp", ".svg"];
    const extname = path.extname(file.originalname).toLowerCase();
  
    if (fileTypes.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error(`Only these file types are allowed: ${fileTypes.join(", ")}`), false);
    }
  };
  
  const upload = multer({ 
    storage: uploading,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });




module.exports = upload;
