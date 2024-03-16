const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const GameStats = require('../models/game_stats.model')

// Get all game stats
router.get("", authenticate, (req, res) => {
  GameStats.find({
    // _userId: req.user_id
  }).then((gameStats) => {
    res.send(gameStats);
  }).catch((e) => {
    res.send(e);
  })
});

// Create game stats
router.post("", authenticate, (req, res) => {
  let gameStats = req.body;
  let newGameStats = new GameStats({
    _userId: gameStats._userId,
    _sessionId: gameStats._sessionId,
    level: gameStats.level,
    experience: gameStats.experience,
    // _userId: req.user_id
  });

  newGameStats.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update game stats
router.patch("/:id", authenticate, (req, res) => {
  GameStats.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Game Stats updated successfully" });
  });
});

// Delete game stats
router.delete("/:id", authenticate, (req, res) => {
  GameStats.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;