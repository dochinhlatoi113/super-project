const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, '../uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique: userId_timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `avatar_${uniqueSuffix}${fileExtension}`);
  }
});

// File filter để chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
  // Kiểm tra loại file
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ được phép upload file ảnh (jpg, jpeg, png, gif)'), false);
  }
};

// Cấu hình multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: fileFilter
});

// Middleware upload avatar
const uploadAvatar = upload.single('avatar');

// Wrapper middleware để xử lý lỗi upload
const handleAvatarUpload = (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File ảnh quá lớn. Tối đa 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Lỗi upload file: ' + err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

// Middleware xóa file khi có lỗi
const cleanupUploadedFile = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;

  const cleanup = () => {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
  };

  res.send = function(data) {
    if (res.statusCode >= 400) {
      cleanup();
    }
    originalSend.call(this, data);
  };

  res.json = function(data) {
    if (res.statusCode >= 400) {
      cleanup();
    }
    originalJson.call(this, data);
  };

  next();
};

// Utility function để xóa file avatar cũ
const deleteOldAvatar = (avatarPath) => {
  if (avatarPath && fs.existsSync(avatarPath)) {
    fs.unlink(avatarPath, (err) => {
      if (err) console.error('Error deleting old avatar:', err);
    });
  }
};

// Utility function để get avatar URL
const getAvatarUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get('host')}/uploads/avatars/${filename}`;
};

module.exports = {
  handleAvatarUpload,
  cleanupUploadedFile,
  deleteOldAvatar,
  getAvatarUrl,
  uploadsDir,
  avatarsDir
};