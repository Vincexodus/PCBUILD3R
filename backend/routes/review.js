const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const Review = require('../models/review.model')

// Get all Review
router.get("", authenticate, (req, res) => {
  Review.find({
    // _userId: req.user_id
  }).then((review) => {
    res.send(review);
  }).catch((e) => {
    res.send(e);
  })
});

// Get all Review
router.get("/:id", authenticate, (req, res) => {
  Review.find({
    _id: req.params.id
  }).then((review) => {
    res.send(review);
  }).catch((e) => {
    res.send(e);
  })
});

// Create new Review
router.post("", authenticate, (req, res) => {
  let review = req.body;
  let newReview = new Review({
    _cartItemId: review._cartItemId,
    rating: review.rating,
    desc: review.desc,
    // _userId: req.user_id
  });

  newReview.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update Review
router.patch("/:id", authenticate, (req, res) => {
  Review.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Review updated successfully" });
  });
});

// Delete Review
router.delete("/:id", authenticate, (req, res) => {
  Review.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;