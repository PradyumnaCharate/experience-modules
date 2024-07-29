const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const imagesDirectory = 'public/images';
const videosDirectory = 'public/videos';
const documentsDirectory = 'public/documents';

const generateFileName = (file) => {
  return `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
};

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(imagesDirectory, { recursive: true });
    cb(null, imagesDirectory);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileName(file);
    cb(null, fileName);
  },
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(videosDirectory, { recursive: true });
    cb(null, videosDirectory);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileName(file);
    cb(null, fileName);
  },
});

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(documentsDirectory, { recursive: true });
    cb(null, documentsDirectory);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileName(file);
    cb(null, fileName);
  },
});

// Single image upload middleware
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10000000, // 1MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Please upload a valid image file'));
    }
    cb(null, true);
  },
}).single('image');

// Multiple image upload middleware (up to 5 images)
const imageMultipleUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10000000, // 1MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Please upload a valid image file'));
    }
    cb(null, true);
  },
}).array('images', 5); // Accepts up to 5 images in an array

// Single video upload middleware
const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 50000000, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4|mkv|avi)$/)) {
      return cb(new Error('Please upload a valid video file'));
    }
    cb(null, true);
  },
}).single('video');

// Multiple video upload middleware (up to 5 videos)
const videoMultipleUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 50000000, // 50MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4|mkv|avi)$/)) {
      return cb(new Error('Please upload a valid video file'));
    }
    cb(null, true);
  },
}).array('videos', 5); // Accepts up to 5 videos in an array

const documentsMultipleUpload = multer({
  storage: documentStorage,
  limits: {
    fileSize: 5000000, // 1MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(pdf|txt)$/)) {
      return cb(new Error('Please upload a valid document file'));
    }
    cb(null, true);
  },
}).array('documents', 5);

const documentSingleUpload = multer({
  storage: documentStorage,
  limits: {
    fileSize: 5000000, // 1MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(pdf|txt)$/)) {
      return cb(new Error('Please upload a valid document file'));
    }
    cb(null, true);
  },
}).single('document'); // Accepts up to 5 images in an array

const deleteFiles = (filePaths) => {
  filePaths.forEach((filePath) => {
    try {
      fs.unlinkSync(`public/${filePath}`);
    } catch (err) {
      console.error(`Error deleting file: ${filePath}`, err);
    }
  });
};
const resizeAndConvertToWebp = async (file) => {
  console.log("dsoij")
  const image = sharp(file.path);
  const resizedImage = await image.resize({ fit: 'inside', width: 800, height: 600 })
                                   .webp({ quality: 80 })
                                   .toBuffer();
  fs.writeFileSync(file.path, resizedImage);
};

module.exports = {
  imageUpload,
  imageMultipleUpload,
  videoUpload,
  videoMultipleUpload,
  documentsMultipleUpload,
  documentSingleUpload,
  deleteFiles,
  resizeAndConvertToWebp
};
