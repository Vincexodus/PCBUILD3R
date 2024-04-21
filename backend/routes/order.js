const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const Order = require('../models/order.model')
const CartItem = require('../models/cart_item.model');
const Voucher = require('../models/voucher.model');
const Product = require('../models/product.model');

// Get all order details
router.get("", authenticate, (req, res) => {
  Order.find({
  }).then((order) => {
    res.send(order);
  }).catch((e) => {
    res.send(e);
  })
});

// Get orders by user id
router.get("/:id", authenticate, (req, res) => {
  Order.find({
    _userId: req.params.id
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

    let voucherId = order._voucherId;
    if (voucherId === '') {
      voucherId = null;
    }

    // Create a new order
    let newOrder = new Order({
      _userId: order._userId,
      _cartItemIds: order._cartItemIds,
      _voucherId: voucherId,
      paymentMethod: order.paymentMethod,
      total: order.total,
    });

    // Check if voucher ID is not empty
    if (order._voucherId !== '') {
      // Update voucher to inactive
      await Voucher.findOneAndUpdate(
        { _id: order._voucherId },
        { $set: { active: false } }
      );
    }

    const savedOrder = await newOrder.save();

    // Update cart items based on their IDs to mark them as paid
    await CartItem.updateMany(
      { _id: { $in: order._cartItemIds } }, 
      { $set: { isPaid: true } } 
    );

    // Deduct quantity from products based on the cart items in the order
    for (const cartItemId of order._cartItemIds) {
      const cartItem = await CartItem.findById(cartItemId);
      if (cartItem) {
        const product = await Product.findById(cartItem._productId);
        if (product) {
          product.quantity -= cartItem.quantity;
          await product.save();
        }
      }
    }

    res.send(savedOrder);
  } catch (error) {
    res.status(500).send("Error creating order");
  }
});

module.exports = router;