const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/users/register', (req, res) => userController.register(req, res));
router.post('/users/login', userController.login)

module.exports = router;