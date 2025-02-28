const express = require('express');
const router = express.Router();
const admin = require('../config/firebase.config');
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    res.json(userRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 