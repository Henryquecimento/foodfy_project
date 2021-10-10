const { hash } = require('bcrypt');

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
let TotalRecipes = 12;

async function CreateUser() {
  let users = [];

  const password = await hash('101010', 8);

  while (users.length < TotalUsers) {

    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: password,
      is_admin: Math.random() < 0.5, //50% probability of getting true
    });
  }

  const usersPromise = users.map(user => User.create(user));

  usersIds = await Promise.all(usersPromise);

}

async function init() {
  await CreateUser();
}
