const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { handle404, handle500 } = require("./middlewares/error_handlers");
const { saveRecipes } = require("./seedData");
const mongodb_uri =
  process.env.MONGODB_URI || "mongodb://localhost/mongoDB-recipes";

mongoose.connect(mongodb_uri);
const db = mongoose.connection;
db.on("error", () => {
  console.error("An error has occured====>");
});

db.on("open", async () => {
  try {
    await mongoose.connection.db.dropCollection("recipes");
    await mongoose.connection.db.dropCollection("users");
    saveRecipes();
  } catch (err) {
    console.error("users collection drop: failed");
  }
});

const users = require("./routes/users");
const recipes = require("./routes/recipes");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json("Hello From Recipe API ");
});

users(app);
recipes(app);

app.use(handle404);
app.use(handle500);

module.exports = app;
