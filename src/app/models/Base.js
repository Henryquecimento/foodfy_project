const db = require('../../config/db');

async function find(table, filters) {
  let query = `SELECT * FROM ${table}`;

  if (filters) {
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
  }

  return db.query(query);

}

const Base = {
  init({ table }) {

    if (!table) throw new Error('Invalid Params!');

    this.table = table;

    return this;
  },
  async create(fields) {
    let keys = [];
    let values = [];

    Object.keys(fields).map(key => {

      keys.push(key);
      values.push(`'${fields[key]}'`);

    });

    const query = `
    INSERT INTO ${this.table} 
    (${keys.join(',')}) 
    VALUES (${values.join(',')})
    RETURNING id
    `;

    const results = await db.query(query);

    return results.rows[0].id;
  },
  async update(id, fields) {
    let update = [];

    Object.keys(fields).map(key => {

      const line = `${key} = '${fields[key]}'`;

      update.push(line);
    });

    let query = `
    UPDATE ${this.table} SET
    ${update.join(',')}
    WHERE id = ${id}
    `;

    await db.query(query);

    return;
  },
  async findOne(filters) {

    const results = await find(this.table, filters);

    return results.rows[0];
  },
  async findAll(filters) {

    const results = await find(this.table, filters);

    return results.rows;
  },
  delete(id) {
    return db.query(`
      DELETE FROM ${this.table} 
      WHERE id = ${id}`
    );

  },
  find,
}

module.exports = Base;