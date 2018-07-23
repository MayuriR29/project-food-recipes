const User = require("../models/user");

const returnAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users).status(200);
  } catch (err) {
    console.error("Error occured in get users", err);
    next(err);
  }
};

const returnUserById = async (req, res, next) => {
  try {
    const findUserById = await User.findById(req.params.id);
    res.json(findUserById).status(200);
  } catch (err) {
    console.error("Error occured in GET user by id", err);
    next(err);
  }
};

const createUser = async (req, res, next) => {
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
};

module.exports = {
  returnAllUsers,
  returnUserById,
  createUser
};
