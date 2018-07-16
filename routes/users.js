const express = require("express");
const router = express.Router();
const User = require("../models/user");
router.use(express.json());
//GET user listing
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error occured in getusers", err);
    next(err);
  }
});
console.log('in user router')
router.post("/", async (req, res, next) => {
  try {
    const newUser = new User({
      username: req.body.username,
      age: req.body.age,
      bio: req.body.bio
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.err("Error occured in POST user", err);
    next(err);
  }
});
module.exports = app => {
  app.use("/users", router);
};
