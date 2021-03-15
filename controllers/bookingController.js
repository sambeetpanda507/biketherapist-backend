const Customer = require("../models/customer");
const { validationResult } = require("express-validator");
const { db } = require("../models/customer");

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
      variant,
      bookingDate,
      bookingTime,
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

    const customer = new Customer({
      brand,
      variant,
      bookingDate,
      bookingTime,
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
      status: "pending",
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
    res.status(500).json({
      msg: err,
    });
  }
};

module.exports.getClients = async (req, res, next) => {
  try {
    const clients = await Customer.find({});
    if (!clients) {
      return res.status(500).json({ msg: "internal server error !!!" });
    }
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({
      msg: err,
    });
  }
};

module.exports.patchStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.query;
    //check id present in db or not
    const user = await Customer.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ msg: "user for this id does not found" });
    }
    const updateStatus = await Customer.updateOne(
      { _id: user._id },
      { $set: { status: status } }
    );
    if (!updateStatus) {
      return res.status(500).send("internal server error");
    }
    res.status(201).json({ msg: "status updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};

module.exports.postValidateBooking = async (req, res, next) => {
  try {
    // validation result
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(422).json({
        msg: validationErr.array()[0].msg,
        param: validationErr.array()[0].param,
      });
    }

    const { email } = req.body;
    //check whether there is already a booking or not

    const isPresent = await Customer.findOne({ email: email });

    if (isPresent) {
      return res.status(403).json({ msg: "you already have a booking !!!" });
    }

    res.status(200).send("ok");
  } catch (error) {
    console.log(error);

    return res.status(500).send("internal server error");
  }
};
