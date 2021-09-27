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
  async findOne(filters) {

    const results = await find(this.table, filters);

    return results.rows[0];
  },
  async findAll(filters) {

    const results = await find(this.table, filters);

    return results.rows;
  },
  find,
}

module.exports = Base;