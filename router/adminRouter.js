const express = require('express');
const router = express.Router();
const classifiedImg = require('../controller/classifiedImg');
const feedback = require('../controller/feedback');
const { authenticateAccessToken, authenticateAdmin } = require('../middlewares');

router.get('/classifiedImg/view', authenticateAccessToken, authenticateAdmin, classifiedImg.view);

router.delete('/classifiedImg/delete', authenticateAccessToken, authenticateAdmin, classifiedImg.delete);

router.get('/feedback/view', authenticateAccessToken, authenticateAdmin, feedback.view);

module.exports = router;
