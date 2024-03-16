const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const ProductCategory = require('../models/product_category.model')
const Product = require('../models/product.model')

// Get all product
router.get("", authenticate, (req, res) => {
  Product.find({
  }).then((products) => {
    res.send(products);
  });
});

// Create product
router.post("", authenticate, (req, res) => {
  let product = req.body;
  ProductCategory.findOne({
    _id: product.productCategoryId,
    // _userId: req.user_id
  })
    .then((category) => {
      if (category) {
        return true;
      }

      // else - the list object is undefined
      return false;
    })
    .then((canCreateProduct) => {
      if (canCreateProduct) {
        let newProduct = new Product({
          _productCategoryId: product.productCategoryId,
          _inventoryId: product._inventoryId,
          _discountId: product._discountId,
          productName: product.productName,
          desc: product.desc,
          SKU: product.SKU,
          price: product.price,
        });
        newProduct.save().then((newDoc) => {
          res.send(newDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

// Update product
router.patch("/:id", authenticate, (req, res) => {
    let product = req.body;
    ProductCategory.findOne({
      _id: product.productCategoryId,
      // _userId: req.user_id
    })
      .then((category) => {
        if (category) {
          // list object with the specified conditions was found
          // therefore the currently authenticated user can make updates to tasks within this list
          return true;
        }

        // else - the list object is undefined
        return false;
      })
      .then((canUpdateProduct) => {
        if (canUpdateProduct) {
          // the currently authenticated user can update tasks
          Product.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: req.body,
            }
          ).then(() => {
            res.send({ message: "Product Updated successfully." });
          });
        } else {
          res.sendStatus(404);
        }
      });
  }
);

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