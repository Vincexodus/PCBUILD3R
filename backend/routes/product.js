
// Get all product using product category id
app.get("/productCategory/:productCategoryId/products", authenticate, (req, res) => {
  Product.find({
    _productCategoryId: req.params.productCategoryId,
  }).then((products) => {
    res.send(products);
  });
});

// Create a product using product category id
app.post("/productCategory/:productCategoryId/products", authenticate, (req, res) => {
  ProductCategory.findOne({
    _id: req.params.productCategoryId,
    // _userId: req.user_id

  })
    .then((product) => {
      if (product) {
        // list object with the specified conditions was found
        // therefore the currently authenticated user can create new tasks
        return true;
      }

      // else - the list object is undefined
      return false;
    })
    .then((canCreateProduct) => {
      if (canCreateProduct) {
        let product = req.body;
        let newProduct = new Product({
          _productCategoryId: req.params.productCategoryId,
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

// Update product using product category id
app.patch(
  "/productCategory/:productCategoryId/products/:productId", authenticate,
  (req, res) => {
    ProductCategory.findOne({
      _id: req.params.productCategoryId,
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
            {
              _id: req.params.productId,
              _productCategoryId: req.params.productCategoryId,
            },
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

// Delete product using product category id
app.delete(
  "/productCategory/:productCategoryId/products/:productId", authenticate,
  (req, res) => {
    ProductCategory.findOne({
      _id: req.params.productCategoryId,
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
      .then((canDeleteProduct) => {
        if (canDeleteProduct) {
          Product.findOneAndDelete({
            _id: req.params.productId,
            _productCategoryId: req.params.productCategoryId,
          }).then((removedDoc) => {
            res.send(removedDoc);
          });
        } else {
          res.sendStatus(404);
        }
      });
  }
);