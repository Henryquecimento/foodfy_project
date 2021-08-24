const express = require("express");
const routes = express.Router();
const PublicController = require("../app/controllers/publicAccess/PublicController");
const SearchController = require("../app/controllers/publicAccess/SearchController");

const users = require('./users');
const chefs = require('./chefs');
const recipes = require('./recipes');

routes.use("/admin", users);
routes.use("/admin", chefs);
routes.use("/admin", recipes);

/* -- Public Access -- */
routes.get("/", PublicController.index);
routes.get("/about", PublicController.about);
routes.get("/recipes", SearchController.index);
routes.get("/recipes/:id", PublicController.show);
routes.get("/chefs", PublicController.chefs);
routes.get("/chefs/:id", PublicController.showChef);

module.exports = routes;
