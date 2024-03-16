const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const OrderItems = require('../models/order_items.model')

// Get all order items
router.get("", authenticate, (req, res) => {
  OrderItems.find({
    // _userId: req.user_id
  }).then((orderItems) => {
    res.send(orderItems);
  }).catch((e) => {
    res.send(e);
  })
});

// Create order items
router.post("", authenticate, (req, res) => {
  let orderItems = req.body;
  let newOrderItems = new OrderItems({
    _orderId: orderItems._orderIdl,
    _productId: orderItems._productId,
    quantity: orderItems.quantity,
    // _userId: req.user_id
  });

  newOrderItems.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update order items
router.patch("/:id", authenticate, (req, res) => {
  OrderItems.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Order Items updated successfully" });
  });
});

// Delete order items
router.delete("/:id", authenticate, (req, res) => {
  OrderItems.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;