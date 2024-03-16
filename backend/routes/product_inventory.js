const express = require("express");
const router = express.Router();
const authenticate  = require('../middleware/authenticate');

const ProductInventory = require('../models/product_inventory.model')

// Get all product inventory
router.get("", authenticate, (req, res) => {
  ProductInventory.find({
    // _userId: req.user_id
  }).then((inventory) => {
    res.send(inventory);
  }).catch((e) => {
    res.send(e);
  })
});

// Create product inventory
router.post("", authenticate, (req, res) => {
  let productInventory = req.body;
  let newProductInventory = new ProductInventory({
    _productCategoryId: productInventory._productCategoryId,
    quantity: productInventory.quantity,
    // _userId: req.user_id
  });

  newProductInventory.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update product inventory
router.patch("/:id", authenticate, (req, res) => {
  ProductInventory.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Product Inventory updated successfully" });
  });
});

// Delete product inventory
router.delete("/:id", authenticate, (req, res) => {
  ProductInventory.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;