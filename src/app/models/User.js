const db = require("../../config/db");

module.exports = {
    all() {
        return db.query(`
            SELECT * FROM users
        `);
    },
    post({ name, email, is_admin }) {
        const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id     
        `;

        const newPassword = 1234

        const values = [
            name,
            email,
            newPassword,
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
    update(data) {
        const query = `
        UPDATE users SET
            name = ($1),
            email = ($2),
            is_admin = ($3)
        WHERE id = $4
        `;

        const values = [
            data.name,
            data.email,
            data.is_admin,
            data.id
        ];

        return db.query(query, values);
    }
}