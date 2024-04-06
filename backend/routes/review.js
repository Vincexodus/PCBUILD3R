const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const Product = require('../models/product.model')
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

// Get product reviews by product id
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
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const { rating, desc } = req.body;
    const review = await Review.findOne({ _cartItemId: req.params.id });
    if (!review) {
      // If review does not exist, create a new one
      const newReview = new Review({
        _cartItemId: req.params.id,
        rating,
        desc,
      });
      await newReview.save();
    } else {
      // If review exists, update it
      await Review.findOneAndUpdate({ _cartItemId: req.params.id }, { $set: { rating, desc } });
    }

    // Update product rating
    // Find cart item's product id
    const cartItem = await CartItem.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).send({ message: "Cart item not found" });
    }

    // Find product from cart item's product id
    const product = await Product.findById(cartItem._productId);

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Find all cartItems with same product id
    const cartItems = await CartItem.find({ _productId: product._id });

    // Find the reviews associated with the cartItems
    const reviews = await Review.find({ _cartItemId: { $in: cartItems.map(cartItem => cartItem._id) } });

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    const roundedAverageRating = Math.round(averageRating * 10) / 10;
    
    // Update the product's rating
    product.rating = roundedAverageRating;
    await product.save();

    res.send({ message: "Review updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete Review by cartItemId
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const removedReview = await Review.findOneAndDelete({ _cartItemId: req.params.id });

    if (!removedReview) {
      return res.status(404).send({ message: "Review not found" });
    }

    // Update product rating
    // Find cart item's product id
    const cartItem = await CartItem.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).send({ message: "Cart item not found" });
    }

    // Find product from cart item's product id
    const product = await Product.findById(cartItem._productId);

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Find all cartItems with same product id
    const cartItems = await CartItem.find({ _productId: product._id });

    // Find the reviews associated with the cartItems
    const reviews = await Review.find({ _cartItemId: { $in: cartItems.map(cartItem => cartItem._id) } });

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    const roundedAverageRating = Math.round(averageRating * 10) / 10;
    
    // Update the product's rating
    product.rating = roundedAverageRating;
    await product.save();

    res.send({ message: "Review deleted successfully", removedReview });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


module.exports = router;