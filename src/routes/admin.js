const express = require("express");
const routes = express.Router();

const multer = require('../app/middlewares/multer');
const { onlyUsers, userIsLogged } = require('../app/middlewares/session');
const { onlyAdmin } = require('../app/middlewares/users');


const RecipesController = require("../app/controllers/privateAccess/RecipesController");
const ChefsController = require("../app/controllers/privateAccess/ChefsController");
const SessionController = require("../app/controllers/privateAccess/SessionController");
const ProfileController = require("../app/controllers/privateAccess/ProfileController");
const UserController = require("../app/controllers/privateAccess/UserController");

const UserServices = require('../app/services/UserServices');
const SessionServices = require('../app/services/SessionServices');
/* -- Private Access -- */

routes.get("/recipes", onlyUsers, RecipesController.index);
routes.get("/recipes/create", onlyUsers, onlyAdmin, RecipesController.create);
routes.get("/recipes/:id", onlyUsers, RecipesController.show);
routes.get("/recipes/:id/edit", onlyUsers, onlyAdmin, RecipesController.edit);

routes.post("/recipes", onlyUsers, onlyAdmin, multer.array("photos", 5), RecipesController.post);
routes.put("/recipes", onlyUsers, onlyAdmin, multer.array("photos", 5), RecipesController.put);
routes.delete("/recipes", onlyUsers, onlyAdmin, RecipesController.delete);

routes.get("/chefs", onlyUsers, ChefsController.index);
routes.get("/chefs/create", onlyUsers, onlyAdmin, ChefsController.create);
routes.get("/chefs/:id", onlyUsers, ChefsController.show);
routes.get("/chefs/:id/edit", onlyUsers, onlyAdmin, ChefsController.edit);

routes.post("/chefs", onlyUsers, onlyAdmin, multer.array("photos", 5), ChefsController.post);
routes.put("/chefs", onlyUsers, onlyAdmin, multer.array("photos", 5), ChefsController.put);
routes.delete("/chefs", onlyUsers, onlyAdmin, ChefsController.delete);

/* -- USERS -- */

// --- login/logout
routes.get('/login', userIsLogged, SessionController.loginForm);
routes.post('/login', SessionServices.login, SessionController.login);
routes.post('/logout', SessionController.logout);

// --- reset password/ forgot
routes.get('/forgot-password', SessionController.forgotForm);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/forgot-password', SessionServices.forgot, SessionController.forgot);
routes.post('/password-reset', SessionServices.reset, SessionController.reset);


// Rotas de perfil de um usuário logado
routes.get('/profile', onlyUsers, UserServices.show, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', UserServices.update, ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', onlyUsers, UserController.list) // Mostrar a lista de usuários cadastrados
routes.get('/users/create', onlyUsers, onlyAdmin, UserController.create) // Mostrar o formulário de criação de um usuário
routes.post('/users', onlyAdmin, UserServices.post, UserController.post) // Cadastrar um usuário
routes.get('/users/:id/edit', onlyUsers, onlyAdmin, UserController.edit) // Mostrar o formulário de edição de um usuário
routes.put('/users', onlyAdmin, UserController.put) // Editar um usuário
routes.delete('/users', onlyAdmin, UserController.delete) // Deletar um usuário

module.exports = routes;