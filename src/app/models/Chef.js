const db = require("../../config/db");
const { date } = require('../../lib/utils');

module.exports = {
    all() {
        return db.query(`
                SELECT chefs.*, 
                (SELECT count (*) FROM recipes WHERE recipes.chef_id = chefs.id) AS total_recipes
                FROM chefs
                ORDER BY id
                `);
    },
    create({ name, file_id }) {
        const query = `
            INSERT INTO chefs (
                name,
                created_at,
                file_id
            ) VALUES ($1, $2, $3)
            RETURNING id     
        `;

        const values = [
            name,
            date(Date.now()).iso,
            file_id,
        ];

        return db.query(query, values);
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
            ORDER BY recipes.id`, [id]);
    },
    findFile(id) {
        return db.query(`
        SELECT files.*
        FROM files
        INNER JOIN chefs ON (files.id = chefs.file_id)
        WHERE chefs.id = $1;
        `, [id]);
    },
    update({ name, file_id, id }) {
        const query = `
            UPDATE chefs SET
                name = ($1),
                file_id = ($2)
            WHERE id = $3
        `;

        const values = [
            name,
            file_id,
            id
        ];

        return db.query(query, values);
    },
    delete(id) {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
    }
}