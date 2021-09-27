const User = require('../models/User');
const { compare } = require('bcrypt');

async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (!user) return res.render('admin/session/login', {
    user: req.body,
    error: 'O usuário não existe!'
  });

  // PASSWORD VALIDATION -- MODIFY
  const passed = await compare(password, user.password);

  if (!passed) return res.render('admin/session/login', {
    user: req.body,
    error: 'Senha inválida, por favor tente novamente!'
  });

  req.user = user;

  next();
}

async function forgot(req, res, next) {
  const { email } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (!user) return res.render('admin/session/forgot-password', {
    user: req.body,
    error: 'O usuário não existe!'
  });

  req.user = user;

  next();

}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (!user) return res.render("admin/session/password-reset", {
    user: req.body,
    error: 'O usuário não existe!'
  });

  if (password != passwordRepeat) return res.render("admin/session/password-reset", {
    token,
    user: req.body,
    error: 'As senhas não combinam!'
  });

  if (token != user.reset_token) return res.render("admin/session/password-reset", {
    token,
    user: req.body,
    error: 'Token inválido! Por favor, peça uma nova recuperação de senha'
  });

  let now = new Date();
  now = now.setHours(now.getHours());

  if (now > user.reset_token_expires) return res.render("admin/session/password-reset", {
    token,
    user: req.body,
    error: 'Token expirado! Por favor, peça uma nova recuperação de senha'
  });

  req.user = user;

  next();
}

module.exports = {
  login,
  forgot,
  reset
}