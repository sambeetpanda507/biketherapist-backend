const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    houseNumber: {
      type: Number,
      required: true,
    },
    streetNumber: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("customers", customerSchema);
