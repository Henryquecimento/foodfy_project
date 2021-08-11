const User = require('../models/User');

async function post(req, res, next) {
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

module.exports = {
  post,
  show
}