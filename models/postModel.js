const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("posts", postSchema);
