const FriendService = require('../services/FriendService');

class FriendController {
  constructor() {
    this.friendService = new FriendService();
  }

  async getFriends(req, res) {
    try {
      const userId = req.user.id;
      const friends = await this.friendService.getFriends(userId);
      res.json({ success: true, data: friends });
    } catch (error) {
      console.error('Error getting friends:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async sendFriendRequest(req, res) {
    try {
      const userId = req.user.id;
      const { friendId } = req.body;
      if (!friendId) return res.status(400).json({ success: false, message: 'Friend ID is required' });
      console.log('POST /api/friends/request called by', userId, 'target:', friendId, 'body:', req.body);
      const result = await this.friendService.sendFriendRequest(userId, friendId);
      try {
        // verify saved doc
        const FriendModel = require('../models/Friend');
        const saved = await FriendModel.findById(result._id).lean();
        console.log('Friend saved verification:', saved ? 'FOUND' : 'MISSING', saved?._id);
      } catch (e) {
        console.error('Verify saved friend error:', e);
      }

      res.json({ success: true, message: 'Friend request sent', data: result });
    } catch (error) {
      console.error('Error sending friend request:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async acceptFriendRequest(req, res) {
    try {
      const userId = req.user.id;
      const { friendId } = req.body;
      if (!friendId) return res.status(400).json({ success: false, message: 'Friend ID is required' });
      const result = await this.friendService.acceptFriendRequest(userId, friendId);
      res.json({ success: true, message: 'Friend request accepted', data: result });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async rejectFriendRequest(req, res) {
    try {
      const userId = req.user.id;
      const { friendId } = req.body;
      if (!friendId) return res.status(400).json({ success: false, message: 'Friend ID is required' });
      const result = await this.friendService.rejectFriendRequest(userId, friendId);
      res.json({ success: true, message: 'Friend request rejected', data: result });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async cancelFriendRequest(req, res) {
    try {
      const userId = req.user.id;
      const { friendId } = req.params;
      const result = await this.friendService.cancelFriendRequest(userId, friendId);
      res.json({ success: true, message: 'Friend request cancelled', data: result });
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async removeFriend(req, res) {
    try {
      const userId = req.user.id;
      const { friendId } = req.params;
      const result = await this.friendService.removeFriend(userId, friendId);
      res.json({ success: true, message: 'Friend removed', data: result });
    } catch (error) {
      console.error('Error removing friend:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async getPendingRequests(req, res) {
    try {
      const userId = req.user.id;
      const requests = await this.friendService.getPendingRequests(userId);
      res.json({ success: true, data: requests });
    } catch (error) {
      console.error('Error getting pending requests:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getSentRequests(req, res) {
    try {
      const userId = req.user.id;
      const requests = await this.friendService.getSentRequests(userId);
      res.json({ success: true, data: requests });
    } catch (error) {
      console.error('Error getting sent requests:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = FriendController;
