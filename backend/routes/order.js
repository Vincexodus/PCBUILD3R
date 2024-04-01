const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const Order = require('../models/order.model')
const CartItem = require('../models/cart_item.model');

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
router.post("", authenticate, async (req, res) => {
  try {
    let order = req.body;

    // Create a new order
    let newOrder = new Order({
      _userId: order._userId,
      _cartItemId: order._cartItemId,
      _voucherId: order._voucherId,
      _paymentMethod: order._paymentMethod,
      total: order.total,
    });

    const savedOrder = await newOrder.save();

    // Update cart items based on their IDs to mark them as paid
    await CartItem.updateMany(
      { _id: { $in: order._cartItemId } }, 
      { $set: { isPaid: true } } 
    );

    res.send(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Error creating order");
  }
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