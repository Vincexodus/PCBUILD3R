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

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

  res.header(
      'Access-Control-Expose-Headers',
      'x-access-token, x-refresh-token'
  );

  next();
});

// authenticate using JWT access token
let authenticate = (req, res, next) => {
  let token = req.header('x-access-token');

  // verify the JWT
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
      if (err) {
          res.status(401).send(err);
      } else {
          req.user_id = decoded._id;
          next();
      }
  });
}

let verifySession = (req, res, next) => {
  let refreshToken = req.header('x-refresh-token');

  let _id = req.header('_id');

  User.findByIdAndToken(_id, refreshToken).then((user) => {
      if (!user) {
          return Promise.reject({
              'error': 'User not found. Make sure that the refresh token and user id are correct'
          });
      }

      // user found
      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
          if (session.token === refreshToken) {
              // If token not expired
              if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                  isSessionValid = true;
              }
          }
      });

      if (isSessionValid) {
          next();
      } else {
          return Promise.reject({
              'error': 'Refresh token has expired or the session is invalid'
          })
      }

  }).catch((e) => {
      res.status(401).send(e);
  })
}

// ROUTE HANDLERS

// LIST ROUTES

// Get all product category
app.get("/productCategory", authenticate, (req, res) => {
  ProductCategory.find({
    // _userId: req.user_id
  }).then((category) => {
    res.send(category);
  }).catch((e) => {
    res.send(e);
  })
});

// Create product category
app.post("/productCategory", authenticate, (req, res) => {
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
app.patch("/productCategory/:id", authenticate, (req, res) => {
  ProductCategory.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Product Category updated successfully" });
  });
});

// Delete products
app.delete("/productCategory/:id", authenticate, (req, res) => {
  ProductCategory.findOneAndDelete({
    _id: req.params.id,
    // _userId: req.user_id
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

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

/* USER ROUTES */

/**
 * POST /users
 * Purpose: Sign up
 */
app.post('/users', (req, res) => {
  // User sign up

  let body = req.body;
  let newUser = new User(body);

  newUser.save().then(() => {
      return newUser.createSession();
  }).then((refreshToken) => {
      // Session created successfully - refreshToken returned.

      return newUser.generateAccessAuthToken().then((accessToken) => {
          // access auth token generated successfully, now we return an object containing the auth tokens
          return { accessToken, refreshToken }
      });
  }).then((authTokens) => {
      // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
      res
          .header('x-refresh-token', authTokens.refreshToken)
          .header('x-access-token', authTokens.accessToken)
          .send(newUser);
  }).catch((e) => {
      res.status(400).send(e);
  })
})


/**
* POST /users/login
* Purpose: Login
*/
app.post('/users/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findByCredentials(email, password).then((user) => {
      return user.createSession().then((refreshToken) => {
          // Session created successfully - refreshToken returned.

          return user.generateAccessAuthToken().then((accessToken) => {
              // access auth token generated successfully, now we return an object containing the auth tokens
              return { accessToken, refreshToken }
          });
      }).then((authTokens) => {
          // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
          res
              .header('x-refresh-token', authTokens.refreshToken)
              .header('x-access-token', authTokens.accessToken)
              .send(user);
      })
  }).catch((e) => {
      res.status(400).send(e);
  });
})


/**
* GET /users/me/access-token
* Purpose: generates and returns an access token
*/
app.get('/users/me/access-token', verifySession, (req, res) => {
  // we know that the user/caller is authenticated and we have the user_id and user object available to us
  req.userObject.generateAccessAuthToken().then((accessToken) => {
      res.header('x-access-token', accessToken).send({ accessToken });
  }).catch((e) => {
      res.status(400).send(e);
  });
})










































































app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
