const Recipe = require('../../models/Recipe');

module.exports = {
  async index(req, res) {
    try {
      let { filter } = req.query;
      let results,
        recipes = null;

      if (filter) {
        results = await Recipe.findBy(filter);
        recipes = results.rows;

        for (recipe in recipes) {
          results = await Recipe.files(recipes[recipe].id);
          const file = results.rows[0];

          recipes[recipe] = {
            ...recipes[recipe],
            filename: file.name,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
          }

        }

        return res.render("publicAccess/recipes/recipes", { recipes });
      } else {
        results = await Recipe.all();
        recipes = results.rows;

        for (recipe in recipes) {
          results = await Recipe.files(recipes[recipe].id);
          const file = results.rows[0];

          recipes[recipe] = {
            ...recipes[recipe],
            filename: file.name,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
          }

        }

        return res.render("publicAccess/recipes/recipes", { recipes });
      }
    } catch (err) {
      throw new Error(err);
    }
  },
}