const express = require("express");
const { body } = require("express-validator");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// http://localhost:8080/api/booking
router.post(
  "/booking",
  [
    body("brand", "please enter the brand").notEmpty(),
    body("varient", "please enter the varient name").notEmpty(),
    body("bookingDate", "please enter a valid booking date")
      .notEmpty()
      .isISO8601()
      .toDate(),
    body("name", "Please enter your name").notEmpty(),
    body("email", "please enter a valid email address")
      .isEmail()
      .normalizeEmail()
      .notEmpty(),
    body("phone", "please enter a valid phone number")
      .trim()
      .isInt()
      .isLength({ min: 10, max: 10 }),
    body("houseNumber", "house number cant left empty")
      .trim()
      .isInt()
      .notEmpty(),
    body("streetNumber", "street number cant left empty")
      .trim()
      .isInt()
      .notEmpty(),
    body("city", "city cant left empty").trim().notEmpty(),
    body("state", "state field cant left empty").trim().notEmpty(),
    body("postalCode", "please enter a valid postal code")
      .trim()
      .isInt()
      .isLength({ min: 6, max: 6 }),
    body("dob", "please enter a valid date of birth")
      .notEmpty()
      .isISO8601()
      .toDate(),
  ],
  bookingController.postBooking
);

module.exports = router;
