const Recipe = require('../../models/Recipe');

module.exports = {
  async index(req, res) {
    try {
      let { filter, page, limit } = req.query;

      page = page || 1;
      limit = limit || 9;
      let offset = limit * (page - 1);

      const params = {
        filter,
        page,
        limit,
        offset
      }

      let results = await Recipe.paginate(params);

      const recipesPromise = results.rows.map(async recipe => {
        results = await Recipe.files(recipe.id); // I CHANGED THE WAY FILES IS CALLED -> RESULTS.ROWS
        const file = results[0]; //CHANGE 

        recipe = {
          ...recipe,
          filename: file.name,
          path: file.path.replace(/\\/g, '/'),
          img: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
        }

        return recipe;
      });

      const recipes = await Promise.all(recipesPromise);

      const pagination = {
        total: recipes[0] ? Math.ceil(recipes[0].total / limit) : 0,
        page
      }

      return res.render("publicAccess/recipes/index", { recipes, filter, pagination });

    } catch (err) {
      throw new Error(err);
    }
  },
}

