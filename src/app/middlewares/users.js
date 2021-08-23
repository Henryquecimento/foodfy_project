const User = require("../models/User");

async function onlyAdmin(req, res, next) {
  const result = await User.find(req.session.userId);

  const isAdmin = result.rows[0].is_admin;

  if (!isAdmin) {
    return res.render('admin/users/index', {
      error: 'Você não está autorizado a realizar esta operação!'
    })
  }

  next();

}

module.exports = {
  onlyAdmin
}