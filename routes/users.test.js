const request = require("supertest");
const express = require("express");
const usersRouter = require("./users");
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
    age: 30,
    bio: "I am expert chef"
  });
  user1Saved = await user1.save();
  const user2 = new User({
    username: "user2",
    age: 35,
    bio: "I am very expert chef"
  });
  user2Saved = await user2.save();
}
beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
  await addTempUsers();
});
beforeEach(async () => {
  mongoose.connection.db.dropDatabase();
  await addTempUsers();
});
afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});
test("/GET users", async () => {
  const response = await request(app).get("/users");
  expect(response.status).toBe(200);
  expect(response.body.length).toEqual(2);
});
test("/POST user", async () => {
  const newUser = {
    username: "user2",
    age: 42,
    bio: "I m expert chef"
  };
  const response = await request(app)
    .post("/users")
    .send(newUser);
  expect(response.status).toBe(201);
  const users = await User.find();
  expect(users.length).toBe(3);
});
