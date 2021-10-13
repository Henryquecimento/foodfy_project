const { hash } = require('bcrypt');
const { date } = require('./src/lib/utils');

const faker = require('faker');

const User = require('./src/app/models/User');
const Chef = require('./src/app/models/Chef');
const Recipe = require('./src/app/models/Recipe');
const File = require('./src/app/models/File');
const RecipeFile = require('./src/app/models/Recipe_File');

let usersIds = []
let chefsIds = []
let recipesIds = []
let filesIds = []
let TotalUsers = 3;
let TotalChefs = 6;
let TotalRecipes = 6;
let TotalRecipeFiles = 25;

async function CreateUser() {
  let users = [];

  const password = await hash('101010', 8);

  while (users.length < TotalUsers) {

    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: password,
      is_admin: Math.random() < 0.8,
    });//80% probability of getting true
  }

  const usersPromise = users.map(user => User.create(user));

  usersIds = await Promise.all(usersPromise);

}

async function CreateChef() {
  let chefs = [];

  while (chefs.length < TotalChefs) {

    const fileId = await File.create({
      name: faker.image.image(),
      path: `public/images/placeholder.png`
    });

    chefs.push({
      name: faker.name.findName(),
      created_at: date(Date.now()).iso,
      file_id: fileId
    });
  }

  const chefsPromise = chefs.map(chef => Chef.create(chef));

  chefsIds = await Promise.all(chefsPromise);

}

async function CreateRecipe() {
  let recipes = [];
  let files = [];
  let recipesFiles = [];
  let ingredients = [];
  let preparation = [];

  while (files.length < TotalRecipeFiles) {

    files.push({
      name: faker.image.image(),
      path: `public/images/placeholder.png`
    });

  }

  const filesPromise = files.map(file => File.create(file));

  filesIds = await Promise.all(filesPromise);

  for (i = 0; i < 6; i++) {
    ingredients.push(faker.lorem.sentence(Math.ceil(Math.random() * 6)));
    preparation.push(faker.lorem.sentence(Math.ceil(Math.random() * 6)));
  }

  while (recipes.length < TotalRecipes) {

    recipes.push({
      chef_id: chefsIds[Math.floor(Math.random() * TotalChefs)],
      title: faker.commerce.productName(),
      ingredients: `{${ingredients}}`,
      preparation: `{${preparation}}`,
      information: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
      created_at: date(Date.now()).iso,
      user_id: usersIds[Math.floor(Math.random() * TotalUsers)]
    });

  }

  const recipesPromise = recipes.map(recipe => Recipe.create(recipe));

  recipesIds = await Promise.all(recipesPromise);

  while (recipesFiles.length < TotalRecipeFiles) {

    recipesFiles.push({
      recipe_id: recipesIds[Math.floor(Math.random() * TotalRecipes)],
      file_id: filesIds[Math.floor(Math.random() * TotalRecipeFiles)]
    });

  }

  const recipesFilesPromise = recipesFiles.map(recipeFile => RecipeFile.create(recipeFile));

  await Promise.all(recipesFilesPromise);

}

async function init() {
  await CreateUser();
  await CreateChef();
  await CreateRecipe();
}

init();