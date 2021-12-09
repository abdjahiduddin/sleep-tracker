const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");

const User = require("../models/user");

const routes = express.Router();

routes.post(
  "/signup",
  [
    body("email", "Please enter valid email")
      .isEmail()
      .normalizeEmail()
      .trim()
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("E-mail already exist. Try another one!");
          }
        });
      }),
    body("username", "Please enter username with at least 6 character")
      .isLength({ min: 5 })
      .trim()
      .not()
      .isEmpty(),
    body("password", "Please enter password with at least 6 character")
      .isLength({ min: 5 })
      .trim()
      .not()
      .isEmpty(),
    body("password-confirmation")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password not match");
        }
        return true;
      }),
  ],
  authController.signup
);

routes.post("/verify", authController.verify);

routes.post(
  "/login",
  [
    body("email", "Invalid email or password")
      .isEmail()
      .trim()
      .normalizeEmail(),
    body("password", "Invalid email or password")
      .isLength({ min: 5 })
      .trim()
      .not()
      .isEmpty(),
  ],
  authController.login
);

routes.get("/refresh-token", authController.refreshCredentials)

routes.get("/logout", authController.logout)

module.exports = routes;
