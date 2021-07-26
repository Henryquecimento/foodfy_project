const express = require("express");
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const RecipesController = require("../app/controllers/privateAccess/RecipesController");
const ChefsController = require("../app/controllers/privateAccess/ChefsController");
const ProfileController = require("../app/controllers/privateAccess/ChefsController");
const UserController = require("../app/controllers/privateAccess/ChefsController");

/* -- Private Access -- */

routes.get("/recipes", RecipesController.index);
routes.get("/recipes/create", RecipesController.create);
routes.get("/recipes/:id", RecipesController.show);
routes.get("/recipes/:id/edit", RecipesController.edit);

routes.post("/recipes", multer.array("photos", 5), RecipesController.post);
routes.put("/recipes", multer.array("photos", 5), RecipesController.put);
routes.delete("/recipes", RecipesController.delete);

routes.get("/chefs", ChefsController.index);
routes.get("/chefs/create", ChefsController.create);
routes.get("/chefs/:id", ChefsController.show);
routes.get("/chefs/:id/edit", ChefsController.edit);

routes.post("/chefs", multer.array("photos", 5), ChefsController.post);
routes.put("/chefs", multer.array("photos", 5), ChefsController.put);
routes.delete("/chefs", ChefsController.delete);

/* -- USERS -- */

// Rotas de perfil de um usuário logado
//routes.get('/admin/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
//routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
// routes.get('/admin/users', UserController.list) // Mostrar a lista de usuários cadastrados
// routes.post('/admin/users', UserController.post) // Cadastrar um usuário
// routes.get('/admin/users/create', UserController.create) // Mostrar o formulário de criação de um usuário
// routes.put('/admin/users/:id', UserController.put) // Editar um usuário
// routes.get('/admin/users/:id/edit', UserController.edit) // Mostrar o formulário de edição de um usuário
// routes.delete('/admin/users/:id', UserController.delete) // Deletar um usuário

module.exports = routes;