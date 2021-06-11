const Chef = require("../../models/Chef");
const Recipe = require("../../models/Recipe");

module.exports = {
  async index(req, res) {
    try {
      const results = await Recipe.all();
      const recipes = results.rows;

      return res.render("publicAccess/recipes/index", { recipes });
    } catch (err) {
      throw new Error(err);
    }
  },
  about(req, res) {
    return res.render("publicAccess/recipes/about");
  },
  async recipes(req, res) {
    try {
      let { filter } = req.query;
      let results,
        recipes = null;

      if (filter) {
        results = await Recipe.findBy(filter);
        recipes = results.rows;

        return res.render("publicAccess/recipes/recipes", { recipes });
      } else {
        results = await Recipe.all();
        recipes = results.rows;

        return res.render("publicAccess/recipes/recipes", { recipes });
      }
    } catch (err) {
      throw new Error(err);
    }
  },
  async show(req, res) {
    try {
      const results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      return res.render("publicAccess/recipes/show", { recipe });
    } catch (err) {
      throw new Error(err);
    }
  },

  /* Chefs */

  async chefs(req, res) {
    try {
      const results = await Chef.all();
      const chefs = results.rows;

      return res.render("publicAccess/chefs/index", { chefs });
    } catch (err) {
      throw new Error(err);
    }
  },
  async showChef(req, res) {
    try {
      let results = await Chef.find(req.params.id);
      const chef = results.rows[0];

      results = await Chef.findRecipe(req.params.id);
      const recipes = results.rows;

      return res.render("publicAccess/chefs/show", { chef, recipes });
    } catch (err) {
      throw new Error(err);
    }
  },
};
