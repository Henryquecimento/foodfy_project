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
        const avatar = await Chef.findFile(chefs[chef].id);

        chefs[chef] = {
          ...chefs[chef],
          avatarName: avatar[0].name,
          src: `${req.protocol}://${req.headers.host}${avatar[0].path.replace('public', "")}`
        }
      }

      return res.render("publicAccess/chefs/index", { chefs });
    } catch (err) {
      throw new Error(err);
    }
  },
  async showChef(req, res) {
    try {
      let chef = await Chef.findOne({ where: { id: req.params.id } });

      const avatar = await Chef.findFile(req.params.id);

      chef = {
        ...chef,
        avatarName: avatar[0].name,
        src: `${req.protocol}://${req.headers.host}${avatar[0].path.replace('public', "")}`
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
