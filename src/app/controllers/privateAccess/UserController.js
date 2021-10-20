const mailer = require('../../../lib/mailer');
const { hash } = require("bcrypt");
const crypto = require('crypto');

const User = require("../../models/User");
const Recipe = require('../../models/Recipe');

const { LoadRecipe } = require('../../services/LoadRecipes');

module.exports = {
  async list(req, res) {
    try {
      const users = await User.findAll();

      return res.render('admin/users/index.njk', { users });

    } catch (err) {
      console.error(err);

      return res.render("admin/message/error", {
        error: "Erro ao criar um novo usuário, tente novamente mais tarde!"
      });
    }
  },
  create(req, res) {
    return res.render('admin/users/create.njk');
  },
  async post(req, res) {
    try {
      let { name, email, is_admin } = req.body;

      const firstPassword = crypto.randomBytes(20).toString('hex');

      const encryptedPassword = await hash(firstPassword, 8);

      await mailer.sendMail({
        to: email,
        from: "no-reply@foodfy.com",
        subject: "Cadastro de Usuário",
        html: `<h2>Olá ${name}, seja bem-vindo!</h2>
        <p>Segue abaixo seu login e senha</p>
        <p>
          E-mail: ${email}</b>
          Senha: ${firstPassword}
        </p>
        <p>
          <a href="http://localhost:5000/admin/login" target="_blank">
          ACESSE COM O SEU LOGIN
          </a>
        </p>
        <p>Caso queira outra senha, clique no link abaixo para resetar a senha</p>
        <p>
          <a href="http://localhost:5000/admin/forgot-password" target="_blank">
          MUDAR A SENHA
          </a>
        </p>
        `
      });

      if (is_admin == undefined) is_admin = false;

      await User.create({
        name,
        email,
        password: encryptedPassword,
        is_admin
      });

      return res.render("admin/message/success", {
        success: "Usuário criado com sucesso!"
      });

    } catch (err) {
      console.error(err);

      return res.render("admin/message/error", {
        error: "Erro ao criar um novo usuário, tente novamente mais tarde!"
      });
    }
  },
  async edit(req, res) {
    try {
      const user = await User.findOne({
        where: {
          id: req.params.id
        }
      });

      return res.render(`admin/users/edit`, { user });

    } catch (err) {
      console.error(err);

      return res.render("admin/message/error", {
        error: "Erro ao editar usuário, tente novamente mais tarde!"
      });
    }
  },
  async put(req, res) {
    try {
      let { name, email, is_admin } = req.body;

      if (is_admin == undefined) is_admin = false;

      await User.update(req.body.id, {
        name,
        email,
        is_admin
      });

      return res.render("admin/message/success", {
        user: req.body,
        success: 'Dados do usuário atualizado com sucesso!'
      });
    } catch (err) {
      console.error(err);

      return res.render("admin/message/error", {
        error: "Erro ao atualizar usuário, tente novamente mais tarde!"
      });
    }

  },
  async delete(req, res) {
    try {
      const recipes = await LoadRecipe.load('recipes', {
        where: {
          user_id: req.body.id
        }
      });

      const recipesPromise = recipes.map(recipe => Recipe.delete(recipe.id));

      await Promise.all(recipesPromise);

      await User.delete(req.body.id);

      return res.render("admin/message/success", {
        success: 'Usuário removido com sucesso!'
      });
    } catch (err) {
      console.error(err);

      return res.render("admin/message/error", {
        error: "Erro ao remover usuário, tente novamente mais tarde!"
      });
    }

  }
}