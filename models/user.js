const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "cannot be blank"],
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    index: true
  },
  age: Number,
  bio: String
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
