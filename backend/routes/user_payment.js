const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const UserPayment = require('../models/user_payment.model')

// Get all user payment
router.get("", authenticate, (req, res) => {
  UserPayment.find({
    // _userId: req.user_id
  }).then((userPayment) => {
    res.send(userPayment);
  }).catch((e) => {
    res.send(e);
  })
});

// Create user payment
router.post("", authenticate, (req, res) => {
  let userPayment = req.body;
  let newUserPayment = new UserPayment({
    _userId: userPayment._userId,
    paymentType: userPayment.paymentType,
    provider: userPayment.provider,
    accountNo: userPayment.accountNo,
    expiry: userPayment.expiry,
    // _userId: req.user_id
  });

  newUserPayment.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update user payment
router.patch("/:id", authenticate, (req, res) => {
  UserPayment.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "User Payment updated successfully" });
  });
});

// Delete user payment
router.delete("/:id", authenticate, (req, res) => {
  UserPayment.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;