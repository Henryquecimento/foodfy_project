const { LoadChef } = require('../../services/LoadChefs');
const { LoadRecipe } = require("../../services/LoadRecipes");

module.exports = {
  async index(req, res) {
    try {
      const recipes = await LoadRecipe.load('recipes');

      return res.render("publicAccess/index", { recipes });
    } catch (err) {
      throw new Error(err);
    }
  },
  about(req, res) {
    return res.render("publicAccess/about");
  },
  async show(req, res) {
    try {
      const recipe = await LoadRecipe.load('recipe', {
        where: {
          id: req.params.id
        }
      });

      return res.render("publicAccess/recipes/show", { recipe });
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
      const chef = await LoadChef.load('chef', { where: { id: req.params.id } })

      const recipes = await LoadRecipe.load('recipes', {
        where: {
          chef_id: req.params.id
        }
      });

      return res.render("publicAccess/chefs/show", { chef, recipes });
    } catch (err) {
      throw new Error(err);
    }
  },
};
