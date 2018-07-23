const Recipe = require("../models/recipe");

const rejectRequestIfIdsDontMatch = async (req, res, next) => {
  //todo: find better way to find recipe by id
  const requestedRecipe = await Recipe.findById(req.params.recipeId);
  if (requestedRecipe.contributorId == req.user.id) {
    next();
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
};

module.exports = {
  rejectRequestIfIdsDontMatch
};
