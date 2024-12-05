const express = require('express');
const router = express.Router();

// controller
const { login, register, user_delete, profile, profile_update, profile_update_process, history, checkDuplicateId } = require('../controller/user');
const { authenticateAccessToken } = require('../middlewares');

router.post('/login', login);
router.post('/register', register);
router.delete('/delete', authenticateAccessToken, user_delete);
router.get('/profile', authenticateAccessToken, profile);
router.get('/profile/update', authenticateAccessToken, profile_update);
router.put('/profile/update', authenticateAccessToken, profile_update_process);
router.get('/history', authenticateAccessToken, history);
router.post('/checkDuplicate_id', checkDuplicateId);

module.exports = router;
