const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');
var multer  = require('multer');
const ProductCategory = require('../models/product_category.model')
const Product = require('../models/product.model')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

// Get all product
router.get("", authenticate, (req, res) => {
  Product.find({
  }).then((products) => {
    res.send(products);
  });
});

// Get all product category
router.get("/latest", authenticate, (req, res) => {
  Product.aggregate([{
    $sample: { size: 16 }
  }]).then((category) => {
    res.send(category);
  }).catch((e) => {
    res.send(e);
  })
});

// Create product
router.post("", authenticate, upload.single('image'), (req, res) => {
  let product = req.body;
  let newProduct = new Product({
    _productCategoryId: product._productCategoryId,
    _inventoryId: product._inventoryId,
    _discountId: product._discountId,
    productName: product.productName,
    productImage: product.productImage,
    desc: product.desc,
    price: product.price,
  });
  newProduct.save().then((newDoc) => {
    res.send(newDoc);
  });
});

// Update product
router.patch("/:id", authenticate, (req, res) => {
  Product.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Product Updated successfully." });
  });
});

// Delete product
router.delete("/:id", authenticate, (req, res) => {
  Product.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;