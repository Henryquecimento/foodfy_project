const db = require('../../config/db');

module.exports = {
  async create({ filename, path, recipe_id }) {
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

    query = `
    INSERT INTO recipe_files (
      recipe_id,
      file_id
    )	VALUES ($1, $2)
    `
    values = [recipe_id, fileId]

    return db.query(query, values);
  },
  findById(id) {
    return db.query(`
    SELECT files.*
    FROM files
    LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    WHERE recipe_files.recipe_id = $1;
    `, [id])
  }
}