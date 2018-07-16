const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mongodb_uri =
  process.env.MONGODB_URI || "mongodb://localhost/mongoDB-recipes";

mongoose.connect(mongodb_uri);
const db = mongoose.connection;
db.on("error", () => {
  console.error("An error has occured====>");
});
const users = require("./routes/users");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  res.json("Hello From Recipe API ");
});
users(app);

module.exports = app;
