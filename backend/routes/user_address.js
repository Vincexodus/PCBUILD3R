const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const UserAddress = require('../models/user_address.model')

// Get all user address
router.get("", authenticate, (req, res) => {
  UserAddress.find({
    // _userId: req.user_id
  }).then((userAddress) => {
    res.send(userAddress);
  }).catch((e) => {
    res.send(e);
  })
});

// Create user address
router.post("", authenticate, (req, res) => {
  let userAddress = req.body;
  let newUserAddress = new UserAddress({
    _userId: userAddress._userId,
    addressLine1: userAddress.addressLine1,
    addressLine2: userAddress.addressLine2,
    city: userAddress.city,
    postalCode: userAddress.postalCode,
    country: userAddress.country,
    // _userId: req.user_id
  });

  newUserAddress.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update user address
router.patch("/:id", authenticate, (req, res) => {
  UserAddress.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "User Address updated successfully" });
  });
});

// Delete user address
router.delete("/:id", authenticate, (req, res) => {
  UserAddress.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;