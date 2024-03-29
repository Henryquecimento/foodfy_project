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
      console.error(err);

      return res.render("admin/message/error", {
        error: "Erro inesperado. Tente novamente mais tarde!"
      });
    }
  },
  async create(req, res) {
    try {
      const chefOptions = await Recipe.chefSelectedOptions();

      return res.render("admin/recipes/create", { chefOptions });
    } catch (err) {
      console.error(err);

      return res.render("admin/message/error", {
        error: "Erro inesperado. Tente novamente mais tarde!"
      });
    }
  },
  async post(req, res) {
    try {

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

      return res.render("admin/message/success", {
        success: "Receita criada com sucesso!"
      });
    } catch (err) {
      console.error(err);

      return res.render("admin/message/error", {
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
      console.error(err);

      return res.render("admin/message/error", {
        error: "Receita não encontrada!"
      });
    }
  },
  async edit(req, res) {
    try {
      const recipe = await LoadRecipe.load('recipe', {
        where: {
          id: req.params.id
        }
      })

      const chefOptions = await Recipe.chefSelectedOptions();

      return res.render("admin/recipes/edit", {
        recipe,
        chefOptions,
      });
    } catch (err) {
      console.error(err);

      return res.render("admin/message/error", {
        error: "Erro ao editar a receita. Tente novamente mais tarde!"
      });
    }
  },
  async put(req, res) {
    try {

      const {
        chef_id,
        title,
        ingredients,
        preparation,
        information,
        id: recipe_id,
        removed_files
      } = req.body;

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

      const chefOptions = await Recipe.chefSelectedOptions();

      if (removed_files) {

        const removedFiles = removed_files.split(",");
        const lastIndex = removedFiles.length - 1;

        removedFiles.splice(lastIndex, 1);

        const removedFilesPromises = removedFiles.map(async id => {

          const file = await File.findOne({ where: { id } });

          unlinkSync(file.path);

          await File.delete(id)

          return id;
        });

        await Promise.all(removedFilesPromises);

        const recipeFiles = await RecipeFiles.findAll({
          where: {
            recipe_id
          }
        });

        if (recipeFiles.length === 0) {
          return res.render("admin/recipes/edit", {
            recipe: req.body,
            chefOptions,
            error: "Por favor, adicione ao menos uma imagem!"
          });
        }

      }

      await Recipe.update(recipe_id, {
        chef_id,
        title,
        ingredients: `{${ingredients}}`,
        preparation: `{${preparation}}`,
        information,
      });

      return res.render("admin/message/success", {
        success: "Receita atualizada com sucesso!"
      });
    } catch (err) {
      console.error(err);

      return res.render("admin/message/error", {
        error: "Erro ao atualizar receita. Tente novamente mais tarde!"
      });
    }
  },
  async delete(req, res) {
    try {
      const results = await Recipe.files(req.body.id);
      const FilesPromise = results.map(async file => {

        await File.delete(file.id);

        unlinkSync(file.path);

        return file;
      });

      await Promise.all(FilesPromise);

      await Recipe.delete(req.body.id);

      return res.render("admin/message/success", {
        success: "Receita removida com sucesso!"
      });
    } catch (err) {
      console.error(err);

      return res.render("admin/message/error", {
        error: "Erro ao remover receita. Tente novamente mais tarde!"
      });
    }
  },
};
