const db = require("../../config/db");

module.exports = {
    all() {
        return db.query(`
            SELECT * FROM users
        `);
    },
    post({ name, email, password, is_admin }) {
        const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id     
        `;

        const values = [
            name,
            email,
            password,
            is_admin
        ];

        return db.query(query, values);
    },
    async findOne(filters) {
        let query = `SELECT * FROM users`;

        Object.keys(filters).map(key => {
            query = `
            ${query}
            ${key}
            `

            Object.keys(filters[key]).map(field => {
                query = `
                ${query}
                ${field} = '${filters[key][field]}'
                `
            });
        });

        const results = await db.query(query);

        return results.rows[0];
    },
    find(id) {
        return db.query(`
        SELECT * FROM users
        WHERE users.id = $1`, [id]);
    },
    async update(id, fields) {
        let query = `UPDATE users SET`;

        Object.keys(fields).map((key, index, array) => {

            if ((index + 1) < array.length) {
                query = `
                    ${query}
                    ${key} = '${fields[key]}',
                `;
            } else {
                query = `
                    ${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}                
                `;
            }
        });

        await db.query(query);

        return;
    },
    delete(id) {

        return db.query(`
      DELETE FROM users WHERE id = $1
      `, [id]);

    }
}