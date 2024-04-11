const express = require("express");
const router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var path = require('path');
const authenticate = require('../middleware/authenticate');

const ProductCategory = require('../models/product_category.model')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

// Get all product category
router.get("", (req, res) => {
  ProductCategory.find({
  }).then((category) => {
    res.send(category);
  }).catch((e) => {
    res.send(e);
  })
});

// Create product category
router.post("", authenticate, upload.single('image'), (req, res) => {
  let productCategory = req.body;
  let newProductCategory = new ProductCategory({
    productCategoryName: productCategory.productCategoryName,
    productCategoryNameShort: productCategory.productCategoryNameShort,
    productCategoryImage: productCategory.productCategoryImage,
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