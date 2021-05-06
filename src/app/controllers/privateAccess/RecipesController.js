const Recipe = require("../../models/Recipe");

module.exports = {
  async index(req, res) {
    try {
      const results = await Recipe.all();
      const recipes = results.rows;

      return res.render("admin/recipes/index", { recipes });
    } catch (err) {
      throw new Error(err);
    }
  },
  async create(req, res) {
    try {
      const results = await Recipe.chefSelectedOptions();
      const options = results.rows;

      return res.render("admin/recipes/create", { chefOptions: options });
    } catch (err) {
      throw new Error(err);
    }
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all the fields!");
      }
    }

    try {
      const results = await Recipe.create(req.body);
      const recipeId = results.rows[0].id;

      return res.redirect(`/admin/recipes/${recipeId}`);
    } catch (err) {
      throw new Error(err);
    }
  },
  async show(req, res) {
    try {
      const results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) return res.send("Recipe not found!");

      return res.render("admin/recipes/show", { recipe });
    } catch (err) {
      throw new Error(err);
    }
  },
  async edit(req, res) {
    try {
      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) return res.send("Recipe not found!");

      results = await Recipe.chefSelectedOptions();
      const options = results.rows;

      return res.render("admin/recipes/edit", {
        recipe,
        chefOptions: options,
      });
    } catch (err) {
      throw new Error(err);
    }
  },
  async put(req, res) {
    try {
      await Recipe.update(req.body);

      return res.redirect(`/admin/recipes/${req.body.id}`);
    } catch (err) {
      throw new Error(err);
    }
  },
  async delete(req, res) {
    try {
      await Recipe.delete(req.body.id);

      return res.redirect("/admin/recipes");
    } catch (err) {
      throw new Error(err);
    }
  },
};
