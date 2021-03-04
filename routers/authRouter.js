const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const router = express.Router();

//http://localhost:8080/api/
router.get("/", authController.getHome);

//http://localhost:8080/api/signup
router.post(
  "/signup",
  [
    body("name", "please enter a valid name").notEmpty(),
    body("email", "please enter a valid email")
      .trim()
      .normalizeEmail()
      .isEmail(),
    body("phone", "please enter a valid phone number")
      .trim()
      .isInt()
      .isLength({ min: 10, max: 10 }),
    body(
      "password",
      "password must containe atleast one number and one symbol with min 8 charactes"
    )
      .trim()
      .notEmpty()
      .isLength({ min: 8 })
      .isAlphanumeric(),
  ],
  authController.postSignup
);

// http://localhost:8080/api/signin
router.post(
  "/signin",
  [
    body("email", "Invalid email or password !!!")
      .trim()
      .normalizeEmail()
      .isEmail(),
    body("password", "Invalid email or password !!!")
      .trim()
      .notEmpty()
      .isLength({ min: 8 })
      .isAlphanumeric(),
  ],
  authController.postSignin
);

// http://localhost:8080/api/forgot
router.post(
  "/forgot",
  [
    body("email", "please enter a valid email address.")
      .isEmail()
      .normalizeEmail()
      .notEmpty(),
  ],
  authController.postForgot
);

// http://localhost:8080/api/reset/23489374892
router.patch(
  "/reset/:resetToken",
  [
    body("email", "please enter a valid email")
      .trim()
      .normalizeEmail()
      .isEmail(),
    body(
      "password",
      "password must containe atleast one number and one symbol with min 8 charactes"
    )
      .trim()
      .notEmpty()
      .isLength({ min: 8 })
      .isAlphanumeric(),
  ],
  authController.patchReset
);

// http://localhost:8080/api/logout
router.get("/logout", authController.getLogout);
module.exports = router;
