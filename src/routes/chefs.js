const express = require("express");
const routes = express.Router();

const multer = require('../app/middlewares/multer');
const { onlyUsers } = require('../app/middlewares/session');
const { onlyAdmin } = require('../app/middlewares/users');

const ChefsController = require("../app/controllers/privateAccess/ChefsController");

routes.get("/chefs", onlyUsers, ChefsController.index);
routes.get("/chefs/create", onlyUsers, onlyAdmin, ChefsController.create);
routes.get("/chefs/:id", onlyUsers, ChefsController.show);
routes.get("/chefs/:id/edit", onlyUsers, onlyAdmin, ChefsController.edit);

routes.post("/chefs", onlyUsers, onlyAdmin, multer.array("photos", 1), ChefsController.post);
routes.put("/chefs", onlyUsers, onlyAdmin, multer.array("photos", 1), ChefsController.put);
routes.delete("/chefs", onlyUsers, onlyAdmin, ChefsController.delete);

module.exports = routes;