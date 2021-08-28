const User = require("../models/User");

async function onlyAdmin(req, res, next) {
  const result = await User.find(req.session.userId);

  const isAdmin = result.rows[0].is_admin;

  if (!isAdmin) {
    return res.redirect('/admin/users');
  }

  next();

}

module.exports = {
  onlyAdmin
}