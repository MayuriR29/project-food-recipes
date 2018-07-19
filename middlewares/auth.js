const Recipe = require("../models/recipe");

const rejectRequestIfIdsDontMatch = async (req, res, next) => {
  //todo: find better way to find recipe by id
  const requestedRecipe = await Recipe.find({
    _id: req.params.recipeId
  });
console.log('in auth user_id',requestedRecipe);
console.log('requestedRecipe[0].contributorId',requestedRecipe[0].contributorId);
  if (requestedRecipe[0].contributorId == req.user.id) {
    next();
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
};

module.exports = {
  rejectRequestIfIdsDontMatch
};
