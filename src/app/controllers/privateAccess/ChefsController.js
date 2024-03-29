const { date } = require('../../../lib/utils');

const { unlinkSync } = require('fs');

const { LoadChef } = require('../../services/LoadChefs');
const { LoadRecipe } = require('../../services/LoadRecipes');

const Chef = require("../../models/Chef");
const File = require("../../models/File");

module.exports = {
	async index(req, res) {
		try {

			const chefs = await LoadChef.load('chefs');

			return res.render("admin/chefs/index", { chefs });
		} catch (err) {
			console.error(err);

			return res.render("admin/message/error", {
				error: "Erro inesperado. Por favor, tente novamente mais tarde!"
			});
		}
	},
	create(req, res) {
		return res.render("admin/chefs/create");
	},
	async post(req, res) {
		try {

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

			return res.render("admin/message/success", {
				success: "Chefe criado com sucesso!"
			});
		} catch (err) {
			console.error(err);

			return res.render("admin/message/error", {
				error: "Erro ao criar um novo chef. Por favor, tente novamente mais tarde!"
			});
		}
	},
	async show(req, res) {
		try {
			const chef = await LoadChef.load('chef', { where: { id: req.params.id } });

			const recipes = await LoadRecipe.load('recipes', {
				where: {
					chef_id: req.params.id
				}
			});

			return res.render("admin/chefs/show", { chef, recipes });
		} catch (err) {
			console.error(err);

			return res.render("admin/message/error", {
				error: "Erro inesperado. Por favor, tente novamente mais tarde!"
			});
		}
	},
	async edit(req, res) {
		try {
			const chef = await LoadChef.load('chef', { where: { id: req.params.id } });

			return res.render("admin/chefs/edit", { chef });
		} catch (err) {
			console.error(err);

			return res.render("admin/message/error", {
				error: "Erro inesperado. Por favor, tente novamente mais tarde!"
			});
		}
	},
	async put(req, res) {
		try {

			const { id: chef_id, name, removed_files } = req.body;

			const chefFile = await Chef.files(chef_id);

			if (req.files.length != 0) {

				const fileId = await File.create({
					name: req.files[0].filename,
					path: req.files[0].path
				});

				await Chef.update(chef_id, {
					name,
					file_id: fileId
				});

				if (chefFile.length != 0) {
					const oldFile = await File.findOne({ where: { id: chefFile[0].id } });

					unlinkSync(oldFile.path);

					await File.delete(chefFile[0].id);
				}
			}

			await Chef.update(chef_id, { name });

			if (removed_files) {
				if (req.files.length === 0) {
					return res.render(`admin/chefs/edit`, {
						chef: req.body,
						error: "Por favor, adicione pelo menos uma imagem!",
					});
				}

				const removedFiles = removed_files.split(",");
				const file_id = removedFiles[0];

				await File.delete(file_id);

			}

			return res.render("admin/message/success", {
				success: "Chefe atualizado com sucesso!"
			});
		} catch (err) {
			console.error(err);

			return res.render("admin/message/error", {
				error: "Erro ao editar o chef. Por favor, tente novamente mais tarde!"
			});
		}
	},
	async delete(req, res) {
		try {

			const chef = await LoadChef.load('chef', { where: { id: req.body.id } });

			if (chef.total_recipes != 0) {
				return res.render(`admin/chefs/edit`, {
					chef,
					error: "Chef possui receitas! Você não pode apagá-lo(a)!"
				});
			}

			await Chef.delete(req.body.id);

			unlinkSync(chef.filePath);

			await File.delete(chef.file_id);

			return res.render("admin/message/success", {
				success: "Chefe removido com sucesso!"
			});
		} catch (err) {
			console.error(err);

			return res.render("admin/message/error", {
				error: "Erro ao remover o chef. Por favor, tente novamente mais tarde!"
			});
		}
	},
};
