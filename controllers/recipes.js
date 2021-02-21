const fs = require('fs');
const foods = require('../data'); 
const data = require('../data.json');

exports.index = (req, res) => {
    const recipes = data.recipes;

    return res.render('admin/recipes/index', { foods: recipes });
};

// Create
exports.create = (req, res) => {
    return res.render('admin/recipes/create');
};

// Post - Create
exports.post = (req, res) => {
    const keys = Object.keys(req.body);

    for (key of keys) {
        if(req.body[key] == "") {
            return res.send("Please, fill all the fields!");
        }
    };

    data.recipes.push({
        ...req.body
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if(err) return res.send("Write file error -- line 37, recipes.js");

        return res.render(`admin/recipes/${[data.recipes.length - 1]}`);
    });

};

// Show
exports.show = (req, res) => {
    const recipes = data.recipes;
    const recipeId = req.params.id;


    return res.render('admin/recipes/show', { foods: [recipes[recipeId]]});
};

// Edit
exports.edit = (req, res) => {
    return res.send('everything is ok')
    /* const { id } = req.body;

    const findRecipe = foods.find(recipe => {
        return id == recipe.id
    });

    if (!findRecipe) {
        return res.send("Recipe not found!");
    };

    fs.writeFile() */
};