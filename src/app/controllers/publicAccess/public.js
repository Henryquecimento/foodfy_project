

exports.index = (req, res) => {
  return res.render("publicAccess/index");
};

exports.about = (req, res) => {
  return res.render("publicAccess/about");
};

exports.recipes = (req, res) => {
  return res.render("publicAccess/recipes");
};

// Show
exports.recipe = (req, res) => {

  return res.render("publicAccess/recipe");
};

exports.chefs = (req, res) => {
  return res.render("publicAccess/chefs");
}