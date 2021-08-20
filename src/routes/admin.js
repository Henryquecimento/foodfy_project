const express = require("express");
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const session = require('../app/middlewares/session');

const RecipesController = require("../app/controllers/privateAccess/RecipesController");
const ChefsController = require("../app/controllers/privateAccess/ChefsController");
const SessionController = require("../app/controllers/privateAccess/SessionController");
const ProfileController = require("../app/controllers/privateAccess/ProfileController");
const UserController = require("../app/controllers/privateAccess/UserController");

const UserServices = require('../app/services/UserServices');
const SessionServices = require('../app/services/SessionServices');
/* -- Private Access -- */

routes.get("/recipes", session.onlyUsers, RecipesController.index);
routes.get("/recipes/create", session.onlyUsers, RecipesController.create);
routes.get("/recipes/:id", session.onlyUsers, RecipesController.show);
routes.get("/recipes/:id/edit", session.onlyUsers, RecipesController.edit);

routes.post("/recipes", multer.array("photos", 5), RecipesController.post);
routes.put("/recipes", multer.array("photos", 5), RecipesController.put);
routes.delete("/recipes", RecipesController.delete);

routes.get("/chefs", session.onlyUsers, ChefsController.index);
routes.get("/chefs/create", session.onlyUsers, ChefsController.create);
routes.get("/chefs/:id", session.onlyUsers, ChefsController.show);
routes.get("/chefs/:id/edit", session.onlyUsers, ChefsController.edit);

routes.post("/chefs", multer.array("photos", 5), ChefsController.post);
routes.put("/chefs", multer.array("photos", 5), ChefsController.put);
routes.delete("/chefs", ChefsController.delete);

/* -- USERS -- */

// --- login/logout
routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionServices.login, SessionController.login);
routes.post('/logout', SessionController.logout);

// --- reset password/ forgot
routes.get('/forgot-password', SessionController.forgotForm);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/forgot-password', SessionServices.forgot, SessionController.forgot);
routes.post('/password-reset', SessionServices.reset, SessionController.reset);


// Rotas de perfil de um usuário logado
routes.get('/profile', session.onlyUsers, UserServices.show, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', session.onlyUsers, UserServices.update, ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', session.onlyUsers, UserController.list) // Mostrar a lista de usuários cadastrados
routes.get('/users/create', session.onlyUsers, UserController.create) // Mostrar o formulário de criação de um usuário
routes.post('/users', UserServices.post, UserController.post) // Cadastrar um usuário
routes.get('/users/:id/edit', session.onlyUsers, UserController.edit) // Mostrar o formulário de edição de um usuário
routes.put('/users', UserController.put) // Editar um usuário
routes.delete('/users', UserController.delete) // Deletar um usuário

module.exports = routes;