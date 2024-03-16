const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const CartItem = require('../models/cart_item.model');

// Get all cart item
router.get("", authenticate, (req, res) => {
  CartItem.find({
    // _userId: req.user_id
  }).then((cart) => {
    res.send(cart);
  }).catch((e) => {
    res.send(e);
  })
});

// Create cart item
router.post("", authenticate, (req, res) => {
  let cartItem = req.body;
  let newCartItem = new CartItem({
    productId: cartItem.productId,
    quantity: cartItem.quantity,
    // _userId: req.user_id
  });

  newCartItem.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update cart item
router.patch("/:id", authenticate, (req, res) => {
  CartItem.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Cart Item updated successfully" });
  });
});

// Delete cart item
router.delete("/:id", authenticate, (req, res) => {
  CartItem.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;