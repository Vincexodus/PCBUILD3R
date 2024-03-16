const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const PaymentDetails = require('../models/payment_details.model')

// Get all payment details
router.get("", authenticate, (req, res) => {
  PaymentDetails.find({
    // _userId: req.user_id
  }).then((paymentDetails) => {
    res.send(paymentDetails);
  }).catch((e) => {
    res.send(e);
  })
});

// Create payment details
router.post("", authenticate, (req, res) => {
  let paymentDetails = req.body;
  let newPaymentDetails = new PaymentDetails({
    _orderId: paymentDetails._orderId,
    amount: paymentDetails.amount,
    status: paymentDetails.status,
    // _userId: req.user_id
  });

  newPaymentDetails.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update payment details
router.patch("/:id", authenticate, (req, res) => {
  PaymentDetails.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Product Category updated successfully" });
  });
});

// Delete payment details
router.delete("/:id", authenticate, (req, res) => {
  PaymentDetails.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;