const db = require("../../config/db");

const Base = require('./Base');

Base.init({ table: 'chefs' });

module.exports = {
    ...Base,
    findRecipe(id) {
        return db.query(`
            SELECT recipes.title, recipes.id, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            ORDER BY recipes.created_at DESC
            `, [id]);
    },
    async findFile(id) {

        const results = await db.query(`
        SELECT files.*
        FROM files
        INNER JOIN chefs ON (files.id = chefs.file_id)
        WHERE chefs.id = ${id};
        `);

        return results.rows;
    }
}
