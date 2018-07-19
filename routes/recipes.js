const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const { passport } = require("../config/passport");
const validationErr = require("../middlewares/mongooseErrorMiddleware");
const {
  authenticateUser,
  rejectRequestIfIdsDontMatch
} = require("../middlewares/auth");
router.use(express.json());

//GET recipe listing
router.get("/", async (req, res, next) => {
  try {
    const recipes = await Recipe.find().populate("contributorId");
    res.json(recipes).status(200);
  } catch (err) {
    console.error("Error occured in GET recipes ", err);

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
    next(err);
  }
});
//PUT recipes
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
   rejectRequestIfIdsDontMatch,
  async (req, res, next) => {
    try {
      await Recipe.findByIdAndUpdate(req.params.id, req.body);
      res.status(204).json();
    } catch (err) {
      console.error("Error in PUT recipes", err);
      next(err);
    }
  }
);
//DELETE recipes
router.delete("/:recipeId", async (req, res, next) => {
  try {
    await Recipe.findByIdAndDelete(req.params.recipeId, res.body);
    res.status(204).json();
  } catch (err) {
    console.err("Error in DELETE recipes", err);
    next(err);
  }
});

module.exports = app => {
  app.use("/recipes", router, validationErr);
};
