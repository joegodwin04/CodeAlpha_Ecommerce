const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const JWT_SECRET  = process.env.JWT_SECRET  || 'changeme_in_production';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Simple email format check */
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Generate a signed JWT for the given user object */
const signToken = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

/* ── POST /api/auth/register ─────────────────────────────────────────────── */
const register = async (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;

    // ── Field presence ──────────────────────────────────────────────────────
    if (!name || !email || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, password, securityQuestion, securityAnswer.',
      });
    }

    // ── Name length ─────────────────────────────────────────────────────────
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.',
      });
    }

    // ── Email format ────────────────────────────────────────────────────────
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // ── Password strength ────────────────────────────────────────────────────
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // ── Duplicate email ──────────────────────────────────────────────────────
    const existing = User.findByEmail(email.toLowerCase());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // ── Hash password & answer & persist ─────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedAnswer   = await bcrypt.hash(securityAnswer.toLowerCase().trim(), 12);
    const newUser        = User.create({
      name:     name.trim(),
      email:    email.toLowerCase(),
      password: hashedPassword,
      securityQuestion,
      securityAnswer: hashedAnswer
    });

    // ── Issue JWT ────────────────────────────────────────────────────────────
    const token = signToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id:        newUser.id,
        name:      newUser.name,
        email:     newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
    });
  }
};

/* ── POST /api/auth/login ────────────────────────────────────────────────── */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Field presence ──────────────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // ── Look up user ─────────────────────────────────────────────────────────
    const user = User.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── Verify password ──────────────────────────────────────────────────────
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── Issue JWT ────────────────────────────────────────────────────────────
    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id:        user.id,
        name:      user.name,
        email:     user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
    });
  }
};

/* ── FORGOT PASSWORD FLOW ────────────────────────────────────────────────── */

const getSecurityQuestion = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required.' });
    
    const user = User.findByEmail(email.toLowerCase());
    if (!user) {
      // Don't leak if email exists or not exactly, but for this demo, returning an error is fine
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }
    
    if (!user.securityQuestion) {
      return res.status(400).json({ success: false, message: 'No security question set for this account.' });
    }

    return res.status(200).json({
      success: true,
      securityQuestion: user.securityQuestion
    });
  } catch (error) {
    console.error('getSecurityQuestion error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to retrieve security question.' });
  }
};

const verifySecurityAnswer = async (req, res) => {
  try {
    const { email, securityAnswer } = req.body;
    if (!email || !securityAnswer) return res.status(400).json({ success: false, message: 'Email and answer required.' });
    
    const user = User.findByEmail(email.toLowerCase());
    if (!user) return res.status(404).json({ success: false, message: 'Account not found.' });
    
    const answerMatch = await bcrypt.compare(securityAnswer.toLowerCase().trim(), user.securityAnswer);
    if (!answerMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect security answer.' });
    }
    
    // Create a short-lived token to authorize the password reset
    const resetToken = jwt.sign({ email: user.email, intent: 'reset_password' }, JWT_SECRET, { expiresIn: '15m' });
    
    return res.status(200).json({
      success: true,
      resetToken
    });
  } catch (error) {
    console.error('verifySecurityAnswer error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to verify answer.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    if (!email || !resetToken || !newPassword) return res.status(400).json({ success: false, message: 'All fields required.' });
    
    // Verify token
    try {
      const decoded = jwt.verify(resetToken, JWT_SECRET);
      if (decoded.email !== email.toLowerCase() || decoded.intent !== 'reset_password') {
        throw new Error('Invalid token');
      }
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired reset session. Please try again.' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    
    const user = User.findByEmail(email.toLowerCase());
    if (!user) return res.status(404).json({ success: false, message: 'Account not found.' });
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    User.updatePassword(user.email, hashedPassword);
    
    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in.'
    });
  } catch (error) {
    console.error('resetPassword error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
};

module.exports = { register, login, getSecurityQuestion, verifySecurityAnswer, resetPassword };
