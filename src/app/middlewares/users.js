const { LoadRecipe } = require('../services/LoadRecipes');

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

  const recipe = await LoadRecipe.load('recipe', { where: { id } });

  if (userId != recipe.user_id && !isAdmin) {
    return res.redirect('/admin/users');
  }

  next();
}

module.exports = {
  onlyAdmin,
  onlyUserCreator
}