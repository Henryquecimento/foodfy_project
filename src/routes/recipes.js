const express = require("express");
const routes = express.Router();

const multer = require('../app/middlewares/multer');
const { onlyUsers } = require('../app/middlewares/session');
const { onlyAdmin } = require('../app/middlewares/users');

const RecipesController = require("../app/controllers/privateAccess/RecipesController");

routes.get("/recipes", onlyUsers, RecipesController.index);
routes.get("/recipes/create", onlyUsers, onlyAdmin, RecipesController.create);
routes.get("/recipes/:id", onlyUsers, RecipesController.show);
routes.get("/recipes/:id/edit", onlyUsers, onlyAdmin, RecipesController.edit);

routes.post("/recipes", onlyUsers, onlyAdmin, multer.array("photos", 5), RecipesController.post);
routes.put("/recipes", onlyUsers, onlyAdmin, multer.array("photos", 5), RecipesController.put);
routes.delete("/recipes", onlyUsers, onlyAdmin, RecipesController.delete);

module.exports = routes;