const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const cartItemRoutes = require('./routes/cart_item');
const discountRoutes = require('./routes/discount');
const feedbackRoutes = require('./routes/feedback');
const gameStatsRoutes = require('./routes/game_stats');
const orderDetailsRoutes = require('./routes/order_details');
const orderItemsRoutes = require('./routes/order_items');
const paymentDetailsRoutes = require('./routes/payment_details');
const productCategoryRoutes = require('./routes/product_category');
const productInventoryRoutes = require('./routes/product_inventory');
const productRoutes = require('./routes/product');
const sessionRoutes = require('./routes/session');
const userAddressRoutes = require('./routes/user_address');
const userPaymentRoutes = require('./routes/user_payment');
const userRoutes = require('./routes/user');
const wishlistRoutes = require('./routes/wishlist');

// Connect to mongo db
mongoose.connect("mongodb://localhost:27017/PCBUILD3R")
  .then(() => {
    console.log("Connected to MongoDB successfully...");
  })
  .catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
  });

app.use(bodyParser.json({ limit: '10mb'}));

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

app.use("/cartItem", cartItemRoutes);
app.use("/discount", discountRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/gameStats", gameStatsRoutes);
app.use("/orderDetails", orderDetailsRoutes);
app.use("/orderItems", orderItemsRoutes);
app.use("/paymentDetails", paymentDetailsRoutes);
app.use("/productCategory", productCategoryRoutes);
app.use("/productInventory", productInventoryRoutes);
app.use("/product", productRoutes);
app.use("/session", sessionRoutes);
app.use("/userAddress", userAddressRoutes);
app.use("/userPayment", userPaymentRoutes);
app.use("/user", userRoutes);
app.use("/wishlist", wishlistRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
