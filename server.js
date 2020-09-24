const express = require('express');
const nunjucks = require('nunjucks');
const data = require('./data');
const cards = require('./data');

const server = express();

server.listen(5000, () => {
    console.log('Server is running normally');
});

server.use(express.static('public'));

server.set('view engine', 'njk');

nunjucks.configure('views', {
    express: server,
    noCache: true,
});

server.get('/', (req, res) => {
    return res.render('page', { cards: cards });
});

server.get('/about', (req, res) => {
    return res.render('about');
});

server.get('/recipes', (req, res) => {
    return res.render('recipes', { cards: cards });
});

server.get("/recipes/:index", (req, res) => {
    const recipes = cards;
    const recipeIndex = req.params.index;

    return res.render('recipe', { foods: [recipes[recipeIndex]]});
});
