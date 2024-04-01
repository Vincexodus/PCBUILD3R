const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const authenticate = require('../middleware/authenticate');

const Voucher = require('../models/voucher.model')

// Get all Voucher
router.get("", authenticate, (req, res) => {
  Voucher.find({
    _userId: req.user_id
  }).then((voucher) => {
    res.send(voucher);
  }).catch((e) => {
    res.send(e);
  })
});

// Create Voucher
router.post("", authenticate, async (req, res) => {
  try {
    let voucher = req.body;
    let newKey = generateUniqueKey();

    let existingKey = await Voucher.findOne({ key: newKey });
    while (existingKey) {
      newKey = generateUniqueKey();
      existingKey = await Voucher.findOne({ key: newKey });
    }

    let newVoucher = new Voucher({
      key: newKey,
      percent: voucher.percent,
      active: voucher.active,
      // _userId: req.user_id
    });

    const savedVoucher = await newVoucher.save();
    res.send(savedVoucher);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update Voucher
router.patch("/:id", authenticate, (req, res) => {
  Voucher.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Voucher updated successfully" });
  });
});

// Delete Voucher
router.delete("/:id", authenticate, (req, res) => {
  Voucher.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

const generateUniqueKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'PCB';
  const keyLength = 7;

  for (let i = 0; i < keyLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
  }

  return key;
};

module.exports = router;