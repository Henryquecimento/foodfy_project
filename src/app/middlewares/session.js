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

// First, I'll have to send user.isAdmin to session
/* function onlyAdmin(req, res, next) { 
  if (!req.session.isAdmin)
  next()
} */

module.exports = {
  onlyUsers,
  userIsLogged
}