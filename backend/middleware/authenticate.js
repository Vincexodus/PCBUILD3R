const jwt = require('jsonwebtoken');
const User = require('../models/user.model')

// authenticate using JWT access token
module.exports = (req, res, next) => {
  let token = req.header('x-access-token');
  // console.log('Middleware Access: ', token);
  // verify the JWT
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
    if (err) {
      res.status(401).send(err);
      // next();
    } else {
          console.log('Authentication successsful');
          req.user_id = decoded._id;
          next();
      }
  });
}