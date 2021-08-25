const User = require("../../models/User");
const mailer = require('../../../lib/mailer');
const { hash } = require("bcrypt");
const crypto = require('crypto');

module.exports = {
  async list(req, res) {
    const results = await User.all();

    const users = results.rows;

    return res.render('admin/users/index.njk', { users });
  },
  create(req, res) {
    return res.render('admin/users/create.njk');
  },
  async post(req, res) {
    try {
      const { name, email, is_admin } = req.body;

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

      await User.post({
        name,
        email,
        password: encryptedPassword,
        is_admin
      });

      return res.render(`admin/users/index.njk`, {
        success: "Usuário criado com sucesso!"
      });

    } catch (err) {
      console.error(err);
      return res.render(`admin/users/index.njk`, {
        error: "Erro ao criar um novo usuário, tente novamente mais tarde!"
      });
    }
  },
  async edit(req, res) {

    const results = await User.find(req.params.id);

    const user = results.rows[0];

    return res.render(`admin/users/edit`, { user });
  },
  async put(req, res) {

    await User.update(req.body.id, {
      ...req.body
    });

    return res.render('admin/users/index', {
      success: 'Dados do usuário atualizado com sucesso!'
    });
  },
  async delete(req, res) {

    await User.delete(req.body.id);

    return res.render('admin/users/index', {
      success: 'Usuário removido com sucesso!'
    });
  }
}