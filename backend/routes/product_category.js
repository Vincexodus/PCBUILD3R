const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const ProductCategory = require('../models/product_category.model')

// Get all product category
router.get("", authenticate, (req, res) => {
  ProductCategory.find({
    // _userId: req.user_id
  }).then((category) => {
    res.send(category);
  }).catch((e) => {
    res.send(e);
  })
});

// Create product category
router.post("", authenticate, (req, res) => {
  let productCategory = req.body;
  let newProductCategory = new ProductCategory({
    productCategoryName: productCategory.productCategoryName,
    desc: productCategory.desc,
    // _userId: req.user_id
  });

  newProductCategory.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update product category
router.patch("/:id", authenticate, (req, res) => {
  ProductCategory.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Product Category updated successfully" });
  });
});

// Delete product category
router.delete("/:id", authenticate, (req, res) => {
  ProductCategory.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;