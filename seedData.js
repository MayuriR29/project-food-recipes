const User = require("./models/user");
const Recipe = require("./models/recipe");

async function doesUserExist(user) {
  const users = await User.findOne({ username: user.username });
  if (users) return true;
  return false;
}

async function saveUsers() {
  const users = [
    {
      username: "SanjeevKapoor",
      password: "1234"
    },
    {
      username: "VikasKhanna",
      password: "1234"
    }
  ];

  const savedUsers = users.map(async user => {
    const userExists = await doesUserExist(user);
    if (!userExists) {
      const newUser = new User(user);
      newUser.setPassword(user.password);
      return newUser.save();
    }
  });

  return await Promise.all(savedUsers);
}

async function saveRecipes() {
  const savedUsers = await saveUsers();
  console.log("in seed", savedUsers);
  const recipes = [
    {
      title: "Veg Biryani",
      contributorId: savedUsers[0]._id,
      comments: [
        { body: "very good recipe", date: "12-08-18" },
        { body: "add more recipes", date: "12-09-18" }
      ],
      ingredients: [
        { quantity: "1 cup", name: "rice" },
        { quantity: "2 cups", name: "veggies" }
      ]
    },
    {
      title: "Palak Paneer",
      contributorId: savedUsers[1]._id,
      comments: [
        { body: "very healthy recipe", date: "12-08-18" },
        { body: "add more recipes", date: "12-09-18" }
      ],
      ingredients: [
        { quantity: "1 cup", name: "spinach" },
        { quantity: "2 cups", name: "paneer" }
      ]
    }
  ];

  const savedRecipes = recipes.map(recipe => {
    const newRecipe = new Recipe(recipe);
    return newRecipe.save();
  });

  return await Promise.all(savedRecipes);
}

module.exports = { saveRecipes };
