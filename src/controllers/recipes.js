const fs = require('fs');
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

    const lastRecipe = data.recipes.length; // it'll represent my id/index
    

    data.recipes.push({
        ...req.body
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if(err) return res.send("Write file error -- line 37, recipes.js");

        return res.redirect(`/admin/recipes/${lastRecipe}`);
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
    const recipes = data.recipes;
    const recipeId = req.params.id;
    
    //Define - food.Variable
    return res.render('admin/recipes/edit', { foods: [recipes[recipeId]]});
};