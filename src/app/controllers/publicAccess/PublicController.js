const Chef = require("../../models/Chef");
const Recipe = require("../../models/Recipe");

module.exports = {
  async index(req, res) {
    try {
      let results = await Recipe.all();
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

      return res.render("publicAccess/recipes/index", { recipes });
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
      let results = await Chef.all();
      const chefs = results.rows;

      for (chef in chefs) {
        results = await Chef.findFile(chefs[chef].id);
        const avatar = results.rows[0];

        chefs[chef] = {
          ...chefs[chef],
          avatarName: avatar.name,
          src: `${req.protocol}://${req.headers.host}${avatar.path.replace('public', "")}`
        }
      }

      return res.render("publicAccess/chefs/index", { chefs });
    } catch (err) {
      throw new Error(err);
    }
  },
  async showChef(req, res) {
    try {
      let results = await Chef.find(req.params.id);
      let chef = results.rows[0];

      results = await Chef.findFile(req.params.id);
      const avatar = results.rows[0];

      chef = {
        ...chef,
        avatarName: avatar.name,
        src: `${req.protocol}://${req.headers.host}${avatar.path.replace('public', "")}`
      }

      results = await Chef.findRecipe(req.params.id);
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
