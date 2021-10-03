const { unlinkSync } = require('fs');

const { date } = require("../../../lib/utils");

const Recipe = require("../../models/Recipe");
const RecipeFiles = require("../../models/Recipe_File");
const File = require("../../models/File");
const { LoadRecipe } = require('../../services/LoadRecipes');

module.exports = {
  async index(req, res) {
    try {
      const recipes = await LoadRecipe.load('recipes', {
        where: {
          user_id: req.session.userId
        }
      });

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

      const results = await Recipe.chefSelectedOptions();
      const options = results.rows;

      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == "") {
          return res.render("admin/recipes/create", {
            recipe: req.body,
            chefOptions: options,
            error: "You must fill all the fields!"
          });
        }
      }

      if (req.files.length == 0) {
        return res.send('Please, send at least one image!');
      }

      const { chef_id, title, ingredients, preparation, information } = req.body;

      const recipeId = await Recipe.create({
        chef_id,
        title,
        ingredients: `{${ingredients}}`,
        preparation: `{${preparation}}`,
        information,
        created_at: date(Date.now()).iso,
        user_id: req.session.userId
      });

      const FilesPromise = req.files.map(async file => {

        const fileId = await File.create({
          name: file.filename,
          path: file.path
        });

        RecipeFiles.create({
          recipe_id: recipeId,
          file_id: fileId
        });

        return file;

      });

      await Promise.all(FilesPromise);

      return res.render("admin/recipes/index", {
        success: "Receita criada com sucesso!"
      });
    } catch (err) {
      console.error(err);

      return res.render("admin/recipes/index", {
        error: "Erro ao criar nova receita. Tente novamente mais tarde!"
      });
    }
  },
  async show(req, res) {
    try {

      const recipe = await LoadRecipe.load('recipe', {
        where: {
          id: req.params.id
        }
      });

      return res.render("admin/recipes/show", { recipe });
    } catch (err) {
      throw new Error(err);
    }
  },
  async edit(req, res) {
    try {
      const recipe = await LoadRecipe.load('recipe', {
        where: {
          id: req.params.id
        }
      });

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

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(async file => {

          const fileId = await File.create({
            name: file.filename,
            path: file.path
          });

          RecipeFiles.create({
            recipe_id: req.body.id,
            file_id: fileId
          });

          return file;

        });

        await Promise.all(newFilesPromise);
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;

        removedFiles.splice(lastIndex, 1);

        const removedFilesPromises = removedFiles.map(async id => {

          const file = await File.findOne({ where: { id } });

          unlinkSync(file.path);

          await File.delete(id)

          return id;
        });

        await Promise.all(removedFilesPromises);

      }

      await Recipe.update(req.body);

      return res.render("admin/recipes/index", {
        success: "Receita atualizada com sucesso!"
      });
    } catch (err) {
      console.error(err);

      return res.render("admin/recipes/index", {
        error: "Erro ao atualizar receita. Tente novamente mais tarde!"
      });
    }
  },
  async delete(req, res) {
    try {
      const results = await Recipe.files(req.body.id);
      const FilesPromise = results.map(file => unlinkSync(file.path));

      await Promise.all(FilesPromise);

      await Recipe.delete(req.body.id);

      return res.render("admin/recipes/index", {
        success: "Receita removida com sucesso!"
      });
    } catch (err) {
      console.error(err);

      return res.render("admin/recipes/index", {
        error: "Erro ao remover receita. Tente novamente mais tarde!"
      });
    }
  },
};
