const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const UserDetail = require('../models/user_detail.model')

// Get all user detail
router.get("", authenticate, (req, res) => {
  UserDetail.find({
    // _userId: req.user_id
  }).then((userDetail) => {
    res.send(userDetail);
  }).catch((e) => {
    res.send(e);
  })
});

// Get user detail
router.get("/:id", authenticate, (req, res) => {
  UserDetail.find({
    _userId: req.params.id
    // _userId: req.user_id
  }).then((userDetail) => {
    res.send(userDetail);
  }).catch((e) => {
    res.send(e);
  })
});

// Update user detail
router.patch("/:id", authenticate, (req, res) => {
  UserDetail.findOne({ _userId: req.params.id })
    .then(exist => {
      if (!exist) {
        let userDetail = req.body;
        let newUserDetail = new UserDetail({
          _userId: userDetail._userId,
          address: userDetail.address,
          city: userDetail.city,
          postalCode: userDetail.postalCode,
          country: userDetail.country,
          cardNumber: userDetail.cardNumber,
          CVC: userDetail.CVC,
          expireMonth: userDetail.expireMonth,
          expireYear: userDetail.expireYear,
        });
        return newUserDetail.save();
      } else {
        // Return the promise returned by findOneAndUpdate
        return UserDetail.findOneAndUpdate(
          { _userId: req.params.id },
          {
            $set: req.body,
          }
        );
      }
    })
    .then(() => {
      res.send({ message: "User Address updated successfully" });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    });
});

// Delete user detail
router.delete("/:id", authenticate, (req, res) => {
  UserDetail.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;