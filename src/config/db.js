const { Pool } = require("pg");

module.exports = new Pool({
  user: "YOUR_USER",
  password: "YOUR_PASSWORD",
  host: "localhost",
  port: 5432,
  database: "foodfydb",
});
