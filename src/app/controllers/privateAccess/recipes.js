const Recipe = require('../../models/Recipe');

module.exports = {
  index(req, res) {

    Recipe.all((recipes) => {
      return res.render("admin/recipes/index", { recipes });
    });
  },
  create(req, res) {

    Recipe.chefSelectedOptions((options) => {

      return res.render("admin/recipes/create", { chefOptions: options });
    });
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
    Recipe.find(req.params.id, (recipe) => {
      if (!recipe) return res.send('Recipe not found!');

      return res.render("admin/recipes/show", { recipe });
    });
  },
  edit(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      if (!recipe) return res.send('Recipe not found!');

      Recipe.chefSelectedOptions((options) => {

        return res.render("admin/recipes/edit", {
          recipe,
          chefOptions: options,
        });
      });
    })
  },
  put(req, res) {

    Recipe.update(req.body, () => {
      return res.redirect(`/admin/recipes`);
    })
  },
  delete(req, res) {

    Recipe.delete(req.body.id, () => {

      return res.redirect("/admin/recipes");
    })
  }
}
