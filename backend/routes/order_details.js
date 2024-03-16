const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const OrderDetails = require('../models/order_details.model')

// Get all order details
router.get("", authenticate, (req, res) => {
  OrderDetails.find({
    // _userId: req.user_id
  }).then((orderDetails) => {
    res.send(orderDetails);
  }).catch((e) => {
    res.send(e);
  })
});

// Create order details
router.post("", authenticate, (req, res) => {
  let orderDetails = req.body;
  let newOrderDetails = new OrderDetails({
    _userId: orderDetails._userId,
    _paymentId: orderDetails._paymentId,
    total: orderDetails.total,
    // _userId: req.user_id
  });

  newOrderDetails.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update order details
router.patch("/:id", authenticate, (req, res) => {
  OrderDetails.findOneAndUpdate(
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
  OrderDetails.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;