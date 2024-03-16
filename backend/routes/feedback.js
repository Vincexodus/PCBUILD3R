const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const Feedback = require('../models/feedback.model')

// Get all feedback
router.get("", authenticate, (req, res) => {
  Feedback.find({
    // _userId: req.user_id
  }).then((feedback) => {
    res.send(feedback);
  }).catch((e) => {
    res.send(e);
  })
});

// Create new feedback
router.post("", authenticate, (req, res) => {
  let feedback = req.body;
  let newFeedback = new Feedback({
    subject: feedback.subject,
    rating: feedback.rating,
    desc: feedback.desc,
    // _userId: req.user_id
  });

  newFeedback.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update feedback
router.patch("/:id", authenticate, (req, res) => {
  Feedback.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Feedback updated successfully" });
  });
});

// Delete feedback
router.delete("/:id", authenticate, (req, res) => {
  Feedback.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;