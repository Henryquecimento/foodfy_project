const User = require("../../models/User");

module.exports = {
  async list(req, res) {
    const results = await User.all();

    const users = results.rows;

    return res.render('admin/users/index.njk', { users });
  },
  create(req, res) {
    return res.render('admin/users/create.njk');
  },
  async post(req, res) {

    const { name, email, isAdmin } = req.body;

    const results = await User.post({name, email, isAdmin});

    const user = results.rows[0];

    return res.redirect('/admin/users');
  }

}