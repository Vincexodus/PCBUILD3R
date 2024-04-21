const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const Session = require('../models/session.model')

// Get all sessions
router.get("", authenticate, (req, res) => {
  Session.find({
  }).then((session) => {
    res.send(session);
  }).catch((e) => {
    res.send(e);
  })
});

// Get session by userId
router.get("/:id", authenticate, (req, res) => {
  Session.find({
    _userId: req.params.id
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
    voucherKey: session.voucherKey,
    level: session.level,
    rating: session.rating,
    desc: session.desc
  });

  newSession.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Delete session
router.delete("/:id", authenticate, (req, res) => {
  Session.findOneAndDelete({
    _id: req.params.id,
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;