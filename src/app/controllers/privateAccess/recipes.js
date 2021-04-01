const Recipe = require('../../models/Recipe');

exports.index = (req, res) => {

  return res.render("admin/recipes/index");
};
exports.create = (req, res) => {
  return res.render("admin/recipes/create");
};
exports.post = (req, res) => {

  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Please, fill all the fields!");
    }
  }

  Recipe.create(req.body, (recipe) => {
    return res.redirect(`/admin/recipes`);
  })

};
exports.show = (req, res) => {
  return res.render("admin/recipes/show");
};
exports.edit = (req, res) => {
  return res.render(`admin/recipes/edit`);
};
exports.put = (req, res) => {
  return res.redirect(`/admin/recipes`);
};
exports.delete = (req, res) => {
  return res.redirect("/admin/recipes");
};
