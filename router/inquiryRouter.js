const express = require('express');
const router = express.Router();

const { inquiry_create, inquiry_viewAll, inquiry_view, inquiry_delete } = require('../controller/inquiry');
const { authenticateAccessToken } = require('../middlewares');

router.post('/create', authenticateAccessToken, inquiry_create);
router.get('/view-all', authenticateAccessToken, inquiry_viewAll);
router.get('/view', inquiry_view);
router.delete('/delete', inquiry_delete);

module.exports = router;
