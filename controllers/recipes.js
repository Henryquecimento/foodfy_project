const fs = require('fs');
const foods = require('../data'); 

exports.index = (req, res) => {
    return res.render('admin/recipes/index', { foods });
};

exports.create = (req, res) => {
    return res.render('admin/recipes/create');
};

exports.show = (req, res) => {
    const recipes = foods;
    const recipeId = req.params.id;


    return res.render('admin/recipes/show', { foods: [recipes[recipeId]]});
};

exports.edit = (req, res) => {
    return res.send('Everything is ok!');
};