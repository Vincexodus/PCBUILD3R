const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const CartItem = require('../models/cart_item.model')
const Review = require('../models/review.model')

// Get all Review
router.get("", authenticate, (req, res) => {
  Review.find({
  }).then((review) => {
    res.send(review);
  }).catch((e) => {
    res.send(e);
  })
});

// Get reviews by product id
router.get("/:id", authenticate, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ _productId: req.params.id });

    const cartItemIds = cartItems.map(cartItem => cartItem._id);

    // Find the reviews associated with the cartItems
    const reviews = await Review.find({ _cartItemId: { $in: cartItemIds } });

    res.send(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update product review
router.patch("/:id", authenticate, (req, res) => {
  Review.findOne({ _cartItemId: req.params.id })
    .then(exist => {
      if (!exist) {
        let review = req.body;
        let newReview = new Review({
          _cartItemId: review._cartItemId,
          rating: review.rating,
          desc: review.desc,
        });
        return newReview.save();
      } else {
        return Review.findOneAndUpdate(
          { _cartItemId : req.params.id },
          {
            $set: req.body,
          }
        );
      }
    })
    .then(() => {
      res.send({ message: "Review updated successfully" });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    });
});

// Delete Review by cartItemId
router.delete("/:id", authenticate, (req, res) => {
  Review.findOneAndDelete({
    _cartItemId: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;