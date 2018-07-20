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
      password: "1234",
      age: 54,
      bio:
        "Sanjeev Kapoor is an Indian celebrity chef, entrepreneur and television personality. Kapoor stars in the TV show Khana Khazana, which is the longest running show of its kind in Asia; it broadcasts in 120 countries and in 2010 had more than 500 million viewers"
    },
    {
      username: "VikasKhanna",
      password: "1234",
      age: 46,
      bio:
        "Vikas Khanna is an Indian American chef, restaurateur, and cookbook writer, filmmaker, humanitarian and the judge of MasterChef India Season 2, 3, 4, 5 and Masterchef Junior. He is based in New York "
    },
    {
      username: "GordonRamsay",
      password: "1234",
      age: 51,
      bio:
        "Gordon James Ramsay Jr. is a British chef, restaurateur, and television personality. Born in Scotland, Ramsay grew up in Stratford-upon-Avon. His restaurants have been awarded 16 Michelin stars in total. His signature restaurant, Restaurant Gordon Ramsay in Chelsea, London, has held three Michelin stars since 2001 "
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
    },
    {
      title: "Roast Chicken Recipe",
      contributorId: savedUsers[2]._id,
      comments: [
        { body: "very healthy recipe", date: "12-08-18" },
        { body: "add more recipes", date: "12-09-18" }
      ],
      ingredients: [
        { quantity: "1 cup", name: "chicken" },
        { quantity: "1 spoon", name: "butter" },
        { quantity: "1 spoon", name: "olive oil" }
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
