const express = require("express");
const { passport, jwtOptions } = require("../config/passport");
const router = express.Router();
const User = require("../models/user");
const validationErr = require("../middlewares/mongooseErrorMiddleware");
const jwt = require("jsonwebtoken");

router.use(express.json());
router.use(passport.initialize());
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
//Post user ,signup
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password, age, bio } = req.body;
    const newUser = new User({
      username,
      age,
      bio
    });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error occured in POST user", err);
    next(err);
  }
});
// POST login
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(401).json({ message: "no such user found" });
  }
  if (user.validPassword(password)) {
    const userId = { id: user.id };
    const token = jwt.sign(userId, jwtOptions.secretOrKey);
    res.status(200).json({ message: "ok", token: token });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
});
//PUT user
router.put(
  "/editUserDetails/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      await User.findByIdAndUpdate(req.user.id, req.body);
      res.status(204).json();
    } catch (err) {
      console.error("Error occured in PUT user", err);
      next(err);
    }
  }
);
//DELETE user
router.delete(
  "/deleteAccount/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.user.id, req.body);
      res.status(204).json();
    } catch (err) {
      console.error("Error occured in DELETE user", err);
    }
  }
);
module.exports = app => {
  app.use("/users", router, validationErr);
};
