const express = require('express');
const router = express.Router();
const classifiedImg = require('../controller/classifiedImg'); // controller import
const { authenticateAccessToken, authenticateAdmin } = require('../middlewares');

router.get('/classifiedImg/view', authenticateAccessToken, authenticateAdmin, classifiedImg.view);

router.delete('/classifiedImg/delete', authenticateAccessToken, authenticateAdmin, classifiedImg.delete);

module.exports = router;
