const db = require("../../config/db");
const { date } = require('../../lib/utils');

module.exports = {
    all(callback) { },
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

}