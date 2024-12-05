const express = require('express');
const router = express.Router();
const multer = require('multer');

const { feedback, search, nearbyStores, upload_img } = require('../controller/lar_waste');
const { authenticateAccessToken } = require('../middlewares');

const upload = multer({
    storage: multer.diskStorage({
              destination: function (req, file, cb) { cb(null, 'public/img');  },
              filename: function (req, file, cb) {
                      var newFileName = file.originalname
                      cb(null, newFileName); }
             }),
    });

router.post('/feedback', authenticateAccessToken, feedback);
router.get('/search', search);
router.get('/nearby-stores', nearbyStores);
router.post('/upload', upload.single('uploadFile'), upload_img);

module.exports = router;
