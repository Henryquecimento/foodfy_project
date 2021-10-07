const db = require("../../config/db");

const Base = require('./Base');

Base.init({ table: 'recipes' });

module.exports = {
  ...Base,
  async chefSelectedOptions() {

    const results = await db.query(`
      SELECT id, name 
      FROM chefs
      ORDER BY id
    `);

    return results.rows;
  },
  async files(id) {
    const results = await db.query(`
    SELECT files.*
    FROM files
    LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    WHERE recipe_files.recipe_id = ${id}
    ORDER BY recipe_files.id
  `)

    return results.rows;
  },
  paginate(params) {
    const { filter, limit, offset } = params;

    let query = "",
      filterQuery = "",
      totalQuery = `(
          SELECT count(*) from recipes
        ) AS total`;

    if (filter) {
      filterQuery = `
        WHERE recipes.title ILIKE '%${filter}%'
      `;

      totalQuery = `(
        SELECT count(*) FROM recipes
        ${filterQuery}
      ) AS total`
    }

    query = `
    SELECT recipes.*, chefs.name AS chef_name, ${totalQuery}
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    ${filterQuery}
    ORDER BY updated_at DESC 
    LIMIT $1 OFFSET $2
    `;

    return db.query(query, [limit, offset]);
  }
};
