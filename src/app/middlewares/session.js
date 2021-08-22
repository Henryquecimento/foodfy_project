function onlyUsers(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/admin/login');
  }

  next();
}

function userIsLogged(req, res, next) {
  if (req.session.userId) {
    return res.redirect('/admin/users');
  }

  next();
}

module.exports = {
  onlyUsers,
  userIsLogged
}