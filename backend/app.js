const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Resend } = require('resend');

require('dotenv').config();
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const cartItemRoutes = require('./routes/cart_item');
const voucherRoutes = require('./routes/voucher');
const reviewRoutes = require('./routes/review');
const orderRoutes = require('./routes/order');
const productCategoryRoutes = require('./routes/product_category');
const productRoutes = require('./routes/product');
const sessionRoutes = require('./routes/session');
const userDetailRoutes = require('./routes/user_detail');
const userRoutes = require('./routes/user');

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
app.use("/voucher", voucherRoutes);
app.use("/review", reviewRoutes);
app.use("/order", orderRoutes);
app.use("/productCategory", productCategoryRoutes);
app.use("/product", productRoutes);
app.use("/session", sessionRoutes);
app.use("/userDetail", userDetailRoutes);
app.use("/user", userRoutes);

// send email on contact page
app.post('/send-email', async (req, res) => {
  try {
    let msg = req.body;
    const { data, error } = await resend.emails.send({
      from: 'ResendApp <onboarding@resend.dev>',
      to: "vincent4552@gmail.com",
      subject: "PCBUILD3R Contact Message",
      html: `
      <p><strong>Message Subject:</strong><br><br>${msg.subject}</p>
      <p><strong>Message Details:</strong><br><br>${msg.message}</p>
      <p><strong>From:</strong> ${msg.name} (${msg.email})</p>
      `,    
    });

    if (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});