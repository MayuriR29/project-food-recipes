const request = require("supertest");
const express = require("express");
const usersRouter = require("../routes/users");
const User = require("../models/user");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = express();
const testPassword = "password";
let user1Saved, user2Saved;
usersRouter(app);

async function addTempUsers() {
  const user1 = new User({
    username: "user1",
    age: 30,
    bio: "I am expert chef"
  });
  user1.setPassword(testPassword);

  user1Saved = await user1.save();
  const user2 = new User({
    username: "user2",
    age: 35,
    bio: "I am very expert chef"
  });
  user2.setPassword(testPassword);
  user2Saved = await user2.save();
}

beforeAll(async () => {
  jest.setTimeout(8000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
  await addTempUsers();
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("dummy", () => {
  expect(1).toBe(1);
});

test("1 test /GET users", async () => {
  const response = await request(app).get("/users");
  const users = await User.find();
  expect(response.status).toBe(200);
  expect(response.body.length).toEqual(users.length);
});

test("2 test /GET users by ID", async () => {
  const response = await request(app).get("/users/" + user2Saved._id);
  expect(response.status).toBe(200);
  expect(response.body.username).toEqual(user2Saved.username);
});

test("3 test /POST user", async () => {
  const newUser = {
    username: "user7",
    password: "secret",
    age: 42,
    bio: "I m expert chef"
  };
  const response = await request(app)
    .post("/users/signup")
    .send(newUser);
  expect(response.status).toBe(201);
  const userCreated = await User.find({ username: "user7" });
  expect(userCreated.length).toBe(1);
  expect(userCreated).toBeDefined();
});

test("4 test for invalid password /POST user", async () => {
  console.log("in test 4");
  let passwordTest = "wrongpwd";
  const response = await request(app)
    .post("/users/signin")
    .send({ username: user1Saved.username, password: passwordTest });
  expect(response.status).toBe(401);
  expect(response.body).toEqual({ message: "passwords did not match" });
});

// test("4 test /PUT user", async () => {
//   const updateUser = { bio: "I am expert chef of all cuisines" };
//   const response = await request(app)
//     .put("/users/signin/" + user1Saved._id)
//     .send(updateUser);
//   const updatedUser = await User.findById(user1Saved._id);
//   expect(response.status).toBe(204);
//   expect(updatedUser.bio).toEqual(updateUser.bio);
// });

// test("5 test /DELETE user", async () => {
//   const response = await request(app).delete("/users/signin/" + user2Saved._id);
//   const deletedUser = await User.findById(user2Saved._id); //if deleted returns null
//   expect(response.status).toBe(204);
//   expect(deletedUser).toBeNull;
// });
