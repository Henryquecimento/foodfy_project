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

  chefs(req, res) {
    Chef.all((chefs) => {
      return res.render("publicAccess/chefs/index", { chefs });
    });
  },
  showChef(req, res) {
    Chef.find(req.params.id, (chef) => {
      Chef.findRecipe(req.params.id, (recipes) => {
        return res.render("publicAccess/chefs/show", { chef, recipes });
      });
    });
  }

}
