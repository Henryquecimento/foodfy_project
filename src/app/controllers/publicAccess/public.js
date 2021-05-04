const Chef = require('../../models/Chef');
const Recipe = require('../../models/Recipe');

module.exports = {

  index(req, res) {
    Recipe.all((recipes) => {
      return res.render("publicAccess/recipes/index", { recipes });
    });
  },
  about(req, res) {
    return res.render("publicAccess/recipes/about");
  },
  recipes(req, res) {
    let { filter } = req.query;

    if (filter) {
      Recipe.findBy(filter, (recipes) => {
        return res.render("publicAccess/recipes/recipes", { recipes });
      });
    } else {
      Recipe.all((recipes) => {
        return res.render("publicAccess/recipes/recipes", { recipes });
      });
    }
  },
  show(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      return res.render("publicAccess/recipes/show", { recipe });
    });
  },

  /* Chefs */

  async chefs(req, res) {
    const results = await Chef.all();
    const chefs = results.rows;

    try {
      return res.render("publicAccess/chefs/index", { chefs });
    } catch (err) {
      throw new Error({
        message: `Database Error! ${err}`
      });
    }
  },
  async showChef(req, res) {
    let results = await Chef.find(req.params.id);
    const chef = results.rows[0];

    results = await Chef.findRecipe(req.params.id);
    const recipes = results.rows;

    return res.render("publicAccess/chefs/show", { chef, recipes });
  }

}
