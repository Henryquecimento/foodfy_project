const db = require("../../config/db");

const Base = require('./Base');

Base.init({ table: 'chefs' });

module.exports = {
    ...Base,
    all() {
        return db.query(`
                SELECT chefs.*, 
                (SELECT count (*) FROM recipes WHERE recipes.chef_id = chefs.id) AS total_recipes
                FROM chefs
                ORDER BY id
                `);
    },
    find(id) {
        const query = `
            SELECT chefs.*, 
            (SELECT count (*) FROM recipes WHERE recipes.chef_id = $1) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
        `;

        return db.query(query, [id]);
    },
    findRecipe(id) {
        return db.query(`
            SELECT recipes.title, recipes.id, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            ORDER BY recipes.created_at DESC
            `, [id]);
    },
    findFile(id) {
        return db.query(`
        SELECT files.*
        FROM files
        INNER JOIN chefs ON (files.id = chefs.file_id)
        WHERE chefs.id = $1;
        `, [id]);
    },
    delete(id) {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
    }
}