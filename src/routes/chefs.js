const express = require("express");
const routes = express.Router();

const multer = require('../app/middlewares/multer');
const { onlyUsers } = require('../app/middlewares/session');
const { onlyAdmin } = require('../app/middlewares/users');

const { post, update } = require('../app/validators/ChefsValidators');

const ChefsController = require("../app/controllers/privateAccess/ChefsController");

routes.get("/chefs", onlyUsers, ChefsController.index);
routes.get("/chefs/create", onlyUsers, onlyAdmin, ChefsController.create);
routes.get("/chefs/:id", onlyUsers, ChefsController.show);
routes.get("/chefs/:id/edit", onlyUsers, onlyAdmin, ChefsController.edit);

routes.post("/chefs", onlyUsers, onlyAdmin, multer.array("photos", 1), post, ChefsController.post);
routes.put("/chefs", onlyUsers, onlyAdmin, multer.array("photos", 1), update, ChefsController.put);
routes.delete("/chefs", onlyUsers, onlyAdmin, ChefsController.delete);

module.exports = routes;