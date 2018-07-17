const request = require("supertest");
const express = require("express");
const recipesRouter = require("./recipes");
const Recipe = require("../models/recipe");
const User = require("../models/user");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = express();
let user1Saved, user2Saved, recipe1Saved, recipe2Saved;
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
  recipe1Saved = await recipe1.save();
  recipe2Saved = await recipe2.save();
}
beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});
beforeEach(async () => {
  mongoose.connection.db.dropDatabase();
  await addTempRecipes();
});
afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});
test("1 test /GET recipes", async () => {
  const response = await request(app).get("/recipes");
  const recipes=await Recipe.find()
  expect(response.status).toBe(200);
  expect(response.body.length).toEqual(2);
});
test("2 test /POST recipes", async () => {
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
test("3 test /PUT recipes", async () => {
  const updateRecipe = { title: "very Veggie Pizza" };
  const response = await request(app)
    .put("/recipes/" + recipe2Saved._id)
    .send(updateRecipe);
  expect(response.status).toBe(204);
  const updatedRecipe = await Recipe.findById(recipe2Saved._id);
  expect(updatedRecipe.title).toBe(updateRecipe.title);
});
test("4 test /DELETE recipes", async () => {
  const response = await request(app).delete("/recipes/" + recipe1Saved._id);
  expect(response.status).toBe(204);
  const deletedRecipe = await Recipe.findById(recipe1Saved._id);
  expect(deletedRecipe).toBeNull;
});
