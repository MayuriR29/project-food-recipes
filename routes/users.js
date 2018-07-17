const express = require("express");
const router = express.Router();
const User = require("../models/user");
router.use(express.json());
//GET user listing
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users).status(200);
  } catch (err) {
    console.error("Error occured in get users", err);
    next(err);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const findUserById = await User.findById(req.params.id);
    res.json(findUserById).status(200);
  } catch (err) {
    console.error("Error occured in GET user by id", err);
    next(err);
  }
});
//Post user
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
    console.error("Error occured in POST user", err);
    next(err);
  }
});
//PUT user
router.put("/:id", async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(204).json();
  } catch (err) {
    console.error("Error occured in PUT user", err);
    next(err);
  }
});

module.exports = app => {
  app.use("/users", router);
};
