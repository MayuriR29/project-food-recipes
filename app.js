const express = require("express");
const mongoose = require("mongoose");

const mongodb_uri =
  process.env.MONGODB_URI || "mongodb://localhost/mongoDB-books";

mongoose.connect(mongodb_uri);
const db = mongoose.connection;
db.on("error", () => {
  console.error("An error has occured====>");
});
const app = express();

app.get("/", (req, res, next) => {
  res.json("Hello Mayuri ");
});

module.exports = app;
