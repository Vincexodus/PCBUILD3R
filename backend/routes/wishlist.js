const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const Wishlist = require('../models/wishlist.model')

// Get all wishlist
router.get("", authenticate, (req, res) => {
  Wishlist.find({
    // _userId: req.user_id
  }).then((wishlist) => {
    res.send(wishlist);
  }).catch((e) => {
    res.send(e);
  })
});

// Create wishlist
router.post("", authenticate, (req, res) => {
  let wishlist = req.body;
  let newWishlist = new Wishlist({
    _userId: wishlist._userId,
    _productId: wishlist._productId,
    // _userId: req.user_id
  });

  newWishlist.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update wishlist
router.patch("/:id", authenticate, (req, res) => {
  Wishlist.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Wishlist updated successfully" });
  });
});

// Delete wishlist
router.delete("/:id", authenticate, (req, res) => {
  Wishlist.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;