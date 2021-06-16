const db = require('../../config/db');
const fs = require('fs');

module.exports = {
	create({ filename, path }) {
		let query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id`;

		return db.query(query, [filename, path]);
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