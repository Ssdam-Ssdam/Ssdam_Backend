const express = require('express');
const router = express.Router();
const classifiedImg = require('../controller/classifiedImg');
const feedback = require('../controller/feedback');
const inquiry = require('../controller/inquiryAdmin');
const { authenticateAccessToken, authenticateAdmin } = require('../middlewares');

router.get('/classifiedImg/view', authenticateAccessToken, authenticateAdmin, classifiedImg.view);

router.delete('/classifiedImg/delete', authenticateAccessToken, authenticateAdmin, classifiedImg.delete);

router.get('/feedback/view', authenticateAccessToken, authenticateAdmin, feedback.view);

router.get('/inquiry/view', authenticateAccessToken, authenticateAdmin, inquiry.view);

router.post('/inquiry/createAnswer', authenticateAccessToken, authenticateAdmin, inquiry.createAnswer);

router.put('/inquiry/updateAnswer', authenticateAccessToken, authenticateAdmin, inquiry.updateAnswer);

router.delete('/inquiry/delete', authenticateAccessToken, authenticateAdmin, inquiry.delete);

module.exports = router;
