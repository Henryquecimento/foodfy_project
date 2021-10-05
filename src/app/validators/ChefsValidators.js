
function checkAllfields(body) {
  const keys = Object.keys(body);

  for (let key of keys) {
    if (body[key] == "" && key != "removed_files") {
      return {
        chef: body,
        error: "Por favor, preencha todos os campos!"
      };
    }
  }

}

async function post(req, res, next) {

  const filledFields = checkAllfields(req.body);

  if (filledFields) return res.render('admin/chefs/create', filledFields);

  if (req.files.length == 0) {
    return res.render('admin/chefs/create', {
      chef: req.body,
      error: "Por favor, insira ao menos uma imagem!"
    });
  }

  next();
}

async function update(req, res, next) {

  const filledFields = checkAllfields(req.body);

  if (filledFields) return res.render('admin/chefs/edit', filledFields);

  next();
}

module.exports = {
  post,
  update
}