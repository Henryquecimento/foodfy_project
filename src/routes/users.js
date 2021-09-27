const express = require("express");
const routes = express.Router();

const { onlyUsers, userIsLogged } = require('../app/middlewares/session');
const { onlyAdmin } = require('../app/middlewares/users');

const SessionController = require("../app/controllers/privateAccess/SessionController");
const ProfileController = require("../app/controllers/privateAccess/ProfileController");
const UserController = require("../app/controllers/privateAccess/UserController");

const UserValidators = require('../app/validators/UserValidators');
const SessionValidators = require('../app/validators/SessionValidators');

routes.get('/login', userIsLogged, SessionController.loginForm);
routes.post('/login', SessionValidators.login, SessionController.login);
routes.post('/logout', SessionController.logout);

routes.get('/forgot-password', SessionController.forgotForm);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/forgot-password', SessionValidators.forgot, SessionController.forgot);
routes.post('/password-reset', SessionValidators.reset, SessionController.reset);

routes.get('/profile', onlyUsers, UserValidators.show, ProfileController.index);
routes.put('/profile', UserValidators.update, ProfileController.put);

routes.get('/users', onlyUsers, UserController.list);
routes.get('/users/create', onlyUsers, UserController.create);
routes.post('/users', UserValidators.post, UserController.post);
routes.get('/users/:id/edit', onlyUsers, onlyAdmin, UserController.edit);
routes.put('/users', onlyAdmin, UserController.put);
routes.delete('/users', onlyAdmin, UserController.delete);

module.exports = routes;