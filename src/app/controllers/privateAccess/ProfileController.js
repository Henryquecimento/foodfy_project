
module.exports = {
  async index(req, res) {
    
    const { user } = req;

    return res.render('admin/profile/edit.njk', { user });
  },
  async put(req, res) {

  }
};
