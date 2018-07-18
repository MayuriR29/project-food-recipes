const request = require("supertest");
const express = require("express");
const usersRouter = require("../routes/users");
const User = require("../models/user");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = express();
let user1Saved, user2Saved;
usersRouter(app);

async function addTempUsers() {
  const user1 = new User({
    username: "user1",
    password: "secretPassword1",
    age: 30,
    bio: "I am expert chef"
  });

  user1Saved = await user1.save();
  const user2 = new User({
    username: "user2",
    password: "secretPassword2",
    age: 35,
    bio: "I am very expert chef"
  });
  user2Saved = await user2.save();
}

beforeAll(async () => {
  jest.setTimeout(12000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  mongoose.connection.db.dropDatabase();
  await addTempUsers();
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test.skip("test protected routes /PUT user", async () => {
  const updateUser = { bio: "I am expert chef of all cuisines" };
  const response = await request(app)
    .put("/users/signin/")
    .send(updateUser);
  const updatedUser = await User.findById(user1Saved._id);
  expect(response.status).toBe(204);
  expect(updatedUser.bio).toEqual(updateUser.bio);
});

test("dumy", () => {
  expect(1).toBe(1);
});
