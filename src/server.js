const express = require("express");
const nunjucks = require("nunjucks");
const routes = require("./routes/index");
const session = require('../src/config/session');
const methodOverride = require("method-override");

const server = express();

server.use(session);

server.use((req, res, next) => {
  res.locals.session = req.session;

  next();
});

server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use(methodOverride("_method"));
server.use(routes);

server.set("view engine", "njk");

nunjucks.configure("src/app/views", {
  express: server,
  autoescape: false,
  noCache: true,
});

server.listen(5000, () => {
  console.log("Server is running normally");
});
