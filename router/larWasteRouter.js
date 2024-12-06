const express = require('express');
const router = express.Router();
const multer = require('multer');

const { feedback, search, nearbyStores, upload_img } = require('../controller/lar_waste');
const { authenticateAccessToken } = require('../middlewares');

const upload = multer({
    storage: multer.diskStorage({
              destination: function (req, file, cb) { cb(null, 'public/img');  },
              filename: function (req, file, cb) {
                // 타임스탬프 생성
                const timestamp = Date.now();
                // 파일의 확장자를 유지하여 새 파일 이름 생성
                const originalName = file.originalname;
                const extension = originalName.substring(originalName.lastIndexOf('.'));
                const newFileName = `${timestamp}-${originalName}`;
                cb(null, newFileName);
             }}),
    });

router.post('/feedback', authenticateAccessToken, feedback);
router.get('/search', authenticateAccessToken, search);
router.get('/nearby-stores', authenticateAccessToken, nearbyStores);
router.post('/upload', authenticateAccessToken, upload.single('uploadFile'), upload_img);

module.exports = router;
