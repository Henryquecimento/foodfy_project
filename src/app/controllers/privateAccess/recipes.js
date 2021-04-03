const Recipe = require('../../models/Recipe');

module.exports = {
  index(req, res) {

    return res.render("admin/recipes/index");
  },
  create(req, res) {
    return res.render("admin/recipes/create");
  },
  post(req, res) {

    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all the fields!");
      }
    }

    Recipe.create(req.body, (recipe) => {
      return res.redirect(`/admin/recipes`);
    })

  },
  show(req, res) {
    return res.render("admin/recipes/show");
  },
  edit(req, res) {
    return res.render(`admin/recipes/edit`);
  },
  put(req, res) {
    return res.redirect(`/admin/recipes`);
  },
  delete(req, res) {
    return res.redirect("/admin/recipes");
  }
}
