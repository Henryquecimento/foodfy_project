const User = require('../models/User');
const { compare } = require('bcrypt');

async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (!user) return res.send('User does not already exists!');

  // PASSWORD VALIDATION -- MODIFY
  const passed = await compare(password, user.password);

  if (!passed) return res.send('Invalid Password, please try again!');

  req.user = user;

  next();
}

async function forgot(req, res, next) {
  const { email } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (!user) return res.send('User does not exists!');

  req.user = user;

  next();

}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (!user) return res.send('User does not exists!')

  if (password != passwordRepeat) return res.send('Password Mismatch!', { token });

  if (token != user.reset_token) return res.send('Invalid Token! Please ask a new Password Recovery', { token })

  let now = new Date();
  now = now.setHours(now.getHours());

  if (now > user.reset_token_expires) return res.send('Token Expired! Please ask a new Password Recovery', { token });

  req.user = user;

  next();
}

module.exports = {
  login,
  forgot,
  reset
}