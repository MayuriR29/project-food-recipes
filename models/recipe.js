const mongoose = require("mongoose");
const User = require("../models/user");
const recipeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  contributorId: {
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
const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
