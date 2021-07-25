const express = require("express");
const routes = express.Router();
const PublicController = require("../app/controllers/publicAccess/PublicController");

const admin = require('./admin');

routes.use("/admin", admin);

/* -- Public Access -- */
routes.get("/", PublicController.index);
routes.get("/about", PublicController.about);
routes.get("/recipes", PublicController.recipes);
routes.get("/recipes/:id", PublicController.show);
routes.get("/chefs", PublicController.chefs);
routes.get("/chefs/:id", PublicController.showChef);

module.exports = routes;
