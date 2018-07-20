const request = require("supertest");
const express = require("express");
const usersRouter = require("../routes/users");
const User = require("../models/user");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");
const signIn = require("./signin");

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
  jest.setTimeout(15000);

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

test("3 test /POST successful signup of user", async () => {
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

test("4 test /POST  for successful signin of user ", async () => {
  const response = await request(app)
    .post("/users/signin")
    .send({ username: "user1", password: "password" });
  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
});

test("5 test for invalid password /POST user", async () => {
  let passwordTest = "wrongpwd";
  const response = await request(app)
    .post("/users/signin")
    .send({ username: "user1", password: passwordTest });
  expect(response.status).toBe(401);
  expect(response.body).toEqual({ message: "passwords did not match" });
});

test("6 test protected routes /PUT user", async () => {
  let signInResponse = await signIn(app, user1Saved.username, "password");
  let jwtToken = signInResponse.token;
  const updateUser = { bio: "I am expert chef of all cuisines" };
  const response = await request(app)
    .put("/users/editUserDetails/")
    .set("Authorization", "Bearer " + jwtToken)
    .send(updateUser);

  const updatedUser = await User.findById(user1Saved._id);
  expect(response.status).toBe(204);
  expect(updatedUser.bio).toEqual(updateUser.bio);
});

test("7 test /DELETE user", async () => {
  let signInResponse = await signIn(app, user2Saved.username, "password");
  let jwtToken = signInResponse.token;

  const response = await request(app)
    .delete("/users/deleteAccount/")
    .set("Authorization", "Bearer " + jwtToken);
  const deletedUser = await User.findById(user2Saved._id); //if deleted returns null
  expect(response.status).toBe(204);
  expect(deletedUser).toBeNull;
});
