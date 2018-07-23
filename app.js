const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { handle404, handle500 } = require("./middlewares/error_handlers");
const { saveRecipes } = require("./seedData");
const User = require("./models/user");
const Recipe = require("./models/recipe");
const mongodb_uri =
  process.env.MONGODB_URI || "mongodb://localhost/mongoDB-recipes";

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

mongoose.connect(mongodb_uri);
const db = mongoose.connection;
db.on("error", () => {
  console.error("An error has occured====>");
});

db.on("connected", async () => {
  if (
    (await User.countDocuments()) == 0 &&
    (await Recipe.countDocuments()) == 0
  ) {
    console.log("database is empty, seeding data");
    saveRecipes();
  } else {
    console.log("database not empty, not seeding data");
  }
});
const users = require("./routes/users");
const recipes = require("./routes/recipes");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  res.json("Hello From Recipe API ");
});

users(app);
recipes(app);

app.use(handle404);
app.use(handle500);

module.exports = app;
