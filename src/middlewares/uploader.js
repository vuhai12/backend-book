// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     return cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     return cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const uploadCloud = multer({ storage });

// module.exports = uploadCloud;

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

// Cấu hình Multer Storage với Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'book_store', // Tạo folder lưu ảnh trong Cloudinary
    format: async (req, file) => 'png', // Định dạng ảnh (png, jpg, jpeg)
    public_id: (req, file) => file.originalname.split('.')[0], // Đặt tên file
  },
});

// Middleware xử lý upload file
const upload = multer({ storage });

export default upload;
