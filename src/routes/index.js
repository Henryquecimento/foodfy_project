const express = require("express");
const routes = express.Router();
const public = require("../app/controllers/publicAccess/PublicController");

const admin = require('./admin');

routes.use("/admin", admin);

/* -- Public Access -- */
routes.get("/", public.index);
routes.get("/about", public.about);
routes.get("/recipes", public.recipes);
routes.get("/recipes/:id", public.show);
routes.get("/chefs", public.chefs);
routes.get("/chefs/:id", public.showChef);

module.exports = routes;
