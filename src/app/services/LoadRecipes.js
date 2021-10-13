const User = require('../models/User');
const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');

async function getImages(RecipeId) {

  let files = await Recipe.files(RecipeId);


  files = files.map(file => ({
    ...file,
    path: file.name,
    src: `${file.path.replace('public', "").replace(/\\/g, '/')}`
  }));

  return files;
}

async function format(recipe) {
  const files = await getImages(recipe.id);
  const chefs = await Chef.findOne({ where: { id: recipe.chef_id } });
  const users = await User.findOne({ where: { id: recipe.user_id } });

  if (files[0] != undefined) {
    recipe.img = files[0].src;
  } else {
    recipe.img = null;
  }

  recipe.files = files;
  recipe.img = files[0].path;
  recipe.filename = files[0].name;
  recipe.chef_name = chefs.name;
  recipe.user_admin = users.is_admin;

  return recipe;
}

const LoadRecipe = {
  load(service, filters) {
    this.filters = filters;

    return this[service]();
  },
  async recipe() {
    try {
      const recipe = await Recipe.findOne(this.filters);

      return format(recipe);
    } catch (err) {
      console.error(err);
    }
  },
  async recipes() {
    try {
      let recipes = await Recipe.findAll(this.filters);

      const recipesPromise = recipes.map(format);

      return Promise.all(recipesPromise);
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = {
  LoadRecipe
}