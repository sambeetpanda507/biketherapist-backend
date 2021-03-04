const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Users = require("../models/users");
require("dotenv").config();

//post get home
module.exports.getHome = (req, res, next) => {
  res.send("this is a hi from controller");
};

//post signup controller
module.exports.postSignup = async (req, res, next) => {
  try {
    //error check:pending
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(422).json({
        msg: validationErr.array()[0].msg,
        param: validationErr.array()[0].param,
      });
    }
    //error check:passed -- checking for already exist user
    const isExist = await Users.findOne({ email: req.body.email });
    if (isExist) {
      return res.status(422).json({
        msg: "account already exist. Please choose a different one",
      });
    }
    //hashing the password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    if (!hashedPassword) {
      return res.status(500).json({
        msg: "Internal server error.",
      });
    }
    //storing user information to db
    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      displayName: req.body.displayName,
      password: hashedPassword,
    });
    const isSaved = await user.save();
    //checking for any error in saving user info
    if (!isSaved) {
      return res.status(500).json({
        msg: "Internal server error.",
      });
    }
    //sending response
    res.status(201).send("successfully signup");
  } catch (err) {
    res.status(500).json({
      msg: err,
    });
  }
};

//post signin controller
module.exports.postSignin = async (req, res, next) => {
  try {
    //checking validation error
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(422).json({
        msg: validationErr.array()[0].msg,
        param: validationErr.array()[0].param,
      });
    }
    //checking whether the email and the password is correct or not
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        msg: "Invalid email or password !!!",
      });
    }
    //comparing hashed password
    const hashedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!hashedPassword) {
      return res.status(401).json({
        msg: "Invalid email or password !!!",
      });
    }
    //email && password checked
    //generation jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECTETKEY, {
      expiresIn: "30 min",
    });
    //checking for any error in token generation
    if (!token) {
      return res.status(500).json({
        msg: "Internal server error.",
      });
    }
    //updating the user and adding jwt token
    const isSaved = await Users.updateOne(
      { _id: user._id },
      { $set: { jwtToken: token } }
    );
    //checking for a valid use update
    if (!isSaved) {
      return res.status(500).json({
        msg: "Internal server error.",
      });
    }
    //sending response with a httpOnly cookie which contains the jwt token
    res
      .status(200)
      .cookie("jwt", token, {
        sameSite: "strict",
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 3),
        httpOnly: true,
      })
      .json({ userId: user._id });
  } catch (err) {
    res.status(500).json({
      msg: err,
    });
  }
};

//post forgot controller
module.exports.postForgot = async (req, res, next) => {
  try {
    // checking input validation error
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(422).json({
        msg: validationErr.array()[0].msg,
        param: validationErr.array()[0].param,
      });
    }
    //checking if the user is genuine or not
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        msg: "Invalid email address!!!",
      });
    }
    //creating a reset token
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        return res.status(500).json({
          msg: "Internal server error.",
        });
      }
      //reset token has successfully created
      const resetToken = buffer.toString("hex");
      // updating the user with reset token
      const setToken = await Users.updateOne(
        { email: req.body.email },
        {
          $set: {
            passwordResetToken: resetToken,
            passwordResetTokenExpiration: new Date(Date.now() + 1000 * 60 * 15),
          },
        }
      );
      if (!setToken) {
        return res.status(500).json({
          msg: "Internal server error.",
        });
      }
    });
    //sending email to the user with the reset token
    //there should be an actual email sending method
    setTimeout(() => {
      res
        .status(200)
        .send(
          `An email with the instructions has been send to ${req.body.email}`
        );
    }, 5000);
  } catch (err) {
    res.status(500).json({
      msg: err,
    });
  }
};

//patch reset controller
module.exports.patchReset = async (req, res, next) => {
  try {
    // validation result
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(422).json({
        msg: validationErr.array()[0].msg,
        param: validationErr.array()[0].param,
      });
    }
    // checking for a valid user and validating the token
    const user = await Users.findOne({
      email: req.body.email,
      passwordResetToken: req.params.resetToken,
      passwordResetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(401).json({
        msg: "please enter a valid email or the link has been expired.",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    if (!hashedPassword) {
      return res.status(500).json({
        msg: "Internal server error.",
      });
    }
    // updating user and storing new password
    const updatedUser = await Users.updateOne(
      { email: req.body.email },
      {
        $set: {
          password: hashedPassword,
          passwordResetToken: "",
          passwordResetTokenExpiration: Date.now(),
        },
      }
    );
    if (!updatedUser) {
      return res.status(500).json({
        msg: "Internal server error.",
      });
    }
    res.status(201).json({
      message: "password reset successfull",
    });
  } catch (err) {
    res.status(500).json({
      msg: err,
    });
  }
};

// get logout controller
module.exports.getLogout = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("token : ", token);
    const verified = jwt.verify(token, process.env.JWT_SECTETKEY);
    const userId = verified.userId;
    const user = await Users.updateOne(
      { _id: userId },
      { $set: { jwtToken: "" } }
    );
    if (!user) {
      return res.status(500).json({
        msg: "Internal server error.",
      });
    }

    res
      .status(200)
      .clearCookie("jwt")
      .json({ message: "successfully logged out" });
  } catch (err) {
    res.status(500).json({
      msg: err,
    });
  }
};
