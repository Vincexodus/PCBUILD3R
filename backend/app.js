const express = require("express");
const app = express();
const { mongoose } = require("./db/mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const {
  CartItem,
  Discount,
  Feedback,
  GameStats,
  OrderDetails,
  OrderItems,
  PaymentDetails,
  ProductCategory,
  ProductInventory,
  Product,
  Session,
  UserAddress,
  UserPayment,
  User,
  WishList,
} = require("./db/models");

app.use(bodyParser.json());
// ROUTE HANDLERS

// LIST ROUTES

// Get all products
app.get("/products", (req, res) => {
  Product.find({}).then((products) => {
    res.send(products);
  });
});

// Create products
app.post("/products", (req, res) => {
  let product = req.body;
  let newProduct = new Product({
    productName: product.productName,
    desc: product.desc,
    SKU: product.SKU,
    price: product.price,
  });

  newProduct.save().then((listDoc) => {
    res.send(listDoc);
  });
});

// Update products
app.patch("/products/:id", (req, res) => {
  Product.findOneAndUpdate(
    { _id: req.params.id, _userId: req.user_id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Product updated successfully" });
  });
});

// delete products
app.delete("/products/:id", (req, res) => {
  Product.findOneAndDelete({
    _id: req.params.id,
    _userId: req.user_id,
  }).then((removedListDoc) => {
    res.send(removedListDoc);

    // delete all the tasks that are in the deleted list
    // deleteTasksFromList(removedListDoc._id);
  });
});

// Get all product in a specific product
app.get('/products/:productId/products', (req, res) => {
  // We want to return all tasks that belong to a specific list (specified by listId)
  Product.find({
      _productId: req.params.productId
  }).then((products) => {
      res.send(products);
  })
});

// Create a product in a specific product
app.post('/products/:productId/products', (req, res) => {
  // We want to create a new task in a list specified by listId

  Product.findOne({
      _id: req.params.productId,
  }).then((product) => {
      if (product) {
          // list object with the specified conditions was found
          // therefore the currently authenticated user can create new tasks
          return true;
      }

      // else - the list object is undefined
      return false;
  }).then((canCreateProduct) => {
      if (canCreateProduct) {
          let product = req.body;
          let newProduct = new Product({
              productName: product.productName,
              desc: product.desc,
              SKU: product.SKU,
              price: product.price,
              _productId: req.params.productId
          });
          newProduct.save().then((newTaskDoc) => {
              res.send(newTaskDoc);
          })
      } else {
          res.sendStatus(404);
      }
  })
})

app.patch('/products/:productId/products/:productId', (req, res) => {
  Product.findOne({
      _id: req.params.productId,
  }).then((product) => {
      if (product) {
          // list object with the specified conditions was found
          // therefore the currently authenticated user can make updates to tasks within this list
          return true;
      }

      // else - the list object is undefined
      return false;
  }).then((canUpdateProduct) => {
      if (canUpdateProduct) {
          // the currently authenticated user can update tasks
          Product.findOneAndUpdate({
              _id: req.params.productId,
              _productId: req.params.productId
          }, {
                  $set: req.body
              }
          ).then(() => {
              res.send({ message: 'Product Updated successfully.' })
          })
      } else {
          res.sendStatus(404);
      }
  })
});

app.delete('/products/:productId/products/:productId', (req, res) => {
  Product.findOne({
      _id: req.params.productId,
  }).then((product) => {
      if (product) {
          // list object with the specified conditions was found
          // therefore the currently authenticated user can make updates to tasks within this list
          return true;
      }

      // else - the list object is undefined
      return false;
  }).then((canDeleteProduct) => {
      
      if (canDeleteProduct) {
          Product.findOneAndDelete({
              _id: req.params.productId,
              _listId: req.params.productId
          }).then((removedTaskDoc) => {
              res.send(removedTaskDoc);
          })
      } else {
          res.sendStatus(404);
      }
  });
});







app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
