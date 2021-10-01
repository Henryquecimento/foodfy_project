const { date } = require('../../../lib/utils');

const { unlinkSync } = require('fs');

const { LoadChef } = require('../../services/LoadChefs');

const Chef = require("../../models/Chef");
const Recipe = require("../../models/Recipe");
const File = require("../../models/File");

module.exports = {
	async index(req, res) {
		try {

			const chefs = await LoadChef.load('chefs');

			return res.render("admin/chefs/index", { chefs });
		} catch (err) {
			throw new Error(err);
		}
	},
	create(req, res) {
		return res.render("admin/chefs/create");
	},
	async post(req, res) {
		try {
			const keys = Object.keys(req.body);

			for (let key of keys) {
				if (req.body[key] == "" && key != "removed_files") {
					return res.send("Please, fill all the fields!");
				}
			}

			if (req.files.length == 0) {
				return res.send('Please, insert a avatar image!')
			}

			let fileId = await File.create({
				name: req.files[0].filename,
				path: req.files[0].path
			});

			const { name } = req.body;

			await Chef.create({
				name,
				created_at: date(Date.now()).iso,
				file_id: fileId
			});

			return res.render("admin/chefs/index", {
				success: "Chefe criado com sucesso!"
			});
		} catch (err) {
			console.error(err);

			return res.render('admin/chefs/create', {
				user: req.body,
				error: "Erro ao criar um novo chef. Por favor, tente novamente mais tarde!"
			});
		}
	},
	async show(req, res) {
		try {
			const chef = await LoadChef.load('chef', { where: { id: req.params.id } });

			let results = await Chef.findRecipe(req.params.id);

			const recipesPromise = results.rows.map(async recipe => {

				results = await Recipe.files(recipe.id);

				let files = results.rows.map(file => ({
					...file,
					src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
				}));

				recipe = {
					...recipe,
					files
				}

				return recipe;
			});

			const recipes = await Promise.all(recipesPromise);

			return res.render("admin/chefs/show", { chef, recipes });
		} catch (err) {
			throw new Error(err);
		}
	},
	async edit(req, res) {
		try {
			const chef = await LoadChef.load('chef', { where: { id: req.params.id } })

			return res.render("admin/chefs/edit", { chef });
		} catch (err) {
			throw new Error(err);
		}
	},
	async put(req, res) {
		try {
			const keys = Object.keys(req.body);

			for (let key of keys) {
				if (req.body[key] == "" && key != "removed_files") {
					return res.render(`admin/chefs/edit`, {
						chef: req.body,
						error: "Preencha todos os campos!"
					});
				}
			}

			const { id: chef_id, name, removed_files } = req.body;

			//Add image
			if (req.files.length != 0) {
				const fileId = await File.create({
					name: req.files[0].filename,
					path: req.files[0].path
				});

				await Chef.update(chef_id, {
					name,
					file_id: fileId
				});
			}

			//If not new image, update just the name
			await Chef.update(chef_id, { name });

			// removed files
			if (removed_files) {
				if (req.files.length === 0) {
					return res.render(`admin/chefs/edit`, {
						chef: req.body,
						error: "Adicione pelo menos uma imagem!"
					});
				}

				const removedFiles = req.body.removed_files.split(",");
				const file_id = removedFiles[0];

				const file = await File.findOne({ where: { id: file_id } });

				unlinkSync(file.path);

				await File.delete(file_id);

			}

			return res.render("admin/chefs/index", {
				success: "Chefe atualizado com sucesso!"
			});
		} catch (err) {
			console.error(err);

			return res.render(`admin/chefs/edit`, {
				chef: req.body,
				error: "Erro ao editar o chef. Por favor, tente novamente mais tarde!"
			});
		}
	},
	async delete(req, res) {
		try {

			const chef = await LoadChef.load('chef', { where: { id: req.body.id } })

			if (chef.total_recipes != 0) {
				return res.send("Chef possui receitas! Você não pode apagá-lo(a)!");
			}

			await Chef.delete(req.body.id);

			unlinkSync(chef.filePath);

			await File.delete(chef.file_id);

			return res.render("admin/chefs/index", {
				success: "Chefe removido com sucesso!"
			});
		} catch (err) {
			console.error(err);

			const chef = await LoadChef.load('chef', { where: { id: req.body.id } })

			return res.render(`admin/chefs/edit`, {
				chef,
				error: "Erro ao remover o chef. Por favor, tente novamente mais tarde!"
			});
		}
	},
};
