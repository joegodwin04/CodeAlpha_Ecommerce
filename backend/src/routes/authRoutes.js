const express = require('express');
const router  = express.Router();
const { register, login, getSecurityQuestion, verifySecurityAnswer, resetPassword } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

router.post('/security-question', getSecurityQuestion);
router.post('/verify-security-answer', verifySecurityAnswer);
router.post('/reset-password', resetPassword);

module.exports = router;
