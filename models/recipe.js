const mongoose = require("mongoose");
const User = require("../models/user");
const recipeSchema = mongoose.Schema({
  title: String,
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator(idUser) {
        return User.findById(idUser);
      }
    }
  },
  comments: [{ body: String, date: Date }],
  ingredients: [{ quantity: String, name: String }]
});
module.exports = recipeSchema;
