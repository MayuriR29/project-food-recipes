const request = require("supertest");
const express = require("express");
const recipesRouter = require("./recipes");
const Recipe = require("../models/recipe");
const User = require("../models/user");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = express();
let user1Saved, user2Saved;
recipesRouter(app);
async function addTempRecipes() {
  const user1 = new User({
    username: "user1",
    age: 30,
    bio: "I am expert chef of Chinese food"
  });
  const user2 = new User({
    username: "user2",
    age: 25,
    bio: "I am expert chef of Indian food"
  });
  user1Saved = await user1.save();
  user2Saved = await user2.save();
  const recipe1 = new Recipe({
    title: "Fried Rice",
    contributorId: user1Saved._id,
    comments: [{ body: "good recipe", date: "12-06-18" }]
  });
  const recipe2 = new Recipe({
    title: "Dal Rice",
    contributorId: user2Saved._id,
    comments: [{ body: "must try", date: "12-06-18" }]
  });
  await recipe1.save();
  await recipe2.save();
}
beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
  // await addTempRecipes();
});
beforeEach(async () => {
  mongoose.connection.db.dropDatabase();
  await addTempRecipes();
});
afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});
test("test GET recipes", async () => {
  const response = await request(app).get("/recipes");
  expect(response.status).toBe(200);
  expect(response.body.length).toEqual(2);
});
test("test POST recipes", async () => {
  const newRecipe = {
    title: "Veg Pizza",
    contributorId: user2Saved._id,
    comments: [{ body: "must try", date: "12-06-18" }]
  };
  const response = await request(app)
    .post("/recipes")
    .send(newRecipe);
  expect(response.status).toBe(201);
  const recipes = await Recipe.find();
  expect(recipes.length).toEqual(3);
});
