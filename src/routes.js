const express = require('express');
const routes = express.Router();
const foods = require('./data'); 
const recipes = require('./controllers/recipes');

routes.get('/', (req, res) => {
    return res.render('publicAccess/index', { foods }); //{ foods });src\views\publicAccess\index.njk
});

routes.get('/about', (req, res) => {
    return res.render('publicAccess/about');
});

routes.get('/recipes', (req, res) => {
    return res.render('publicAccess/recipes', { foods });
});

routes.get("/recipes/:index", (req, res) => {
    const recipes = foods;
    const recipeIndex = req.params.index;

    return res.render('publicAccess/recipe', { foods: [recipes[recipeIndex]]});
});

/* -- RECIPE MANAGER */

routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create );
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit);

routes.post("/admin/recipes", recipes.post);

module.exports = routes;
