const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
    },
    dob: {
      type: String,
    },
    isLoggedIn: {
      type: Boolean,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpiration: {
      type: Date,
    },
    jwtToken: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
