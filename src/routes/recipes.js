const express = require("express");
const routes = express.Router();

const multer = require('../app/middlewares/multer');
const { onlyUsers } = require('../app/middlewares/session');
const { onlyUserCreator } = require('../app/middlewares/users');

const { post, update } = require('../app/validators/RecipesValidators');

const RecipesController = require("../app/controllers/privateAccess/RecipesController");

routes.get("/recipes", onlyUsers, RecipesController.index);
routes.get("/recipes/create", onlyUsers, RecipesController.create);
routes.get("/recipes/:id", onlyUsers, RecipesController.show);
routes.get("/recipes/:id/edit", onlyUsers, onlyUserCreator, RecipesController.edit);

routes.post("/recipes", multer.array("photos", 5), post, RecipesController.post);
routes.put("/recipes", multer.array("photos", 5), update, RecipesController.put);
routes.delete("/recipes", RecipesController.delete);

module.exports = routes;