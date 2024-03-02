const mongoose = require('mongoose');

const GameStatsSchema = new mongoose.Schema({
  _userId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  _sessionId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
  level: {
      type: Number,
      required: true,
      default: 1
  },
  experience: {
      type: Number,
      required: true,
      default: 0
  },
  createdAt: {
      type: Date,
      required: true,
      default: Date.now
  },
  modifiedAt: {
      type: Date,
  },
})

const GameStats = mongoose.model('GameStats', GameStatsSchema);

module.exports = { GameStats }