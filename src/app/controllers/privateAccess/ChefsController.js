const Chef = require("../../models/Chef");
const Recipe = require("../../models/Recipe");
const File = require("../../models/File");

module.exports = {
	async index(req, res) {
		try {
			let results = await Chef.all();
			const chefs = results.rows;

			for (chef in chefs) {

				results = await Chef.findFile(chefs[chef].id);
				const avatar = results.rows[0];

				chefs[chef] = {
					...chefs[chef],
					avatarName: avatar.name,
					src: `${req.protocol}://${req.headers.host}${avatar.path.replace("public", "")}`
				}
			}

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

			let results = await File.create({
				...req.files[0]
			});

			const fileId = results;

			results = await Chef.create({
				...req.body,
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
			let results = await Chef.find(req.params.id);
			const chef = results.rows[0];

			results = await Chef.findFile(req.params.id);
			let avatar = results.rows[0];

			avatar = {
				...avatar,
				src: `${req.protocol}://${req.headers.host}${avatar.path.replace("public", "")}`
			}

			results = await Chef.findRecipe(req.params.id);
			const recipes = results.rows;

			for (recipe in recipes) {
				results = await Recipe.files(recipes[recipe].id);
				let files = results.rows.map(file => ({
					...file,
					src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
				}));

				recipes[recipe] = {
					...recipes[recipe],
					files
				}
			}

			return res.render("admin/chefs/show", { chef, recipes, avatar });
		} catch (err) {
			throw new Error(err);
		}
	},
	async edit(req, res) {
		try {
			let results = await Chef.find(req.params.id);
			const chef = results.rows[0];

			results = await Chef.findFile(req.params.id);
			let file = results.rows[0];
			if (file) {
				file = {
					...file,
					src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
				}
			}

			return res.render("admin/chefs/edit", { chef, file });
		} catch (err) {
			throw new Error(err);
		}
	},
	async put(req, res) {
		try {
			const keys = Object.keys(req.body);

			for (let key of keys) {
				if (req.body[key] == "" && key != "removed_files") {
					return res.send("Please, fill all the fields!");
				}
			}

			let results = await Chef.find(req.body.id);
			let oldFile = results.rows[0].file_id;

			if (req.body.removed_files) {

				const removedFiles = req.body.removed_files.split(",");
				const lastIndex = removedFiles.length - 1;

				removedFiles.splice(lastIndex, 1);

				oldFile = Number(removedFiles[0]);

				await Chef.update({
					...req.body,
					file_id: null
				});

				await File.delete(oldFile);
			}

			if (req.files.length != 0) {
				results = await File.create({
					...req.files[0]
				});

				const fileId = results;

				await Chef.update({
					...req.body,
					file_id: fileId
				});
			} else {
				await Chef.update({
					...req.body,
					file_id: oldFile
				});
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
			//let
			let results = await Chef.find(req.body.id);
			const chef = results.rows[0];

			results = await Chef.findFile(req.body.id);
			const fileId = results.rows[0].id;

			if (chef.total_recipes != 0) {
				return res.send("Chef possui receitas! Você não pode apagá-lo(a)!");
			} else {
				await Chef.delete(req.body.id);

				await File.delete(fileId)

				return res.render("admin/chefs/index", {
					success: "Chefe removido com sucesso!"
				});
			}
		} catch (err) {
			console.error(err);

			const results = await Chef.find(req.body.id);

			return res.render(`admin/chefs/edit`, {
				chef: results.rows[0],
				error: "Erro ao remover o chef. Por favor, tente novamente mais tarde!"
			});
		}
	},
};
