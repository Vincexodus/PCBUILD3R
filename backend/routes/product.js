const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');
var multer  = require('multer');
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

// Get 16 latest products
router.get("/latest", authenticate, (req, res) => {
  Product.find()
  .sort({ createdAt: -1 })
  .limit(16)
  .then((products) => {
    res.send(products);
  }).catch((e) => {
    res.send(e);
  })
});

// Get 16 best selling products 
router.get("/top", authenticate, (req, res) => {
  Product.aggregate([{
    $sample: { size: 16 }
  }]).then((products) => {
    res.send(products);
  }).catch((e) => {
    res.send(e);
  })
});

// Get 16 best relevant products 
router.get("/common/:id", authenticate, (req, res) => {
  const productId = req.params.id;

  Product.findOne({ _id: productId }).then((product) => {
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const productCategoryId = product._productCategoryId;
    Product.aggregate([
      { $match: { _productCategoryId: productCategoryId, _id: { $ne: productId } } },
      { $sample: { size: 8 } }
    ]).then((result) => {
      res.send(result);
    }).catch((e) => {
      res.status(500).send(e);
    });
  }).catch((e) => {
    res.status(500).send(e);
  });
});

// Get product
router.get("/:id", authenticate, (req, res) => {
  Product.find({
    _id: req.params.id
  }).then((products) => {
    if (products.length === 0) {
      return res.status(400).send("Product ID not found");
    }
    res.send(products);
  }).catch((e) => {
    if (e.name === 'CastError') {
      return res.status(400).send("Invalid Product ID");
    } else {
      res.send(e);
    }
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
    quantity: product.quantity,
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