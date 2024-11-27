const express = require('express');
const router = express.Router();

// controller
const { login, register, user_delete, profile, checkDuplicateId } = require('../controller/user');
const { authenticateAccessToken } = require('../middlewares');

router.post('/login', login);
router.post('/register', register);
router.delete('/delete', authenticateAccessToken, user_delete);
router.get('/profile', authenticateAccessToken, profile);
router.post('/checkDuplicate_id', checkDuplicateId);

module.exports = router;
