const Chef = require("../../models/Chef");
const Recipe = require("../../models/Recipe");

const { LoadChef } = require('../../services/LoadChefs');
const { LoadRecipe } = require("../../services/LoadRecipes");

module.exports = {
  async index(req, res) {
    try {
      const recipes = await LoadRecipe.load('recipes', {
        where: {
          user_id: req.session.userId
        }
      });

      return res.render("publicAccess/index", { recipes });
    } catch (err) {
      throw new Error(err);
    }
  },
  about(req, res) {
    return res.render("publicAccess/recipes/about");
  },
  async show(req, res) {
    try {
      let results = await Recipe.find(req.params.id);
      let recipe = results.rows[0];

      results = await Recipe.files(req.params.id);
      let files = results.rows;

      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }));

      return res.render("publicAccess/recipes/show", { recipe, files });
    } catch (err) {
      throw new Error(err);
    }
  },

  /* Chefs */

  async chefs(req, res) {
    try {
      const chefs = await LoadChef.load('chefs');

      return res.render("publicAccess/chefs/index", { chefs });
    } catch (err) {
      throw new Error(err);
    }
  },
  async showChef(req, res) {
    try {
      let chef = await LoadChef.load('chef', { where: { id: req.params.id } })

      let results = await Chef.findRecipe(req.params.id);
      const recipes = results.rows;

      for (recipe in recipes) {
        results = await Recipe.files(recipes[recipe].id);
        const file = results.rows[0];

        recipes[recipe] = {
          ...recipes[recipe],
          filename: file.name,
          src: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
        }

      }

      return res.render("publicAccess/chefs/show", { chef, recipes });
    } catch (err) {
      throw new Error(err);
    }
  },
};
