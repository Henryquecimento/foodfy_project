const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  all() {
    return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC     
    `);
  },
  create(data) {
    const query = `
      INSERT INTO recipes (
      chef_id,
      title,
      ingredients,
      preparation,
      information,
      created_at          
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`;

    const values = [
      data.chef_id,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso,
    ];

    return db.query(query, values);
  },
  find(id) {
    return db.query(
      ` SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1        
      `,
      [id]
    );
  },
  findBy(filter) {
    return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY updated_at DESC  
    `);
  },
  update(data) {
    const query = `
      UPDATE recipes SET
      chef_id = ($1),
      title = ($2),
      ingredients = ($3),
      preparation = ($4),
      information = ($5)
      WHERE id = $6`;

    const values = [
      data.chef_id,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id,
    ];

    return db.query(query, values);
  },
  async delete(id) {
    await db.query(`
    DELETE FROM files
    WHERE files.id IN (SELECT recipe_files.file_id 
    FROM recipe_files WHERE recipe_files.recipe_id = $1);
    `, [id]);

    return db.query("DELETE FROM recipes WHERE id = $1", [id]);
  },
  chefSelectedOptions() {
    return db.query(`
        SELECT id, name 
        FROM chefs
        ORDER BY id
    `);
  },
  files(id) {
    return db.query(`
      SELECT files.*
      FROM files
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
      WHERE recipe_files.recipe_id = $1
      ORDER BY recipe_files.id
    `, [id]);
  }
};
