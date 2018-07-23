const Recipe = require("../models/recipe");

const returnRecipesWithContributor = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().populate("contributorId");
    res.json(recipes).status(200);
  } catch (err) {
    console.error("Error occured in GET recipes ", err);
    next(err);
  }
};

const addRecipe = async (req, res, next) => {
  try {
    const newRecipe = new Recipe({
      title: req.body.title,
      contributorId: req.body.contributorId,
      comments: req.body.comments,
      ingredients: req.body.ingredients
    });
    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully" });
  } catch (err) {
    next(err);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.recipeId, req.body);
    res.status(204).json();
  } catch (err) {
    console.error("Error in PUT recipes", err);
    next(err);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    await Recipe.findByIdAndDelete(req.params.recipeId, res.body);
    res.status(204).json();
  } catch (err) {
    console.error("Error in DELETE recipes", err);
    next(err);
  }
};

module.exports = {
  returnRecipesWithContributor,
  addRecipe,
  updateRecipe,
  deleteRecipe
};
