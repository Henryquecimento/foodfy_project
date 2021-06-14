const db = require('../../config/db');
const fs = require('fs');

module.exports = {
  create({ filename, path }) {
    const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id`;

    const values = [
      filename,
      path,
    ];

    return db.query(query, values);
  },
  recipeFiles(id) {
    return db.query(`
      INSERT INTO recipe_files (recipe_id, file_id)
      SELECT recipes.id , files.id
      FROM recipes, files
      WHERE recipes.id = $1
    `, [id]);
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