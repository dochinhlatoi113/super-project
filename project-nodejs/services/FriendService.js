const Friend = require('../models/Friend');
const Admin = require('../models/Admin');

class FriendService {
  async getFriends(userId) {
    const friends = await Friend.find({
      $or: [
        { userId: userId, status: 'accepted' },
        { friendId: userId, status: 'accepted' }
      ]
    })
    .populate('userId', 'name email avatar')
    .populate('friendId', 'name email avatar')
    .sort({ acceptedAt: -1 });

    return friends.map(friend => {
      const isRequester = friend.userId._id.toString() === userId.toString();
      return {
        _id: friend._id,
        friend: isRequester ? friend.friendId : friend.userId,
        status: friend.status,
        acceptedAt: friend.acceptedAt,
        requestedAt: friend.requestedAt
      };
    });
  }

  async sendFriendRequest(userId, friendId) {
    const [user, friend] = await Promise.all([
      Admin.findById(userId),
      Admin.findById(friendId)
    ]);

    if (!user || !friend) throw new Error('User not found');

    const existingRequest = await Friend.findOne({
      $or: [
        { userId: userId, friendId: friendId },
        { userId: friendId, friendId: userId }
      ]
    });

    if (existingRequest) {
      if (existingRequest.status === 'accepted') throw new Error('Already friends');
      if (existingRequest.status === 'pending') throw new Error('Friend request already sent');
    }

    // Save only ObjectId references (avoid embedding full documents)
    const newRequest = new Friend({ userId: user._id, friendId: friend._id, status: 'pending' });
    return await newRequest.save();
  }

  async acceptFriendRequest(userId, friendId) {
    const request = await Friend.findOne({ userId: friendId, friendId: userId, status: 'pending' });
    if (!request) throw new Error('Friend request not found');
    request.status = 'accepted';
    request.acceptedAt = new Date();
    return await request.save();
  }

  async rejectFriendRequest(userId, friendId) {
    const request = await Friend.findOneAndDelete({ userId: friendId, friendId: userId, status: 'pending' });
    if (!request) throw new Error('Friend request not found');
    return request;
  }

  async cancelFriendRequest(userId, friendId) {
    const request = await Friend.findOneAndDelete({ userId: userId, friendId: friendId, status: 'pending' });
    if (!request) throw new Error('Friend request not found');
    return request;
  }

  async removeFriend(userId, friendId) {
    const friendship = await Friend.findOneAndDelete({
      $or: [
        { userId: userId, friendId: friendId, status: 'accepted' },
        { userId: friendId, friendId: userId, status: 'accepted' }
      ]
    });
    if (!friendship) throw new Error('Friendship not found');
    return friendship;
  }

  async getPendingRequests(userId) {
    return await Friend.find({ friendId: userId, status: 'pending' })
      .populate('userId', 'name email avatar')
      .sort({ requestedAt: -1 });
  }

  async getSentRequests(userId) {
    return await Friend.find({ userId: userId, status: 'pending' })
      .populate('friendId', 'name email avatar')
      .sort({ requestedAt: -1 });
  }
}

module.exports = FriendService;
