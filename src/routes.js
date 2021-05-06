const express = require("express");
const routes = express.Router();
const public = require("./app/controllers/publicAccess/PublicController");
const recipes = require("./app/controllers/privateAccess/RecipesController");
const chefs = require("./app/controllers/privateAccess/ChefsController");

/* -- Public Access -- */

routes.get("/", public.index);
routes.get("/about", public.about);
routes.get("/recipes", public.recipes);
routes.get("/recipes/:id", public.show);
routes.get("/chefs", public.chefs);
routes.get("/chefs/:id", public.showChef);

/* -- Private Access -- */

routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create);
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit);

routes.post("/admin/recipes", recipes.post);
routes.put("/admin/recipes", recipes.put);
routes.delete("/admin/recipes", recipes.delete);

routes.get("/admin/chefs", chefs.index);
routes.get("/admin/chefs/create", chefs.create);
routes.get("/admin/chefs/:id", chefs.show);
routes.get("/admin/chefs/:id/edit", chefs.edit);

routes.post("/admin/chefs", chefs.post);
routes.put("/admin/chefs", chefs.put);
routes.delete("/admin/chefs", chefs.delete);

module.exports = routes;
