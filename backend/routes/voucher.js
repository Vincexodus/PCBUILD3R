const express = require("express");
const router = express.Router();

const authenticate = require('../middleware/authenticate');

const Voucher = require('../models/voucher.model')

// Get all Voucher
router.get("", (req, res) => {
  Voucher.find({
  }).then((voucher) => {
    res.send(voucher);
  });
});

// Get voucher by key
router.get("/:key", authenticate, (req, res) => {
  Voucher.find({
    key: req.params.key,
  })
  .then((voucher) => {
    res.send(voucher);
  });
});

// Get voucher by percent
router.get("/:key", authenticate, (req, res) => {
  Voucher.find({
    percent: req.params.key,
    active: true
  })
  .limit(1)
  .then((voucher) => {
    res.send(voucher);
  });
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