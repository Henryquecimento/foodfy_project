
module.exports = {
  loginForm(req, res) {
    return res.render('admin/session/login');
  },
  login(req, res) {
    req.session.userId = req.user.id;

    return res.redirect('/admin/profile');
  },
  logout(req, res) {
    req.session.destroy();

    return res.redirect('/');
  },
  forgotForm(req, res) {
    return res.render('admin/session/forgot-password')
  }
}

