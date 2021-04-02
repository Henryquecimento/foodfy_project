const db = require("../../config/db");

module.exports = {
    create(data, callback) {
        const query = `
       INSERT INTO recipes (
           chef_id,
           image,
           title,
           ingredients,
           preparation,
           information,
           created_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`

        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database Error! ${err}`;

            return callback(results.rows[0]);
        })
    }
}