const fs = require("fs");
const data = require("../../data.json");

exports.index = (req, res) => {
  const recipes = data.recipes;

  return res.render("admin/recipes/index", { foods: recipes });
};

// Create
exports.create = (req, res) => {
  return res.render("admin/recipes/create");
};

// Post - Create
exports.post = (req, res) => {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Please, fill all the fields!");
    }
  }

  let id = 1;
  const lastRecipe = data.recipes[data.recipes.length - 1];

  if (lastRecipe) {
    id = lastRecipe.id + 1;
  }

  data.recipes.push({
    ...req.body,
    id,
  });

  fs.writeFile("./src/data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error -- line 37, recipes.js");

    return res.redirect(`/admin/recipes/${id}`);
  });
};

// Show
exports.show = (req, res) => {
  const { id } = req.params;

  const foundRecipe = data.recipes.find((recipe) => {
    return recipe.id == id;
  });

  if (!foundRecipe) {
    return res.send("Recipe not found!");
  }

  const recipe = {
    ...foundRecipe,
  };

  return res.render("admin/recipes/show", { foods: recipe });
};

// Edit
exports.edit = (req, res) => {
  const { id } = req.params;

  const foundRecipe = data.recipes.find((recipe) => {
    return recipe.id == id;
  });

  if (!foundRecipe) {
    return res.send("Recipe not found!");
  }

  const recipe = {
    ...foundRecipe,
  };

  return res.render(`admin/recipes/edit`, { foods: recipe });
};

exports.put = (req, res) => {
  const { id } = req.body;
  let index = 0;

  const foundRecipe = data.recipes.find((recipe, foundIndex) => {
    if (id == recipe.id) {
      index = foundIndex;

      return true;
    }
  });

  if (!foundRecipe) {
    return res.send("Recipe not found!");
  }

  const recipe = {
    ...foundRecipe,
    ...req.body,
  };

  data.recipes[index] = recipe;

  fs.writeFile("./src/data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write error! - line 108");

    return res.redirect(`/admin/recipes/${id}`);
  });
};

exports.delete = (req, res) => {
  const { id } = req.body;

  const filtredRecipes = data.recipes.filter((recipe) => {
    return recipe.id != id;
  });

  data.recipes = filtredRecipes;

  fs.writeFile("./src/data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write error! -- line 124");

    return res.redirect("/admin/recipes");
  });
};
