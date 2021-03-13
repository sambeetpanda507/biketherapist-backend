const jwt = require("jsonwebtoken");
const Users = require("../models/users");
require("dotenv").config();

async function auth(req, res, next) {
  try {
    // get jwt from cookie
    const token = req.cookies.jwt;
    console.log("token : ", token);
    //is token present
    if (!token) {
      const err = new Error();
      err.message = "Unauthorised";
      err.statusCode = 403;
      return res.json(err);
    }
    //verify the token with jwt secret
    const validate = jwt.verify(token, process.env.JWT_SECTETKEY);
    const userId = validate.userId;
    //verify the token with db
    const isUserValid = await Users.findOne({ _id: userId, jwtToken: token });
    //is valid
    if (!isUserValid) {
      const err = new Error();
      err.message = "Unauthorised";
      err.statusCode = 403;
      return res.json(err);
    }
    next();
  } catch (err) {
    console.log("catch block called ", err);
    res.status(403).json({
      message: "Unauthorised",
      error: err,
    });
  }
}

module.exports = auth;
