const express = require("express");
const asyncFunctionErrorWrapper = require("../utils/asyncFunctionErrorWrapper");
const router = express.Router();

const userService = require('../middlewares/userService');

const User = require("../models/user");
const validationErr = require("../middlewares/mongooseErrorMiddleware");
const jwt = require("jsonwebtoken");
const { passport, jwtOptions } = require("../config/passport");

router.use(express.json());
router.use(passport.initialize());

//GET user listing
router.get("/", userService.returnAllUsers);
router.get("/:id", userService.returnUserById);

//Post user ,signup
router.post("/signup", userService.createUser);
router.get(
  "/",
  asyncFunctionErrorWrapper(async (req, res, next) => {
    const users = await User.find();
    res.json(users).status(200);
  })
);
router.get(
  "/:id",
  asyncFunctionErrorWrapper(async (req, res, next) => {
    const findUserById = await User.findById(req.params.id);
    res.json(findUserById).status(200);
  })
);
//Post user ,signup
router.post(
  "/signup",
  asyncFunctionErrorWrapper(async (req, res, next) => {
    const { username, password, age, bio } = req.body;
    const newUser = new User({
      username,
      age,
      bio
    });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  })
);
// POST login
router.post(
  "/signin",
  asyncFunctionErrorWrapper(async (req, res) => {
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
  })
);
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
  asyncFunctionErrorWrapper(async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.user.id, req.body);
      res.status(204).json();
    } catch (err) {
      console.error("Error occured in DELETE user", err);
    }
  })
);
module.exports = app => {
  app.use("/users", router, validationErr);
};
