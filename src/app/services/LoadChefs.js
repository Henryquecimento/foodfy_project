const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');

async function getImages(ChefId) {
  let files = await Chef.files(ChefId);


  files = files.map(file => ({
    ...file,
    path: file.path.replace(/\\/g, '/'),
    src: `${file.path.replace('public', "").replace(/\\/g, '/')}`
  }));

  return files;
}

async function format(chef) {
  const files = await getImages(chef.id);
  const recipes = await Recipe.findAll({ where: { chef_id: chef.id } })

  if (files[0] != undefined) {
    chef.img = files[0].src;
  } else {
    chef.img = null
  }

  chef.img = files[0].src;
  chef.filename = files[0].name;
  chef.filePath = files[0].path;
  chef.total_recipes = recipes.length;

  return chef;
}

const LoadChef = {
  load(service, filters) {
    this.filters = filters;

    return this[service]();
  },
  async chef() {
    try {
      const chef = await Chef.findOne(this.filters);

      return format(chef);
    } catch (err) {
      console.error(err);
    }
  },
  async chefs() {
    try {
      let chefs = await Chef.findAll(this.filters);

      const chefsPromise = chefs.map(format);

      return Promise.all(chefsPromise);
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = {
  LoadChef
}