const User = require('../models/User');
const { compare } = require('bcrypt');

async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (!user) return res.send('User does not already exists!');

  const passed = '1234';

  if (!passed) return res.send('Invalid Password, please try again!');

  req.user = user;

  next();
}

module.exports = {
  login
}