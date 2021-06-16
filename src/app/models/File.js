const db = require('../../config/db');
const fs = require('fs');

module.exports = {
	async create({ filename, path, recipe_id }) {
		let query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id`;

		let values = [filename, path];

		//one file result
		const result = await db.query(query, values);
		const fileId = result.rows[0].id;

		if (recipe_id) {
			query = `
			INSERT INTO recipe_files (
				recipe_id,
				file_id
			)	VALUES ($1, $2)
			`
			values = [recipe_id, fileId]

			return db.query(query, values);
		}
	},
	async delete(id) {
		try {
			const results = await db.query('SELECT * FROM files WHERE id = $1', [id]);
			const file = results.rows[0]

			fs.unlinkSync(file.path);

			return db.query(`DELETE FROM files WHERE id = $1`, [id]);

		} catch (err) {
			throw new Error(err);
		}
	}
}