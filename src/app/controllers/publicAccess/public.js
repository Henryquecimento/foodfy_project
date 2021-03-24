const data = require("../../../data.json");

exports.index = (req, res) => {
  return res.render("publicAccess/index", { foods: data.recipes });
};

exports.about = (req, res) => {
  return res.render("publicAccess/about");
};

exports.recipes = (req, res) => {
  return res.render("publicAccess/recipes", { foods: data.recipes });
};

// Show
exports.recipe = (req, res) => {
  const { id } = req.params;

  return res.render("publicAccess/recipe", { foods: [data.recipes[id - 1]] });
};
