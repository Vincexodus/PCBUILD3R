const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');
var multer  = require('multer');

const Product = require('../models/product.model')
const CartItem = require('../models/cart_item.model');

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
router.get("", (req, res) => {
  Product.find({
    quantity: { $gt: 0 }
  }).then((products) => {
    res.send(products);
  });
});

// Get 16 latest products
router.get("/latest", (req, res) => {
  Product.find({ quantity: { $gt: 0 } })
  .sort({ createdAt: -1 })
  .limit(16)
  .then((products) => {
    res.send(products);
  }).catch((e) => {
    res.send(e);
  })
});

// Get all best selling products 
router.get('/sales', async (req, res) => {
  try {
    const cartItems = await CartItem.find({ isPaid: true }).exec(); // Use .exec() to execute the query
    const quantityMap = cartItems.reduce((acc, item) => {
      if (acc[item._productId]) {
        acc[item._productId] += item.quantity;
      } else {
        acc[item._productId] = item.quantity;
      }
      return acc;
    }, {});
    
    const quantitiesArray = Object.entries(quantityMap).map(([productId, quantity]) => ({
      _productId: productId,
      quantity: quantity
    }));
    
    // Fetch product details for the top products
    const productsWithMostQuantity = await Promise.all(quantitiesArray.map(async ({ _productId }) => {
      const product = await Product.findById({ _id: _productId, quantity: { $gt: 0 } }); // Assuming you have a Product model
      return { ...product.toObject() }; // Convert product to plain object
    }));
    
    res.json(productsWithMostQuantity);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get 16 best selling products 
router.get('/top', async (req, res) => {
  try {
    const cartItems = await CartItem.find({ isPaid: true }).exec();
    const quantityMap = cartItems.reduce((acc, item) => {
      if (acc[item._productId]) {
        acc[item._productId] += item.quantity;
      } else {
        acc[item._productId] = item.quantity;
      }
      return acc;
    }, {});
    
    const quantitiesArray = Object.entries(quantityMap).map(([productId, quantity]) => ({
      _productId: productId,
      quantity: quantity
    }));
    
    // limit to 16 cartItems
    quantitiesArray.sort((a, b) => b.quantity - a.quantity).slice(0, 16);
    
    // Fetch product details for the top products
    const productsWithMostQuantity = await Promise.all(quantitiesArray.map(async ({ _productId }) => {
      const product = await Product.findById({ _id: _productId, quantity: { $gt: 0 } }); // Assuming you have a Product model
      return { ...product.toObject() }; // Convert product to plain object
    }));
    
    res.json(productsWithMostQuantity);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get 16 best relevant products 
router.get("/common/:id", (req, res) => {
  const productId = req.params.id;

  Product.findOne({ _id: productId, quantity: { $gt: 0 }}).then((product) => {
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
router.get("/:id", (req, res) => {
  Product.find({
    _id: req.params.id,
    quantity: { $gt: 0 }
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
    productName: product.productName,
    productImage: product.productImage,
    rating: product.rating,
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
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;