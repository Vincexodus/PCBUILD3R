const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const Order = require('../models/order.model')

// Get all order details
router.get("", authenticate, (req, res) => {
  Order.find({
    // _userId: req.user_id
  }).then((order) => {
    res.send(order);
  }).catch((e) => {
    res.send(e);
  })
});

// Create order details
router.post("", authenticate, (req, res) => {
  let order = req.body;
  let newOrder = new Order({
    _userId: order._userId,
    _cartItemId: order._cartItemId,
    _voucherId: order._voucherId,
    paymentMethod: order.paymentMethod,
    total: order.total,
    // _userId: req.user_id
  });

  newOrder.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update order details
router.patch("/:id", authenticate, (req, res) => {
  Order.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Order Details updated successfully" });
  });
});

// Delete order details
router.delete("/:id", authenticate, (req, res) => {
  Order.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;