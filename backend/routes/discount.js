const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const Discount = require('../models/discount.model')

// Get all discount
router.get("", authenticate, (req, res) => {
  Discount.find({
    // _userId: req.user_id
  }).then((discount) => {
    res.send(discount);
  }).catch((e) => {
    res.send(e);
  })
});

// Create discount
router.post("", authenticate, (req, res) => {
  let discount = req.body;
  let newDiscount = new Discount({
    discountName: discount.name,
    desc: discount.desc,
    percent: discount.discount_percent,
    active: discount.active,
    // _userId: req.user_id
  });

  newProductCategory.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update discount
router.patch("/:id", authenticate, (req, res) => {
  Discount.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Discount updated successfully" });
  });
});

// Delete discount
router.delete("/:id", authenticate, (req, res) => {
  Discount.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;