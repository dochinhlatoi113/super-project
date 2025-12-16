const express = require('express');
const router = express.Router();
const Friend = require('../models/Friend');

// Dev helper: create friend request without auth
// GET /api/dev/create-friend?userId=<id>&friendId=<id>
router.get('/create-friend', async (req, res) => {
  try {
    const { userId, friendId } = req.query;
    if (!userId || !friendId) return res.status(400).json({ success: false, message: 'userId and friendId required' });

    // Prevent self-friend
    if (userId === friendId) return res.status(400).json({ success: false, message: 'Cannot friend yourself' });

    const exists = await Friend.findOne({ $or: [ { userId, friendId }, { userId: friendId, friendId: userId } ] });
    if (exists) return res.json({ success: true, message: 'Already exists', data: exists });

    const doc = new Friend({ userId, friendId, status: 'pending' });
    const saved = await doc.save();
    return res.json({ success: true, message: 'Created', data: saved });
  } catch (err) {
    console.error('Dev create-friend error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
