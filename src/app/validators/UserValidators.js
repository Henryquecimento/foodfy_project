const User = require('../models/User');

function checkAllfields(body) {
  const keys = Object.keys(body);

  for (let key of keys) {
    if (body[key] == "") {
      return {
        user: body,
        error: "Por favor, preencha todos os campos!"
      };
    }
  }

}

async function post(req, res, next) {

  const filledFields = checkAllfields(req.body);

  if (filledFields) return res.render('admin/users/create', filledFields);

  const { email } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (user) return res.render("admin/users/create", {
    user: req.body,
    error: 'User Already exists!'
  });

  next();
}

async function show(req, res, next) {
  const { userId: id } = req.session;

  const user = await User.findOne({
    where: { id }
  });

  if (!user) return res.render("admin/session/login", {
    error: 'User does not exists!'
  });

  req.user = user;

  next();
}

async function update(req, res, next) {

  const { id, password } = req.body;

  if (!password) return res.render("admin/users/profile.njk", {
    user: req.body,
    error: 'Ponha a senha para atualizar o cadastro!'
  });

  const filledFields = checkAllfields(req.body);

  if (filledFields) return res.render('admin/users/profile.njk', filledFields);

  const user = await User.findOne({
    where: { id }
  });

  req.user = user;

  next();
}

module.exports = {
  post,
  show,
  update
}