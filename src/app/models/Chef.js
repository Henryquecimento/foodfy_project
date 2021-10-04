const db = require("../../config/db");

const Base = require('./Base');

Base.init({ table: 'chefs' });

module.exports = {
    ...Base,
    async files(id) {

        const results = await db.query(`
        SELECT files.*
        FROM files
        INNER JOIN chefs ON (files.id = chefs.file_id)
        WHERE chefs.id = ${id};
        `);

        return results.rows;
    }
}
