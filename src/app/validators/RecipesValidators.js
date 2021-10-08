
const Recipe = require("../models/Recipe");

async function checkAllfields(body) {

  const options = await Recipe.chefSelectedOptions();

  const keys = Object.keys(body);

  for (let key of keys) {
    if (body[key] == "" && key != "removed_files") {
      return {
        recipe: body,
        chefOptions: options,
        error: "Por favor, preencha todos os campos!"
      };
    }
  }

}

async function post(req, res, next) {

  const filledFields = await checkAllfields(req.body);

  if (filledFields) return res.render('admin/recipes/create', filledFields);

  const options = await Recipe.chefSelectedOptions();

  if (req.files.length == 0) {
    return res.render('admin/recipes/create', {
      recipe: req.body,
      chefOptions: options,
      error: "Por favor, insira ao menos uma imagem!"
    });
  }

  next();
}

async function update(req, res, next) {

  const filledFields = await checkAllfields(req.body);

  if (filledFields) return res.render('admin/recipes/edit', filledFields);

  next();
}

module.exports = {
  post,
  update
}