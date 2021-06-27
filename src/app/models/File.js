const db = require('../../config/db');
const fs = require('fs');

module.exports = {
	async create({ filename, path, fieldname }) {
		let query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id`;

		let values = [filename, path];

		// one file result
		const result = await db.query(query, values);
		const fileId = result.rows[0].id;

		if (fieldname == "photos") {
			return fileId;
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