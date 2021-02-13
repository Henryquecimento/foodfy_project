const express = require('express');
const routes = express.Router();
const foods = require('./data'); 
const data = require('./data.json');

routes.get('/', (req, res) => {
    return res.render('index', { foods });
});

routes.get('/about', (req, res) => {
    return res.render('about');
});

routes.get('/recipes', (req, res) => {
    return res.render('recipes', { foods });
});

routes.get("/recipes/:index", (req, res) => {
    const recipes = foods;
    const recipeIndex = req.params.index;

    return res.render('recipe', { foods: [recipes[recipeIndex]]});
});

module.exports = routes;
