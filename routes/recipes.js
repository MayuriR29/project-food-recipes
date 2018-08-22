const express = require("express");
const Recipe = require("../models/recipe");

const { passport } = require("../config/passport");
const validationErr = require("../middlewares/mongooseErrorMiddleware");
const { rejectRequestIfIdsDontMatch } = require("../middlewares/auth");

const asyncFunctionErrorWrapper = require("../utils/asyncFunctionErrorWrapper");

const router = express.Router();
router.use(express.json());

//GET recipe listing
router.get(
  "/",
  asyncFunctionErrorWrapper(async (req, res, next) => {
    const recipes = await Recipe.find().populate("contributorId");
    res.json(recipes).status(200);
  })
);

router.post(
  "/",
  asyncFunctionErrorWrapper(async (req, res, next) => {
    const newRecipe = new Recipe({
      title: req.body.title,
      contributorId: req.body.contributorId,
      comments: req.body.comments,
      ingredients: req.body.ingredients
    });
    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully" });
  })
);

router.put(
  "/:recipeId",
  passport.authenticate("jwt", { session: false }),
  rejectRequestIfIdsDontMatch,
  asyncFunctionErrorWrapper(async (req, res, next) => {
    try {
      await Recipe.findByIdAndUpdate(req.params.recipeId, req.body);
      res.status(204).json();
    } catch (err) {
      console.error("Error in PUT recipes", err);
      next(err);
    }
  })
);
//DELETE recipes
router.delete(
  "/:recipeId",
  passport.authenticate("jwt", { session: false }),
  rejectRequestIfIdsDontMatch,
  asyncFunctionErrorWrapper(async (req, res, next) => {
    try {
      await Recipe.findByIdAndDelete(req.params.recipeId, res.body);
      res.status(204).json();
    } catch (err) {
      console.err("Error in DELETE recipes", err);
      next(err);
    }
  })
);

module.exports = app => {
  app.use("/recipes", router, validationErr);
};
