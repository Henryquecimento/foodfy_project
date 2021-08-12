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

    const { name, email, is_admin } = req.body;

    const results = await User.post({ name, email, is_admin });

    const userId = results.rows[0].id;

    return res.redirect(`/admin/users/${userId}/edit`);
  },
  async edit(req, res) {

    const results = await User.find(req.params.id);

    const user = results.rows[0];

    return res.render(`admin/users/edit`, { user });
  },
  async put(req, res) {

    await User.update(req.body.id, {
      ...req.body
    });

    return res.redirect(`/admin/users`);
  },
  async delete(req, res) {

    await User.delete(req.body.id);

    return res.redirect(`/admin/users`);
  }
}