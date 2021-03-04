const mongoose = require("mongoose");
require("dotenv").config();
const dbUri = process.env.DB_URI;
const db = mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
module.exports = db;
