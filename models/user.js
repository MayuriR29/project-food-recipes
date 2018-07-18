const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "cannot be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    age: Number,
    bio: String,
    hash: String,
    salt: String
  },
  { timestamps: true }
);
UserSchema.plugin(uniqueValidator, { message: "should be unique" });

// use ES5 function to prevent `this` from becoming undefined
UserSchema.methods.setPassword = function(password) {
  this.salt = generateSalt();
  this.hash = hashPassword(password, this.salt);
};

// use ES5 function to prevent `this` from becoming undefined
UserSchema.methods.validPassword = function(password) {
  return this.hash === hashPassword(password, this.salt);
};

const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

const hashPassword = (password, salt) => {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
