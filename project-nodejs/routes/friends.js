const express = require('express');
const router = express.Router();
const FriendController = require('../controllers/FriendController');
const { authenticateToken } = require('../middleware/auth');

const friendController = new FriendController();

router.use(authenticateToken);

router.get('/', (req, res) => friendController.getFriends(req, res));
router.post('/request', (req, res) => friendController.sendFriendRequest(req, res));
router.post('/accept', (req, res) => friendController.acceptFriendRequest(req, res));
router.post('/reject', (req, res) => friendController.rejectFriendRequest(req, res));
router.delete('/request/:friendId', (req, res) => friendController.cancelFriendRequest(req, res));
router.delete('/:friendId', (req, res) => friendController.removeFriend(req, res));
router.get('/pending', (req, res) => friendController.getPendingRequests(req, res));

// Compatibility routes used by system-chat frontend
router.get('/friends', (req, res) => friendController.getFriends(req, res));
router.get('/requests/received', (req, res) => friendController.getPendingRequests(req, res));
router.get('/requests/sent', (req, res) => friendController.getSentRequests(req, res));

module.exports = router;
