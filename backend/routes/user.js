const express = require("express");
const router = express.Router();
const verifySession = require("../middleware/verifySession");
const authenticate = require('../middleware/authenticate');

const User = require("../models/user.model");

// Get all users
router.get("", authenticate, (req, res) => {
  User.find({
  }).then((user) => {
    res.send(user);
  }).catch((e) => {
    res.send(e);
  })
});

// Get user by id
router.get("/:id", (req, res) => {
  User.find({
    _id: req.params.id
  }).then((user) => {
    res.send(user);
  }).catch((e) => {
    res.send(e);
  })
});

// Get user access-token with refresh-token
router.get("/me/access-token", verifySession, (req, res) => {
  // we know that the user/caller is authenticated and we have the user_id and user object available to us
  req.userObject.generateAccessAuthToken().then((accessToken) => {
      res.header("x-access-token", accessToken).send({ accessToken });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

// Update user password by id
router.post("/updatePassword/:id", authenticate, async (req, res) => {
  let passwordBody = req.body;
  User.verifyCredentials(req.params.id, passwordBody.currPassword)
  .then((user) => {
    user.password = passwordBody.newPassword;
    user.save();
    res.send({ message: "Password updated successfully" });
  })
  .catch((e) => {
    res.status(400).send(e);
  });
});

// User sign up
router.post("", (req, res) => {
  let body = req.body;
  let newUser = new User(body);
  newUser.save().then(() => {
      return newUser.createSession();
    })
    .then((refreshToken) => {
      // Session created successfully - refreshToken returned.

      return newUser.generateAccessAuthToken().then((accessToken) => {
        // access auth token generated successfully, now we return an object containing the auth tokens
        return { accessToken, refreshToken };
      });
    })
    .then((authTokens) => {
      // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
      res
        .header("x-refresh-token", authTokens.refreshToken)
        .header("x-access-token", authTokens.accessToken)
        .send(newUser);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

// User login
router.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  User.findByCredentials(email, password).then((user) => {
    return user.createSession().then((refreshToken) => {
          // Session created successfully - refreshToken returned.

          return user.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken };
          });
        })
        .then((authTokens) => {
          // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
          res
            .header("x-refresh-token", authTokens.refreshToken)
            .header("x-access-token", authTokens.accessToken)
            .send(user);
        });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

// Update basic user info
router.patch("/:id", authenticate, (req, res) => {
  let userInfo = req.body;
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: userInfo.name,
        email: userInfo.email,
        telephone: userInfo.telephone
      },
    }
  ).then(() => {
    res.send({ message: "User updated successfully" });
  });
});

// Delete user 
router.delete("/:id", authenticate, (req, res) => {
  User.findOneAndDelete({
    _id: req.params.id,
  }).then((removedDoc) => {
    res.send(removedDoc);
  });
});

module.exports = router;