const Recipe = require("../models/recipe");

const rejectRequestIfIdsDontMatch = async (req, res, next) => {
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
