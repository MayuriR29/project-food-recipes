const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
router.use(express.json());
//GET recipe listing
router.get("/", async (req, res, next) => {
  try {
    const recipes = await Recipe.find().populate("contributorId");
    res.json(recipes).status(200);
  } catch (err) {
    console.error("Error occured in GET recipes ", error);
    next(err);
  }
});

//POST recipes
router.post("/", async (req, res, next) => {
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
    console.error("Error in POST recipes", err);
    next(err);
  }
});
//PUT recipes
router.put("/:id", async (req, res, next) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.id, req.body);
    res.status(204).json();
  } catch (err) {
    console.error("Error in PUT recipes", err);
    next(err);
  }
});
module.exports = app => {
  app.use("/recipes", router);
};
