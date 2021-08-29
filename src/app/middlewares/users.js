const Recipe = require('../models/Recipe');

async function onlyAdmin(req, res, next) {
  const { isAdmin } = req.session;

  if (!isAdmin) {
    return res.redirect('/admin/users');
  }

  next();

}

async function onlyUserCreator(req, res, next) {
  const { id } = req.params;
  const { userId, isAdmin } = req.session;

  const results = await Recipe.find(id);
  const recipe_userId = results.rows[0].user_id;

  if (userId != recipe_userId && !isAdmin) {
    return res.redirect('/admin/users');
  }

  next();
}

module.exports = {
  onlyAdmin,
  onlyUserCreator
}