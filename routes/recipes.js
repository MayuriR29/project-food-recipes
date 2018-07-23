const express = require("express");
const router = express.Router();

const recipeService = require('../middlewares/recipeService');

const { passport } = require("../config/passport");
const validationErr = require("../middlewares/mongooseErrorMiddleware");
const { rejectRequestIfIdsDontMatch } = require("../middlewares/auth");
router.use(express.json());

//GET recipe listing
router.get("/", recipeService.returnRecipesWithContributor);

//POST recipes
router.post("/", recipeService.addRecipe);

//PUT recipes
router.put(
  "/:recipeId",
  passport.authenticate("jwt", { session: false }),
  rejectRequestIfIdsDontMatch,
  recipeService.updateRecipe
);
//DELETE recipes
router.delete(
  "/:recipeId",
  passport.authenticate("jwt", { session: false }),
  rejectRequestIfIdsDontMatch,
  recipeService.deleteRecipe
);

module.exports = app => {
  app.use("/recipes", router, validationErr);
};
