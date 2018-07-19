const request = require("supertest");
const express = require("express");
const recipesRouter = require("../routes/recipes");
const userRouter = require("../routes/users");
const Recipe = require("../models/recipe");
const User = require("../models/user");
const signIn = require("./signin");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = express();
const testPassword = "password";
let user1Saved, user2Saved, recipe1Saved, recipe2Saved;

userRouter(app);
recipesRouter(app);
async function addTempRecipes() {
  const user1 = new User({
    username: "usertest1",
    age: 30,
    bio: "I am expert chef of Chinese food"
  });
  const user2 = new User({
    username: "usertest2",
    age: 25,
    bio: "I am expert chef of Indian food"
  });
  user1.setPassword(testPassword);
  user1Saved = await user1.save();

  user2.setPassword(testPassword);
  user2Saved = await user2.save();
  const user1Recipe = new Recipe({
    title: "Fried Rice",
    contributorId: user1Saved._id,
    comments: [{ body: "good recipe", date: "12-06-18" }]
  });
  const user2Recipe = new Recipe({
    title: "Dal Rice",
    contributorId: user2Saved._id,
    comments: [{ body: "must try", date: "12-06-18" }]
  });
  userRecipe1Saved = await user1Recipe.save();
  userRecipe2Saved = await user2Recipe.save();
}
beforeAll(async () => {
  jest.setTimeout(15000);

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
  const recipes = await Recipe.find();
  expect(response.status).toBe(200);
  expect(response.body.length).toEqual(recipes.length);
});
test("2 test /POST recipes", async () => {
  const newRecipe = {
    title: "Veg Pizza",
    contributorId: user2Saved._id,
    comments: [{ body: "must try", date: "12-06-18" }]
  };
  let signInResponse = await signIn(app, user2Saved.username, "password");
  let jwtToken = signInResponse.token;
  const response = await request(app)
    .post("/recipes")
    .set("Authorization", "Bearer " + jwtToken)
    .send(newRecipe);
  expect(response.status).toBe(201);
  const recipes = await Recipe.find();
  expect(recipes.length).toEqual(3);
});
test("3 test /PUT recipes", async () => {
  const updateRecipe = { title: "very Veggie Pizza" };
  let signInResponse = await signIn(app, user1Saved.username, "password");
  let jwtToken = signInResponse.token;
  const response = await request(app)
    .put("/recipes/" + userRecipe1Saved._id)
    .set("Authorization", "Bearer " + jwtToken)
    .send(updateRecipe);
  expect(response.status).toBe(204);
  const updatedRecipe = await Recipe.findById(userRecipe1Saved._id);
  expect(updatedRecipe.title).toBe(updateRecipe.title);
});
test("4 test /DELETE recipes", async () => {
  let signInResponse = await signIn(app, user1Saved.username, "password");
  let jwtToken = signInResponse.token;
  const response = await request(app)
    .delete("/recipes/" + userRecipe1Saved._id)
    .set("Authorization", "Bearer " + jwtToken);
  expect(response.status).toBe(204);
  const deletedRecipe = await Recipe.findById(userRecipe1Saved._id);
  expect(deletedRecipe).toBeNull;
});
