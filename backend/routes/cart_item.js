const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const CartItem = require('../models/cart_item.model');

// Get user's unpaid cart item 
router.get("/user/:id", authenticate, (req, res) => {
  CartItem.find({
    _userId: req.params.id,
    isPaid: false
  }).then((cart) => {
    res.send(cart);
  }).catch((e) => {
    res.send(e);
  })
});

// calculate product review
router.get("/:id", (req, res) => {
  CartItem.find({
    _id: req.params.id,
  }).then((cart) => {
    res.send(cart);
  }).catch((e) => {
    res.send(e);
  })
});

// Create cart item
router.post("", authenticate, (req, res) => {
  let cartItem = req.body;
  // add on to unpaid item, as paid one is immutable
  CartItem.findOne({ _userId: cartItem._userId, _productId: cartItem._productId, isPaid: false })
    .then(existingCartItem => {
      if (existingCartItem) {
        // If an existing cart item is found, update its quantity
        existingCartItem.quantity += cartItem.quantity;
        return existingCartItem.save();
      } else {
        // If no existing cart item is found, create a new one
        let newCartItem = new CartItem({
          _userId: cartItem._userId,
          _productId: cartItem._productId,
          quantity: cartItem.quantity,
          isPaid: false
        });
        return newCartItem.save();
      }
    })
    .then(savedCartItem => {
      res.send(savedCartItem);
    })
    .catch(error => {
      res.status(500).send(error);
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
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;