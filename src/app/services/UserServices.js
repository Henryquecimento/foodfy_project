const User = require('../models/User');

function checkAllfields(body) {
  const keys = Object.keys(body);

  for (let key of keys) {
    if (body[key] == "") {
      return {
        error: "Please, fill all the fields!"
      };
    }
  }

}

async function post(req, res, next) {

  const filledFields = checkAllfields(req.body);

  if (filledFields) return res.render('admin/profile', filledFields);

  const { email } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (user) return res.send('User Already exists!');

  next();
}

async function show(req, res, next) {
  const { userId: id } = req.session;

  const user = await User.findOne({
    where: { id }
  });

  if (!user) return res.send('User does not exists!');

  req.user = user;

  next();
}

async function update(req, res, next) {
  const filledFields = checkAllfields(req.body);

  if (filledFields) return res.render('admin/profile', filledFields);

  const { id, password } = req.body;

  if (!password) return res.send('Ponha a senha para atualizar o cadastro!');

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