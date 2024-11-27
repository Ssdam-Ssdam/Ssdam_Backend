const express = require('express');
const router = express.Router();
const person = require('../controller/person'); // controller import
const { authenticateAccessToken, authenticateAdmin } = require('../middlewares');

router.get('/view', authenticateAccessToken, authenticateAdmin, person.view);

router.post('/create', authenticateAccessToken, authenticateAdmin, person.create);

router.put('/update', authenticateAccessToken, authenticateAdmin, person.update);

router.delete('/delete', authenticateAccessToken, authenticateAdmin, person.deleteUser);

module.exports = router;
