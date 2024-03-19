const jwt = require('jsonwebtoken');
const User = require('../models/user.model')

// authenticate using JWT access token
module.exports = (req, res, next) => {
  let refresh= req.header('x-refresh-token');
  let token = req.header('x-access-token');
  let user = req.header('user-id');
  console.log("Refresh", refresh);
  console.log("Token", token);
  console.log("User", user);
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