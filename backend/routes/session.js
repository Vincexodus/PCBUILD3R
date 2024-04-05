const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const Session = require('../models/session.model')

// Get all sessions
router.get("", authenticate, (req, res) => {
  Session.find({
    // _userId: req.user_id
  }).then((session) => {
    res.send(session);
  }).catch((e) => {
    res.send(e);
  })
});

// Create session
router.post("", authenticate, (req, res) => {
  let session = req.body;
  let newSession = new Session({
    _userId: session._userId,
    _reviewId: session._reviewId,
    level: session.level,
    // _userId: req.user_id
  });

  newSession.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update session
router.patch("/:id", authenticate, (req, res) => {
  Session.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Session updated successfully" });
  });
});

// Delete session
router.delete("/:id", authenticate, (req, res) => {
  Session.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;