const db = require("../../config/db");

module.exports = {
    all() {
        return db.query(`
            SELECT * FROM users
        `);
    },
    post({ name, email, isAdmin }) {
        const query = `
            INSERT INTO users (
                name,
                email,
                password,
                isAdmin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id     
        `;

        const newPassword = 1234

        const values = [
            name,
            email,
            newPassword,
            isAdmin
        ];

        return db.query(query, values);
    }
}