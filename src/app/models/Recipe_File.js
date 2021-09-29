const db = require('../../config/db');
const Base = require('./Base');

Base.init({ table: 'recipe_files' });

module.exports = {
  ...Base,
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
  }
}