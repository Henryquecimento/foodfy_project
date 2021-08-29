const mailer = require('../../../lib/mailer');
const crypto = require('crypto');
const User = require('../../models/User');
const { hash } = require('bcrypt');

module.exports = {
  loginForm(req, res) {
    return res.render('admin/session/login');
  },
  login(req, res) {
    req.session.userId = req.user.id;
    req.session.isAdmin = req.user.is_admin;

    return res.redirect('/admin/profile');
  },
  logout(req, res) {
    req.session.destroy();

    return res.redirect('/');
  },
  forgotForm(req, res) {
    return res.render('admin/session/forgot-password');
  },
  async forgot(req, res) {
    const { user } = req;

    try {
      const token = crypto.randomBytes(20).toString('hex');

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      });

      await mailer.sendMail({
        to: user.email,
        from: "no-reply@foodfy.com",
        subject: "Recuperação de Senha",
        html: `<h2>Esqueceu sua senha?</h2>
        <p>Clique no link abaixo para resetar a senha</p>
        <p>
          <a href="http://localhost:5000/admin/password-reset?token=${token}" target="_blank">
          RECUPERAR SENHA
          </a>
        </p>
        `
      });

      return res.render('admin/session/forgot-password', {
        token,
        success: 'E-mail enviado com sucesso!'
      });

    } catch (err) {

      console.error(err);

      return res.render('admin/session/forgot-password', {
        token,
        error: "Erro inesperado!"
      });
    }
  },
  resetForm(req, res) {
    return res.render('admin/session/password-reset', { token: req.query.token });
  },
  async reset(req, res) {
    const { password, token } = req.body;

    try {
      const { user } = req;

      const newPassword = await hash(password, 8);


      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: ""
      });

      return res.render('admin/session/login', {
        success: 'Senha modificada com sucesso!'
      })
    } catch (err) {
      console.error(err);
      return res.render('admin/session/password-reset', {
        token,
        error: 'Erro inesperado!'
      })
    }
  }

}

