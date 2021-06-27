const Chef = require("../../models/Chef");
const Recipe = require("../../models/Recipe");
const File = require("../../models/File");

module.exports = {
	async index(req, res) {
		try {
			const results = await Chef.all();
			const chefs = results.rows;

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
				if (req.body[key] == "" && key == "removed_files") {
					return res.send("Please, fill all the fields!");
				}
			}

			let results = await File.create({
				...req.files[0]
			});

			const fileID = results;

			results = await Chef.create({
				...req.body,
				file_id: fileID
			});

			const chefId = results.rows[0].id;

			return res.redirect(`/admin/chefs/${chefId}`);
		} catch (err) {
			throw new Error(err);
		}
	},
	async show(req, res) {
		try {
			let results = await Chef.find(req.params.id);
			const chef = results.rows[0];

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

			return res.render("admin/chefs/show", { chef, recipes });
		} catch (err) {
			throw new Error(err);
		}
	},
	async edit(req, res) {
		try {
			const results = await Chef.find(req.params.id);
			const chef = results.rows[0];

			return res.render("admin/chefs/edit", { chef });
		} catch (err) {
			throw new Error(err);
		}
	},
	async put(req, res) {
		try {
			const keys = Object.keys(req.body);

			for (let key of keys) {
				if (req.body[key] == "") {
					return res.send("Please, fill all the fields!");
				}
			}

			await Chef.update(req.body);

			return res.redirect(`/admin/chefs/${req.body.id}`);
		} catch (err) {
			throw new Error(err);
		}
	},
	async delete(req, res) {
		try {
			//let
			const results = await Chef.find(req.body.id);
			const chef = results.rows[0];

			if (chef.total_recipes != 0) {
				return res.send("Chef possui receitas! Você não pode apagá-lo(a)!");
			} else {
				await Chef.delete(req.body.id);

				return res.redirect("/admin/chefs");
			}
		} catch (err) {
			throw new Error(err);
		}
	},
};
