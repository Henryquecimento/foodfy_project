const fs = require('fs');
const Recipe = require("../../models/Recipe");
const RecipeFiles = require("../../models/Recipe_File");
const File = require("../../models/File");

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
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == "") {
          return res.send("Please, fill all the fields!");
        }
      }

      if (req.files.length == 0) {
        return res.send('Please, send at least one image!');
      }

      let results = await Recipe.create(req.body);
      const recipeId = results.rows[0].id;

      const FilesPromise = req.files.map(file => RecipeFiles.create({
        ...file,
        recipe_id: recipeId
      }));

      await Promise.all(FilesPromise);

      return res.redirect(`/admin/recipes/${recipeId}/edit`);
    } catch (err) {
      throw new Error(err);
    }
  },
  async show(req, res) {
    try {
      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) return res.send("Recipe not found!");

      results = await Recipe.files(req.params.id);
      let files = results.rows;
      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }));

      return res.render("admin/recipes/show", { recipe, files });
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

      results = await Recipe.files(recipe.id);
      let files = results.rows;
      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }));

      return res.render("admin/recipes/edit", {
        recipe,
        chefOptions: options,
        files
      });
    } catch (err) {
      throw new Error(err);
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == "" && key != 'removed_files') {
          return res.send("Please, fill all the fields!");
        }
      }

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(file => RecipeFiles.create({
          ...file,
          recipe_id: req.body.id
        }));

        await Promise.all(newFilesPromise);
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;

        removedFiles.splice(lastIndex, 1);

        const removedFilesPromises = removedFiles.map(id => File.delete(id));

        await Promise.all(removedFilesPromises);
      }

      await Recipe.update(req.body);

      return res.redirect(`/admin/recipes/${req.body.id}`);
    } catch (err) {
      throw new Error(err);
    }
  },
  async delete(req, res) {
    try {
      const results = await Recipe.files(req.body.id);
      const files = results.rows;

      for (file of files) {
        fs.unlinkSync(file.path);
      }

      await Recipe.delete(req.body.id);

      return res.redirect("/admin/recipes");
    } catch (err) {
      throw new Error(err);
    }
  },
};
