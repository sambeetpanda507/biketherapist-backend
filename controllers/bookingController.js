const Customer = require("../models/customer");
const { validationResult } = require("express-validator");
module.exports.postBooking = async (req, res, next) => {
  try {
    // validation result
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(422).json({
        msg: validationErr.array()[0].msg,
        param: validationErr.array()[0].param,
      });
    }
    const {
      brand,
      varient,
      bookingDate,
      name,
      email,
      phone,
      houseNumber,
      streetNumber,
      city,
      state,
      postalCode,
      dob,
      note,
    } = req.body;
    //check whether there is already a booking or not
    const isPresent = await Customer.findOne({ email: email, phone: phone });
    if (isPresent) {
      return res.status(200).json({ msg: "you already have a booking !!!" });
    }
    const customer = new Customer({
      brand,
      varient,
      bookingDate,
      name,
      email,
      phone,
      houseNumber,
      streetNumber,
      city,
      state,
      postalCode,
      dob,
      note,
    });
    const isSaved = await customer.save();
    if (!isSaved) {
      return res.status(500).json({
        msg: "Internal server error.",
      });
    }
    res.status(201).json({
      msg: "booked successfully",
    });
  } catch (err) {
    //TODO: remove clg
    console.log(err);
    res.status(500).json({
      msg: err,
    });
  }
};
