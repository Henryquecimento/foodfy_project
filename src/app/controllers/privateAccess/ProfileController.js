
module.exports = {
  async index(req, res) {

    const { user } = req;

    return res.render('admin/profile/edit.njk', { user });
  },
  async put(req, res) {
    const { user } = req;

    const { name, email } = req.body;

    await User.update(user.id, {
      name,
      email
    });

    return res.render('admin/profile');
  }
};
