const User = require('../models/User');

async function post(req, res, next) {
  const { email } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (user) return res.send('User Already exists!');

  next();
}

module.exports = {
  post
}