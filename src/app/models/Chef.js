const db = require("../../config/db");
const { date } = require('../../lib/utils');

module.exports = {
    all(callback) {
        db.query(`
            SELECT *
            FROM chefs
            ORDER BY id
        `, (err, results) => {
            if (err) throw `Database error! ${err}`;

            return callback(results.rows);
        })

    },
    create(data, callback) {
        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id     
        `;

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso,
        ];

        db.query(query, values, (err, results) => {
            if (err) throw `Database Error! ${err}`;

            return callback(results.rows[0]);
        });
    },
    find(id, callback) {
        const query = `
            SELECT chefs.*, 
            (SELECT count (*) FROM recipes WHERE recipes.chef_id = $1) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
        `;

        db.query(query, [id], (err, results) => {
            if (err) throw `Database error! ${err}`;

            return callback(results.rows[0]);
        });

    },
    findRecipe(id, callback) {
        db.query(`
        SELECT recipes.image, recipes.title, recipes.id, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
        `, [id], (err, results) => {
            if (err) throw `Database error! ${err}`;

            return callback(results.rows);
        });
    },
    update(data, callback) {
        const query = `
            UPDATE chefs SET
                name = ($1),
                avatar_url = ($2)
            WHERE id = $3
        `;

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ];

        db.query(query, values, (err, results) => {
            if (err) throw `Database error! ${err}`;

            return callback();
        });
    },
    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], (err, results) => {
            if (err) throw `Database error! ${err}`;

            return callback();
        })
    }
}